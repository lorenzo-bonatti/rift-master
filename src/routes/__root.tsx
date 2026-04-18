import { App } from "@capacitor/app";
import { Capacitor, SystemBars, SystemBarsStyle } from "@capacitor/core";
import { HeroUIProvider, Spinner } from "@heroui/react";
import type { User } from "@supabase/supabase-js";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect, useTransition } from "react";
import { BottomNav } from "../components/bottom-nav";
import { supabase } from "../integration/supabase";

export interface RouterContext {
    queryClient: QueryClient;
    user: User | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootLayout,
    beforeLoad: async () => {
        const { data } = await supabase.auth.getSession();
        return { user: data.session?.user ?? null };
    },
});

function RootLayout() {
    const [isPending, startTransition] = useTransition();
    const { user } = Route.useRouteContext();
    const router = useRouter();

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

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") {
                router.navigate({ to: "/login" });
            } else if (event === "TOKEN_REFRESHED") {
                router.invalidate();
            }
        });
        return () => subscription.unsubscribe();
    }, [router]);

    return (
        <HeroUIProvider>
            {isPending ? (
                <div className="grid place-content-center w-screen h-screen">
                    <Spinner label="Loading" variant="wave" />
                </div>
            ) : (
                <>
                    <Outlet />
                    {user && <BottomNav />}
                </>
            )}
        </HeroUIProvider>
    );
}
