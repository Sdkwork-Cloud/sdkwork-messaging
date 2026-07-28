import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ["react", "react-dom"] },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["packages/**/*.test.ts", "packages/**/*.test.tsx", "tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
