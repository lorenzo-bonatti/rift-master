import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { queryClient } from "./integration/query-client";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import type { ICard } from "./types/card";

const router = createRouter({ routeTree, context: { queryClient, user: null } });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

declare module "@tanstack/history" {
    interface HistoryState {
        card?: ICard;
    }
}

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </StrictMode>,
);
