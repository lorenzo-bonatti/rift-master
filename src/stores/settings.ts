import { create } from "zustand";
import { persist } from "zustand/middleware";

import { name } from "../../package.json";

interface IState {
    language: string;
}

interface IActions {
    setLanguage: (language: string) => void;
}

export const useSettingsStore = create<IState & IActions>()(
    persist(
        (set) => ({
            language: "it",
            setLanguage: (language: string) => set({ language }),
        }),
        { name: `${name}-settings`, version: 1 },
    ),
);
