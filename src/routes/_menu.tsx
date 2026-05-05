import { BottomNav } from "@components/bottom-nav";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Fragment } from "react";

export const Route = createFileRoute("/_menu")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Fragment>
            <Outlet />
            <BottomNav />
        </Fragment>
    );
}
