import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    base: "/",
    build: {
        sourcemap: true, // or 'hidden'
        outDir: "public/build", // default for laravel-vite-plugin
        emptyOutDir: true,
    },
    server: {
        port: 4173, // make this match the port you're accessing
        strictPort: true, // fail if port is busy
    },
    plugins: [
        laravel({
            input: "resources/js/app.js",
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
});
