import { Badge, Button, Input, Modal, ModalBody, ModalContent, ModalHeader, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDebouncedCallback } from "use-debounce";
import { CardFilters } from "../components/card-filters";
import { CardSort } from "../components/card-sort";
import { ImageWithSkeleton } from "../components/image-with-skeleton";
import { supabase } from "../integration/supabase";
import type { ICard } from "../types/card";
import { EnumSort } from "../types/card-page";
import { getCardSetNumber, splitCardName } from "../utils/cards";

const LIMIT = 50;

interface IParams {
    skip: number;
    // Filter options
    search: string;
    sets: number[];
    domains: number[];
    rarities: number[];
    types: number[];
    // Sort options
    sort: EnumSort;
    sortDirection: "asc" | "desc";
    enableSetSort: boolean;
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
        rarities: [] as number[],
        types: [] as number[],
        sort: EnumSort.NUMBER,
        sortDirection: "asc",
        enableSetSort: true,
    });

    // Fetch cards with Tanstack Query
    const { data, isFetching } = useQuery({
        queryKey: ["cards", params],
        queryFn: async () => {
            const query = supabase
                .from("card")
                .select(`
                  id,
                  name,
                  collector_number,
                  public_code,
                  media(image_url),
                  orientation,
                  set!inner(order),
                  card_domain!inner(domain_ref_id)
                `)
                .range(params.skip, params.skip + LIMIT - 1);

            // Apply sorting for set, then by selected sort
            if (params.enableSetSort) query.order("set(order)", { ascending: true });

            const sort = params.sort;
            const ascending = params.sortDirection === "asc";

            if (sort === EnumSort.NAME) query.order("name", { ascending });
            else if (sort === EnumSort.NUMBER) query.order("collector_number", { ascending });
            else if (sort === EnumSort.MIGHT) query.order("might", { ascending });
            else if (sort === EnumSort.ENERGY) query.order("energy", { ascending });
            else if (sort === EnumSort.POWER) query.order("power", { ascending });
            // else if (sort === EnumSort.PRICE) query.order("price", { ascending: sortDirection === "asc" });

            // Apply filters
            if (params.search) query.or(`name.ilike.%${params.search}%,public_code.ilike.%${params.search}%`);
            if (params.sets && params.sets.length > 0) query.in("set.id", params.sets);
            if (params.domains && params.domains.length > 0) query.in("card_domain.domain_ref_id", params.domains);
            if (params.rarities && params.rarities.length > 0) query.in("rarity_ref_id", params.rarities);
            if (params.types && params.types.length > 0) query.in("type_ref_id", params.types);

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

    // Header scroll visibility
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);

    // Filters
    const [toggleFilter, setToggleFilter] = useState(false);
    const filtersCount = [...params.sets, ...params.domains, ...params.rarities, ...params.types].length;

    // Sort
    const [toggleSort, setToggleSort] = useState(false);

    const handleUpdateParams = useDebouncedCallback((params: Partial<IParams>) => {
        setParams((prev) => ({ ...prev, ...params, skip: 0 }));
    }, 350);

    return (
        <div>
            <div
                className={`sticky top-0 z-50 pt-2 pb-4 px-4 bg-white transition-transform duration-300 ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"}`}
            >
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold">Cards</h1>

                    <div className="space-x-1">
                        <Button variant="ghost" isIconOnly onPress={() => setToggleSort(true)}>
                            <i className="fa fa-arrow-down-a-z" />
                        </Button>
                        <Badge color="secondary" isInvisible={filtersCount === 0} content={filtersCount} size="sm">
                            <Button variant="ghost" isIconOnly onPress={() => setToggleFilter(true)}>
                                <i className="fa fa-filter" />
                            </Button>
                        </Badge>
                    </div>
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
                onScroll={() => {
                    const currentScrollY = window.scrollY;
                    setIsHeaderVisible(currentScrollY < lastScrollY.current || currentScrollY < 10);
                    lastScrollY.current = currentScrollY;
                }}
            >
                <div className="page">
                    <div className="page-content py-4">
                        {params.skip === 0 && isFetching ? (
                            <div className="grid place-content-center py-12">
                                <Spinner label="Loading" variant="wave" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2">
                                {cards && cards.length > 0 ? (
                                    cards.map((card) => {
                                        const { set, number } = getCardSetNumber(card.public_code ?? "") ?? {
                                            set: "N/A",
                                            number: "N/A",
                                        };
                                        return (
                                            <Link
                                                to="/cards/$id"
                                                key={card.id}
                                                params={{ id: String(card.id) }}
                                                className="space-y-1"
                                            >
                                                <div className="w-full aspect-[2/2.8] relative overflow-hidden rounded">
                                                    <ImageWithSkeleton
                                                        name={card.name}
                                                        src={card.media?.image_url ?? "no-src"}
                                                        orientation={card.orientation ?? null}
                                                        loading="lazy"
                                                    />
                                                </div>

                                                <div className="flex gap-1 text-sm/4 px-1">
                                                    <div>
                                                        <p>{set}</p>
                                                        <p>{number}</p>
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
                                        );
                                    })
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
                                <ModalHeader>Filter search</ModalHeader>
                                <ModalBody className="pb-8">
                                    <CardFilters values={params} onSubmit={handleUpdateParams} />
                                </ModalBody>
                            </ModalContent>
                        </Modal>

                        {/* Sort Panel */}
                        <Modal
                            size="xs"
                            backdrop="opaque"
                            placement="bottom"
                            isOpen={toggleSort}
                            onClose={() => setToggleSort(false)}
                        >
                            <ModalContent>
                                <ModalHeader>Sort cards</ModalHeader>
                                <ModalBody className="pb-8">
                                    <CardSort value={params} onChange={handleUpdateParams} />
                                </ModalBody>
                            </ModalContent>
                        </Modal>

                        {/* Detail: see /cards/$id page */}
                        <Outlet />
                    </div>
                </div>
            </InfiniteScroll>
        </div>
    );
}
