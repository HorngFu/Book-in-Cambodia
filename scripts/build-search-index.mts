// Writes public/search-index.json from the content files. Runs before `next dev`
// and `next build`. Fails if the gzipped index grows past the budget.
//
//   npm run search-index

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import type { SearchIndexFile } from "../src/lib/search/core";
import { buildSearchDocs } from "../src/lib/search/build";

const BUDGET_KB = 500;

const docs = await buildSearchDocs();
const file: SearchIndexFile = { version: 1, generatedAt: new Date().toISOString(), docs };
const json = JSON.stringify(file);
const out = join(process.cwd(), "public", "search-index.json");
mkdirSync(join(process.cwd(), "public"), { recursive: true });
writeFileSync(out, json);

const gzipKb = gzipSync(json).length / 1024;
console.log(
  `search-index.json: ${docs.length} books, ${(Buffer.byteLength(json) / 1024).toFixed(1)} KB, ${gzipKb.toFixed(1)} KB gzip (budget ${BUDGET_KB} KB)`,
);
if (gzipKb > BUDGET_KB) {
  console.error("Search index is over budget; see Phase 9 (server-side search with D1).");
  process.exit(1);
}
