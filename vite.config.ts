import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "next/link": path.resolve(import.meta.dirname, "./src/compat/next-link.tsx"),
      "next/navigation": path.resolve(import.meta.dirname, "./src/compat/next-navigation.ts"),
      "next/image": path.resolve(import.meta.dirname, "./src/compat/next-image.tsx"),
      "next/headers": path.resolve(import.meta.dirname, "./src/compat/next-headers.ts"),
    },
  },
  define: {
    "process.env": {},
  },
  server: {
    port: 3000,
    open: true,
  },
});
