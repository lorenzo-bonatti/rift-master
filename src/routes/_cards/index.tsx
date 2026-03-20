import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_cards/")({
    component: RouteComponent,
});

function RouteComponent() {
    return null;
}
