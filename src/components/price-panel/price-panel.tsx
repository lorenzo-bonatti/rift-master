import { Button, Card, CardBody, CardFooter, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { languages } from "../../configs/languages";
import type { IPrice } from "../../types/price";

interface IProps {
    prices: IPrice[];
}

export const PricePanel = ({ prices }: IProps) => {
    const [selectedCode, setSelectedCode] = useState("it");

    const price = prices.find((p) => p.country_code.toLowerCase() === selectedCode);

    const formatPrice = (cents: number | undefined) => (cents !== undefined ? `${(cents / 100).toFixed(2)}€` : "N/D");

    return (
        <Card style={{ backgroundColor: "#142544" }} className="text-white shrink-0">
            <div className="pt-6 px-4">
                <img src="/cardtrader.svg" alt="CardTrader" className="w-full object-container" />
            </div>
            <CardBody>
                <div className="flex justify-between items-end mb-4">
                    <Select
                        selectedKeys={[selectedCode]}
                        onSelectionChange={(keys) => {
                            const key = Array.from(keys)[0] as string;
                            if (key) setSelectedCode(key);
                        }}
                        size="sm"
                        className="max-w-32"
                        classNames={{ trigger: "bg-white/10 text-white", value: "text-white" }}
                        startContent={
                            <img
                                src={`/flags/${selectedCode}.png`}
                                alt={selectedCode}
                                className="w-5 object-cover shrink-0"
                            />
                        }
                        aria-label="Seleziona paese"
                    >
                        {languages.map((lang) => (
                            <SelectItem
                                key={lang.code}
                                startContent={
                                    <img src={`/flags/${lang.code}.png`} alt={lang.code} className="w-5 object-cover" />
                                }
                            >
                                {lang.name}
                            </SelectItem>
                        ))}
                    </Select>
                    <div className="flex space-x-8 text-right">
                        <div>
                            <small className="text-sm text-gray-400">Min. Price</small>
                            <p className="text-2xl! font-bold!">{formatPrice(price?.min_price_cents)}</p>
                        </div>
                        <div>
                            <small className="text-sm text-gray-400">Avg. Price</small>
                            <p className="text-2xl! font-bold!">{formatPrice(price?.avg_price_cents)}</p>
                        </div>
                    </div>
                </div>
                <p className="text-xs! px-2">
                    <i className="fa-solid fa-circle-info" /> I prezzi sono calcolati in base ai primi 10 venditori del
                    paese indicato
                    {price ? ` (data ultimo aggiornamento: ${new Date(price.created_at).toLocaleDateString()})` : ""}
                </p>
            </CardBody>
            <CardFooter className="flex justify-between px-2">
                <a
                    title="CardTrader"
                    href={price?.blueprint_id ? `https://www.cardtrader.com/en/cards/${price.blueprint_id}` : "#"}
                    target="_blank"
                    rel="noopener"
                >
                    <Button size="sm">Card Trader</Button>
                </a>
                <a
                    title="CardMarket"
                    href={`https://www.cardmarket.com/Riftbound/Products?idProduct=${price?.card_market_id}`}
                    target="_blank"
                    rel="noopener"
                >
                    <Button size="sm">Card Market</Button>
                </a>
                {/*<a href="https://tcgplayer.com/" target="_blank" rel="noopener">
                    <Button disabled color="primary" size="sm">
                        Tcg Player
                    </Button>
                </a>*/}
            </CardFooter>
        </Card>
    );
};
