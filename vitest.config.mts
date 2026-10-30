import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: "@/keystatic.config", replacement: r("./keystatic.config.ts") },
      { find: /^@\//, replacement: `${r("./src")}/` },
      { find: "server-only", replacement: r("./test/server-only-stub.ts") },
    ],
  },
  test: {
    include: ["src/**/*.test.ts", "test/**/*.test.ts"],
  },
});
