import { keystaticStorageMode } from "@/keystatic.config";

/**
 * The editor works in development (local files) and in production only once
 * GitHub mode is configured. A production build in local mode can't save
 * anything (Workers have no filesystem), so the editor is switched off there.
 */
export const editorEnabled =
  process.env.NODE_ENV !== "production" || keystaticStorageMode === "github";
