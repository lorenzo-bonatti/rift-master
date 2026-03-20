export interface IPrice {
    /**
     * Blueprint ID of the card (CardTrader internal ID)
     * @example 12345
     */
    blueprint_id: number | null;
    /**
     * Country code
     * @example "IT"
     */
    country_code: string;
    /**
     * Min price
     */
    min_price_cents: number;
    /**
     * Avg price
     */
    avg_price_cents: number;
    /**
     * CardMarket card id
     * @TODO: implement to the table
     */
    card_market_id?: number | null;
    /**
     * TCGPlayer card id
     * @TODO: implement to the table
     */
    tcgplayer_id?: number | null;
    // @TODO: replace with updated_at when available
    created_at: string;
}
