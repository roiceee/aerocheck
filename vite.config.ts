import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: "prompt",
    //   workbox: {
    //     globPatterns: ["**/*.{js,css,html,ico,png,svg,mp3,ttf,webp,jpeg,jpg}"],
    //     // 5 MB
    //     maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    //   },
    //   devOptions: {
    //     enabled: true,
    //   },
    //   manifest: {
    //     name: "AeroCheck",
    //     short_name: "AeroCheck",
    //     description: "Digital Pre-flight system",
    //     theme_color: "#ffffff",
    //     icons: [
    //       {
    //         src: "icon-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //       {
    //         src: "icon-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //     ],
    //   },
    // }),
  ],
});
