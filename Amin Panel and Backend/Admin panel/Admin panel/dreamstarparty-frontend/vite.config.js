import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
  },
  optimizeDeps: {
    include: ["jquery", "moment"],
    entries: ["src/globals.js", "src/main.jsx"],
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore "eval" warning from third-party packages
        if (warning.code === "EVAL" || (warning.message && warning.message.includes("eval"))) {
          return;
        }
        warn(warning);
      },
    },
  },
});
