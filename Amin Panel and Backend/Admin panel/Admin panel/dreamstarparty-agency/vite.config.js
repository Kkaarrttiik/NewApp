import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "lottie-web": "lottie-web/build/player/lottie_light.js",
    },
    dedupe: ["jquery", "moment"],
  },
  optimizeDeps: {
    include: [
      "jquery",
      "moment",
      "bootstrap-daterangepicker",
      "react-bootstrap-daterangepicker",
      "lottie-react",
    ],
  },
  build: {
    commonjsOptions: {
      include: [/bootstrap-daterangepicker/, /node_modules/],
    },
    outDir: "dist",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
