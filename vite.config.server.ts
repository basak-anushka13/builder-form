import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  build: {
    ssr: true,
    target: "node18",
    outDir: "dist/server",
    rollupOptions: {
      input: "server/node-build.ts",
      output: {
        format: "es",
        entryFileNames: "node-build.mjs",
      },
      external: ["express", "dotenv", "mongoose"],
    },
  },
});
