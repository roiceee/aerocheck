import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "apple-touch.png",
        "favicon.ico",
        "icon-192.png",
        "icon-512.png",
        "pattern.webp",
        "robots.txt",
        "sample.mp3",
      ],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,mp3,ttf,webp,jpeg,jpg}"],
      },
      manifest: {
        name: "Breakout game",
        short_name: "Breakout game",
        description: "Breakout game, have fun while learning!",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
