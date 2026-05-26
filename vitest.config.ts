import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      // Only measure coverage for files that are actually testable in isolation
      // (pure utility functions — no Next.js/browser context required)
      include: ["src/lib/**/*.ts"],
      exclude: ["src/lib/**/*.d.ts"],
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
