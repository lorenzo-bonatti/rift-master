import { create } from "zustand";
import { persist } from "zustand/middleware";

import { name } from "../../package.json";

interface IState {
    priceCountry: string;
}

interface IActions {
    setPriceCountry: (country: string) => void;
}

export const useSettingsStore = create<IState & IActions>()(
    persist(
        (set) => ({
            priceCountry: "it",
            setPriceCountry: (country: string) => set({ priceCountry: country }),
        }),
        { name: `${name}-settings`, version: 1 },
    ),
);
