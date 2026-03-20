import { Button, Image, Input, Modal, ModalBody, ModalContent, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDebouncedCallback } from "use-debounce";
import { CardFilters } from "../components/card-filters";
import { supabase } from "../integration/supabase";
import type { ICard } from "../types/card";
import { splitCardName } from "../utils/cards";

const LIMIT = 50;

interface IParams {
    skip: number;
    search: string;
    sets: number[];
    domains: number[];
}

export const Route = createFileRoute("/_cards")({
    component: Index,
});

function Index() {
    const [cards, setCards] = useState<ICard[]>([]);
    const [params, setParams] = useState<IParams>({
        skip: 0,
        search: "",
        sets: [] as number[],
        domains: [] as number[],
    });

    // Fetch cards with Tanstack Query
    const { data, isFetching } = useQuery({
        queryKey: ["cards", params],
        queryFn: async () => {
            const query = supabase
                .from("card")
                .select(
                    "id, name, collector_number, rich_text, media(image_url), set!inner(id, name, riftbound_id, tcgplayer_id), card_domain!inner(id, domain_ref_id), prices:card_price(blueprint_id, card_market_id, country_code, min_price_cents, avg_price_cents, created_at)",
                )
                .order("set(tcgplayer_id)", { ascending: true })
                .order("collector_number", { ascending: true })
                .range(params.skip, params.skip + LIMIT - 1);

            // Apply filters
            if (params.search) {
                const collectorQuery = null as string | null;
                if (!Number.isNaN(Number(params.search))) `collector_number.eq.${parseInt(params.search, 10)}`;
                query.or(`name.ilike.%${params.search}%${collectorQuery ? `,${collectorQuery}` : ""}`);
            }
            if (params.sets && params.sets.length > 0) query.in("set.id", params.sets);
            if (params.domains && params.domains.length > 0) query.in("card_domain.domain_ref_id", params.domains);

            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
    });

    // Infinite scroll
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (!data || isFetching) return;
        setCards((prev) => (params.skip === 0 ? data : [...prev, ...data]));
        setHasMore(data.length >= LIMIT);
    }, [isFetching, params.skip, data]);

    const handleLoadMore = useCallback(() => {
        setParams((prev) => ({ ...prev, skip: prev.skip + LIMIT }));
    }, []);

    // Filters
    const [toggleFilter, setToggleFilter] = useState(false);
    const handleUpdateParams = useDebouncedCallback((params: Partial<IParams>) => {
        setParams((prev) => ({ ...prev, ...params, skip: 0 }));
    }, 350);

    return (
        <InfiniteScroll
            dataLength={cards.length}
            next={handleLoadMore}
            hasMore={hasMore}
            loader={
                <div className="grid place-content-center py-4">
                    <Spinner label="Loading more" variant="wave" />
                </div>
            }
            endMessage={
                <p className="text-center py-4 text-gray-500">
                    <b>Yay! You have seen it all</b>
                </p>
            }
        >
            <div className="page bg-content1 space-y-4">
                <div className="page-header p-2">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-xl font-bold">Cards</h1>
                        <Button isIconOnly onPress={() => setToggleFilter(true)}>
                            <i className="fa fa-filter" />
                        </Button>
                    </div>

                    <Input
                        isClearable
                        label="Search"
                        placeholder="Search by name or card number"
                        startContent={<i className="fa fa-magnifying-glass" />}
                        onValueChange={(value) => handleUpdateParams({ search: value })}
                        onClear={() => setParams((prev) => ({ ...prev, search: "" }))}
                    />
                </div>

                <div className="page-content">
                    {params.skip === 0 && isFetching ? (
                        <div className="grid place-content-center py-12">
                            <Spinner label="Loading" variant="wave" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {cards && cards.length > 0 ? (
                                cards.map((card) => (
                                    <Link
                                        to="/cards/$id"
                                        key={card.id}
                                        params={{ id: String(card.id) }}
                                        className="space-y-1"
                                        // Pass the card data in the history state to avoid refetching in the detail view
                                        state={{ card }}
                                    >
                                        <div className="w-full aspect-2/3">
                                            <Image
                                                alt={card.name}
                                                src={card.media?.image_url || "https://via.placeholder.com/150"}
                                                // width={340}
                                                // height={510}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>

                                        <div className="flex gap-1 text-sm/4 px-1">
                                            <div>
                                                <p>{card.set?.riftbound_id}</p>
                                                <p>{card.collector_number?.toString().padStart(3, "0")}</p>
                                            </div>

                                            <div className="grow overflow-hidden">
                                                {splitCardName(card.name).map((word) => (
                                                    <p key={`${card.id}-${word}`} className="truncate">
                                                        {word}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-center py-12 text-gray-500">No cards found</p>
                            )}
                        </div>
                    )}

                    {/* Filter Panel */}
                    <Modal
                        backdrop="opaque"
                        placement="bottom"
                        isOpen={toggleFilter}
                        onClose={() => setToggleFilter(false)}
                    >
                        <ModalContent>
                            <ModalBody className="px-2">
                                <CardFilters onSubmit={handleUpdateParams} />
                            </ModalBody>
                        </ModalContent>
                    </Modal>

                    {/* Detail: see /cards/$id page */}
                    <Outlet />
                </div>
            </div>
        </InfiniteScroll>
    );
}
