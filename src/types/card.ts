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
        riftbound_id: string;
        tcgplayer_id: string;
    } | null;

    // Prices
    prices?: IPrice[];
}
