import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const sslDir = path.resolve(__dirname, "../ssl");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    https: {
      key: fs.readFileSync(path.resolve(sslDir, "key.pem")),
      cert: fs.readFileSync(path.resolve(sslDir, "cert.pem")),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
