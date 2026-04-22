import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/library")({
    component: LibraryPage,
    beforeLoad: ({ context }) => {
        if (!context.user) throw redirect({ to: "/login" });
    },
});

function LibraryPage() {
    return (
        <div className="page">
            <div className="py-2 px-4">
                <h1 className="text-2xl font-bold">Library</h1>
            </div>
            <div className="page-content" />
        </div>
    );
}
