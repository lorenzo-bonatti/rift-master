import type { IPrice } from "./price";

export interface ICard {
    id: number;
    name: string;
    collector_number: number | null;
    rich_text?: string | null;
    media: {
        image_url: string | null;
    } | null;
    set: {
        id: number;
        name: string;
        order: number | null;
        riftbound_id: string;
    } | null;

    // Prices
    prices?: IPrice[];
}
