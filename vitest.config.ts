import { defineConfig } from "vitest/config";
import path from "node:path";

// Scoped to plain TypeScript modules (e.g. src/lib/fit-check/scoring.ts) —
// no React/DOM rendering is tested here, so no jsdom environment or Next.js
// plugin is needed.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
