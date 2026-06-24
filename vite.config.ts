import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative base so the built assets resolve when served from a nested
  // path (e.g. raw.githack.com/<user>/<repo>/<sha>/dist/index.html).
  base: "./",
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
