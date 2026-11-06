import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  base: "./",
  build: { outDir: '../../../dist/rust', emptyOutDir: true },
  plugins: [react(), vanillaExtractPlugin()],
});
