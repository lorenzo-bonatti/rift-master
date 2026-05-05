import { Button, Card, CardBody } from "@heroui/react";
import type { IPrice } from "@models/price";
import { useState } from "react";
import { useSettingsStore } from "../../stores";
import { LanguageSelectorModal } from "../language-selector";

interface IProps {
    prices: IPrice[];
}

export const PricePanel = ({ prices }: IProps) => {
    const priceCountry = useSettingsStore((state) => state.priceCountry);
    const setPriceCountry = useSettingsStore((state) => state.setPriceCountry);

    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

    const price = prices.find((p) => p.country_code.toLowerCase() === priceCountry);
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
                <Card
                    shadow="none"
                    className="border border-gray-300 cursor-pointer"
                    isPressable
                    onPress={() => setIsLanguageModalOpen(true)}
                >
                    <CardBody className="text-center">
                        <small className="text-xs uppercase text-gray-600">Country</small>
                        <img
                            src={`/flags/${priceCountry}.png`}
                            alt={priceCountry}
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

            {/* Country selection */}
            <LanguageSelectorModal
                isOpen={isLanguageModalOpen}
                value={priceCountry}
                onClose={() => setIsLanguageModalOpen(false)}
                onSelect={(lang) => setPriceCountry(lang.code)}
            />
        </div>
    );
};
