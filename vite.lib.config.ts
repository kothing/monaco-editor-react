import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import packageJson from "./package.json";

const getPackageName = () => {
  return packageJson.name;
};

const getPackageNameCamelCase = () => {
  try {
    return getPackageName().replace(/-./g, (char) => char[1].toUpperCase());
  } catch (err) {
    throw new Error("Name property in package.json is missing.");
  }
};

const fileName = {
  es: `${getPackageName()}.mjs`,
  cjs: `${getPackageName()}.cjs`,
  iife: `${getPackageName()}.iife.js`,
  umd: `${getPackageName()}.umd.js`,
};

module.exports = defineConfig({
  base: "./",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.jsx"),
      name: getPackageNameCamelCase(),
      formats: ["es", "cjs", "iife", "umd"],
      fileName: (format) => fileName[format],
    },
    rollupOptions: {
      output: { assetFileNames: `${getPackageName()}.[ext]` },
    },
    emptyOutDir: true,
    assetsDir: "assets",
  },
  plugins: [react({})],
  resolve: {
    alias: {
      "@/*": path.resolve(__dirname, "src"),
    },
  },
});
