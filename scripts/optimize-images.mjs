// Resize uploaded images to at most 600 px wide and convert them to WebP,
// then update the content files that point at the old file names.
//
//   npm run images
//
// Run it after adding covers or photos in Keystatic, before committing.

import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMAGE_DIRS = ["public/covers", "public/authors", "public/stores", "public/import-services"];
const MAX_WIDTH = 600;
const CONVERT = new Set([".jpg", ".jpeg", ".png"]);

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])),
  );
  return files.flat();
}

const toPublicUrl = (file) => `/${relative(join(ROOT, "public"), file).split(sep).join("/")}`;

const renames = new Map();
let resized = 0;

for (const dir of IMAGE_DIRS) {
  for (const file of await walk(join(ROOT, dir))) {
    const ext = extname(file).toLowerCase();
    if (!CONVERT.has(ext) && ext !== ".webp") continue;

    const image = sharp(file);
    const { width = 0 } = await image.metadata();
    const needsResize = width > MAX_WIDTH;
    if (ext === ".webp" && !needsResize) continue;

    const output = ext === ".webp" ? file : file.slice(0, -ext.length) + ".webp";
    const buffer = await image
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    await writeFile(output, buffer);
    if (output !== file) {
      await rm(file);
      renames.set(toPublicUrl(file), toPublicUrl(output));
    }
    resized++;
    console.log(`✓ ${relative(ROOT, output)} (${Math.round(buffer.length / 1024)} KB)`);
  }
}

if (renames.size > 0) {
  for (const file of await walk(join(ROOT, "content"))) {
    if (!/\.(ya?ml|json|mdoc)$/.test(file)) continue;
    let text = await readFile(file, "utf8");
    let changed = false;
    for (const [from, to] of renames) {
      if (text.includes(from)) {
        text = text.split(from).join(to);
        changed = true;
      }
    }
    if (changed) {
      await writeFile(file, text);
      console.log(`  updated ${relative(ROOT, file)}`);
    }
  }
}

console.log(resized === 0 ? "All images are already optimized." : `Optimized ${resized} image(s).`);
