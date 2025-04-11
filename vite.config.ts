import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    react(),
    VitePWA({
      includeAssets: ["robots.txt", "pwa/*.png"],
      manifest: {
        name: "Programmable Timer",
        short_name: "Timer",
        description: "An awesome programmable timer app",
        orientation: "portrait",
        display: "standalone",
        scope: "/",
        start_url: "/",
        related_applications: [
          {
            platform: "webapp",
            url: "https://programmable-timer.netlify.app/manifest.webmanifest",
          },
        ],
        theme_color: "#000000",
        background_color: "#000000",
        icons: [
          {
            src: "pwa/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "pwa/screenshot-wide-1.png",
            type: "image/png",
            sizes: "1280x720",
            form_factor: "wide",
            label: "Home screen",
          },
          {
            src: "pwa/screenshot-wide-2.png",
            type: "image/png",
            sizes: "1280x720",
            form_factor: "wide",
            label: "Running timer",
          },
          {
            src: "pwa/screenshot-narrow-1.png",
            type: "image/png",
            sizes: "800x1200",
            form_factor: "narrow",
            label: "Home screen",
          },
          {
            src: "pwa/screenshot-narrow-2.png",
            type: "image/png",
            sizes: "800x1200",
            form_factor: "narrow",
            label: "Running timer",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "lib": import.meta.resolve("./lib"),
      "src": import.meta.resolve("./src"),
    },
  },
});
