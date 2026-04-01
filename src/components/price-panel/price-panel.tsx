import { Button, Card, CardBody, CardFooter, Divider, Select, SelectItem } from "@heroui/react";
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
        <div>
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Prezzi di mercato</h3>
                <span className="text-gray-500 float-right text-xs">
                    Update {price ? new Date(price.created_at).toLocaleDateString() : "N/D"}
                </span>
            </div>
            <div className="grid grid-cols-3 gap-x-2 items-center">
                <Card shadow="none" className="border border-gray-300">
                    <CardBody className="text-center">
                        <small className="text-xs uppercase text-gray-600">Country</small>
                        <img
                            src={`/flags/${selectedCode}.png`}
                            alt={selectedCode}
                            className="w-6 object-cover mx-auto"
                        />
                    </CardBody>
                </Card>

                <Card shadow="none" className="border border-gray-300">
                    <CardBody className="text-center">
                        <small className="text-xs uppercase text-gray-600">Min</small>
                        <p>{formatPrice(price?.min_price_cents)}</p>
                    </CardBody>
                </Card>
                <Card shadow="none" className="border border-gray-300">
                    <CardBody className="text-center">
                        <small className="text-xs uppercase text-gray-600">Avg</small>
                        <p>{formatPrice(price?.avg_price_cents)}</p>
                    </CardBody>
                </Card>
            </div>
            <div className="flex gap-2 mt-3">
                <a
                    title="CardTrader"
                    href={price?.blueprint_id ? `https://www.cardtrader.com/en/cards/${price.blueprint_id}` : "#"}
                    target="_blank"
                    rel="noopener"
                    className="flex-1"
                >
                    <Button
                        variant="flat"
                        size="sm"
                        startContent={<i className="fa fa-up-right-from-square" />}
                        className="w-full"
                    >
                        Card Trader
                    </Button>
                </a>
                <a
                    title="CardMarket"
                    href={`https://www.cardmarket.com/Riftbound/Products?idProduct=${price?.card_market_id}`}
                    target="_blank"
                    rel="noopener"
                    className="flex-1"
                >
                    <Button
                        variant="flat"
                        size="sm"
                        startContent={<i className="fa fa-up-right-from-square" />}
                        className="w-full"
                    >
                        Card Market
                    </Button>
                </a>
            </div>
        </div>
    );

    // return (
    //     <Card style={{ backgroundColor: "#142544" }} className="text-white shrink-0">
    //         <div className="pt-6 px-4">
    //             <img src="/cardtrader.svg" alt="CardTrader" className="w-full object-container" />
    //         </div>
    //         <CardBody>
    //             <div className="flex justify-between items-end mb-4">
    //                 <Select
    //                     selectedKeys={[selectedCode]}
    //                     onSelectionChange={(keys) => {
    //                         const key = Array.from(keys)[0] as string;
    //                         if (key) setSelectedCode(key);
    //                     }}
    //                     size="sm"
    //                     className="max-w-32"
    //                     classNames={{ trigger: "bg-white/10 text-white", value: "text-white" }}
    //                     startContent={
    //                         <img
    //                             src={`/flags/${selectedCode}.png`}
    //                             alt={selectedCode}
    //                             className="w-5 object-cover shrink-0"
    //                         />
    //                     }
    //                     aria-label="Seleziona paese"
    //                 >
    //                     {languages.map((lang) => (
    //                         <SelectItem
    //                             key={lang.code}
    //                             startContent={
    //                                 <img src={`/flags/${lang.code}.png`} alt={lang.code} className="w-5 object-cover" />
    //                             }
    //                         >
    //                             {lang.name}
    //                         </SelectItem>
    //                     ))}
    //                 </Select>
    //                 <div className="flex space-x-8 text-right">
    //                     <div>
    //                         <small className="text-sm text-gray-400">Min. Price</small>
    //                         <p className="text-2xl! font-bold!">{formatPrice(price?.min_price_cents)}</p>
    //                     </div>
    //                     <div>
    //                         <small className="text-sm text-gray-400">Avg. Price</small>
    //                         <p className="text-2xl! font-bold!">{formatPrice(price?.avg_price_cents)}</p>
    //                     </div>
    //                 </div>
    //             </div>
    //             <p className="text-xs! px-2">
    //                 <i className="fa-solid fa-circle-info" /> I prezzi sono calcolati in base ai primi 10 venditori del
    //                 paese indicato
    //                 {price ? ` (data ultimo aggiornamento: ${new Date(price.created_at).toLocaleDateString()})` : ""}
    //             </p>
    //         </CardBody>
    //         <CardFooter className="flex justify-between px-2">
    //             <a
    //                 title="CardTrader"
    //                 href={price?.blueprint_id ? `https://www.cardtrader.com/en/cards/${price.blueprint_id}` : "#"}
    //                 target="_blank"
    //                 rel="noopener"
    //             >
    //                 <Button size="sm">Card Trader</Button>
    //             </a>
    //             <a
    //                 title="CardMarket"
    //                 href={`https://www.cardmarket.com/Riftbound/Products?idProduct=${price?.card_market_id}`}
    //                 target="_blank"
    //                 rel="noopener"
    //             >
    //                 <Button size="sm">Card Market</Button>
    //             </a>
    //             {/*<a href="https://tcgplayer.com/" target="_blank" rel="noopener">
    //                 <Button disabled color="primary" size="sm">
    //                     Tcg Player
    //                 </Button>
    //             </a>*/}
    //         </CardFooter>
    //     </Card>
    // );
};
