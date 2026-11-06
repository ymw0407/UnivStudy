import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  base: "/system_rust_wiki/",
  plugins: [react(), vanillaExtractPlugin()],
});
