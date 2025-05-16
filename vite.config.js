import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import vue from "@vitejs/plugin-vue";
import { visualizer } from "rollup-plugin-visualizer";
import Pages from "vite-plugin-pages";

export default defineConfig({
    base: "/",

    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.js"],
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
        Pages({
            dirs: "resources/js/Pages",
            exclude: ["**/Auth/*.vue"], // 👈 exclude Auth pages
        }),
        visualizer({ open: false }),
    ],
});
