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
    orientation?: string | null;

    set?: {
        order: number | null;
    } | null;

    // Prices
    prices?: IPrice[];
}

export interface ICardDetail extends ICard {
    energy: number | null;
    power: number | null;
    might: number | null;

    rarity: {
        code: string;
    } | null;
    type: {
        code: string;
    } | null;
    supertype: {
        code: string;
    } | null;

    card_domain: { domain: { code: string } }[];
    card_tag: { tag: { code: string } }[];
}
