import type { IPrice } from "./price";

export interface ICard {
    id: number;
    name: string;
    collector_number: number | null;
    public_code?: string | null;
    rich_text?: string | null;
    media: {
        image_url: string | null;
    } | null;

    set?: {
        order: number | null;
    } | null;

    // Prices
    prices?: IPrice[];
}
