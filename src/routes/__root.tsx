import { App } from "@capacitor/app";
import { Capacitor, SystemBars, SystemBarsStyle } from "@capacitor/core";
import { HeroUIProvider, Spinner } from "@heroui/react";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { useEffect, useTransition } from "react";

export interface RouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootLayout,
});

function RootLayout() {
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        startTransition(async () => {
            await SystemBars.setStyle({ style: SystemBarsStyle.Light });
        });

        App.addListener("backButton", ({ canGoBack }) => {
            if (canGoBack) window.history.back();
            else App.exitApp();
        });
    }, []);

    return (
        <HeroUIProvider>
            {isPending ? (
                <div className="grid place-content-center w-screen h-screen">
                    <Spinner label="Loading" variant="wave" />
                </div>
            ) : (
                <Outlet />
            )}
        </HeroUIProvider>
    );
}
