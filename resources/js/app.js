import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createApp, h } from "vue";
import { ZiggyVue } from "../../vendor/tightenco/ziggy";

import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";

import ToastService from "primevue/toastservice";

import Toast from "primevue/toast"; // ✅ import Toast component

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

document.addEventListener("DOMContentLoaded", () => {
    createInertiaApp({
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.vue`,
                import.meta.glob("./Pages/**/*.vue")
            ),
        setup({ el, App, props, plugin }) {
            const vueApp = createApp({ render: () => h(App, props) });

            vueApp
                .use(plugin)
                .use(ZiggyVue)
                .use(PrimeVue, {
                    theme: {
                        preset: Aura,
                        options: {
                            prefix: "p",
                            darkModeSelector: "light",
                            cssLayer: false,
                        },
                    },
                })
                .use(ToastService); // ✅ Use the toast service

            vueApp.component("Toast", Toast); // ✅ Register Toast component globally

            return vueApp.mount(el);
        },
        progress: {
            color: "#4B5563",
        },
    });
});
