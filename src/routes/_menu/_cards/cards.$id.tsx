import { CardImage } from "@components/card-image";
import { PricePanel } from "@components/price-panel";
import { Card, CardBody, Chip, Divider, Modal, ModalBody, ModalContent, ModalHeader, Skeleton } from "@heroui/react";
import { supabase } from "@integrations/supabase";
import type { ICardDetail } from "@models/card";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";

export const Route = createFileRoute("/_menu/_cards/cards/$id")({
    component: RouteComponent,
});

function RouteComponent() {
    const { history } = useRouter();
    const params = Route.useParams();

    // const card = Route.useLoaderData();
    const { data: card, isPending } = useQuery({
        queryKey: ["card", params.id],
        queryFn: async () => {
            // Fetch the card data from Supabase based on the ID from the route parameters
            const { data, error } = await supabase
                .from("card")
                .select(`
                  id,
                  name,
                  collector_number,
                  energy,
                  power,
                  might,
                  rarity(code),
                  type(code),
                  supertype(code),
                  rich_text,
                  media(image_url),
                  orientation,
                  card_domain(domain(code)),
                  card_tag(tag(code)),
                  prices:card_price(
                    blueprint_id,
                    card_market_id,
                    country_code,
                    min_price_cents,
                    avg_price_cents,
                    created_at
                  )
                `)
                .eq("id", parseInt(params.id, 10));
            // Handle errors and return the card data
            if (error || data.length === 0) throw new Error("Card not found");
            return data[0] as ICardDetail;
        },
    });

    return (
        <Modal isOpen size="full" scrollBehavior="inside" hideCloseButton={isPending} onClose={() => history.go(-1)}>
            <ModalContent>
                <ModalHeader>
                    <Skeleton isLoaded={!isPending} className="rounded-xl">
                        <h1 className="font-bold">{card?.name ?? "Loading card detail..."}</h1>
                    </Skeleton>
                </ModalHeader>
                <ModalBody className="px-2">
                    {card ? (
                        <Fragment>
                            <div className="flex gap-2">
                                <CardImage card={card} className="w-3/4" />
                                <Card shadow="none" className="grow border border-gray-300">
                                    <CardBody className="grid grid-cols-1 text-center items-center">
                                        <div>
                                            <small className="text-xs uppercase text-gray-600">Domain</small>

                                            <div className="flex justify-center gap-1">
                                                {card.card_domain.map((d) => (
                                                    <img
                                                        key={d.domain.code}
                                                        src={`/domains/${d.domain.code.toLocaleLowerCase()}.png`}
                                                        alt={d.domain.code}
                                                        className="w-6 h-6 object-cover"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <small className="text-xs uppercase text-gray-600">Energy</small>
                                            <p className="text-lg font-semibold">{card.energy ?? "--"}</p>
                                        </div>
                                        <div>
                                            <small className="text-xs uppercase text-gray-600">Power</small>
                                            <p className="text-lg font-semibold">{card.power ?? "--"}</p>
                                        </div>
                                        <div>
                                            <small className="text-xs uppercase text-gray-600">Might</small>
                                            <p className="text-lg font-semibold">{card.might ?? "--"}</p>
                                        </div>
                                        <div>
                                            <small className="text-xs uppercase text-gray-600">Type</small>
                                            <p className="text-xs font-semibold">{card.type?.code ?? "--"}</p>
                                        </div>
                                        <div>
                                            <small className="text-xs uppercase text-gray-600">Rarity</small>
                                            <div className="flex justify-center">
                                                {card.rarity && (
                                                    <img
                                                        src={`/rarities/${card.rarity.code.toLocaleLowerCase()}.png`}
                                                        alt={card.rarity.code}
                                                        className="w-4 h-4 object-cover"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>

                            <div className="text-sm space-x-1">
                                {card.supertype && (
                                    <Chip color="primary" size="sm">
                                        {card.supertype.code}
                                    </Chip>
                                )}
                                {card.card_tag.map((t) => (
                                    <Chip key={t.tag.code} size="sm">
                                        {t.tag.code}
                                    </Chip>
                                ))}
                            </div>

                            <div>
                                <small className="text-gray-600 uppercase mb-1">Ability</small>
                                <div
                                    // biome-ignore lint/security/noDangerouslySetInnerHtml: original HTML from Riftbound, should be safe
                                    dangerouslySetInnerHTML={{ __html: card.rich_text ?? "" }}
                                    className="text-xs"
                                />
                            </div>

                            <Divider />

                            {card.prices && <PricePanel prices={card.prices} />}
                        </Fragment>
                    ) : (
                        <Skeleton className="w-full h-full rounded-xl" />
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
