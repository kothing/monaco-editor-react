import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

module.exports = defineConfig({
  base: "./",
  plugins: [react({})],
});
