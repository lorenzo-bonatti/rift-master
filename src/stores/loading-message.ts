import type { ReactNode } from "react";
import { create } from "zustand";

interface IState {
    messages: { id: string; content: ReactNode }[];
}

interface IActions {
    setMessage: (id: string, content: ReactNode) => void;
    clearMessage: (id: string) => void;
}

export const useLoadingMessage = create<IState & IActions>((set) => ({
    messages: [],
    setMessage: (id, content) => {
        set((state) => {
            const existingIndex = state.messages.findIndex((m) => m.id === id);
            if (existingIndex === -1) return { messages: [...state.messages, { id, content }] };
            return { messages: state.messages.map((m, i) => (i === existingIndex ? { id, content } : m)) };
        });
    },
    clearMessage: (id) => {
        set((state) => ({
            messages: state.messages.filter((m) => m.id !== id),
        }));
    },
}));
