import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { EventBusProvider } from "./EventBus";
import { useState } from "react";
import { ThemeProvider } from "./ThemeContext";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // root.render(<App {...props} />);
        root.render(
            <EventBusProvider>
                <ThemeProvider>
                    <App {...props} />
                </ThemeProvider>
            </EventBusProvider>
        );
    },
    progress: {
        // color: "#4B5563",
        color: "#001aa5",
    },
});
