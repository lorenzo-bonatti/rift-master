import { Image, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { ImageWithSkeleton } from "../../components/image-with-skeleton";
import { PricePanel } from "../../components/price-panel";
import { supabase } from "../../integration/supabase";
import type { ICard } from "../../types/card";

export const Route = createFileRoute("/_cards/cards/$id")({
    component: RouteComponent,
    loader: async ({ params, context, location }) => {
        return await context.queryClient.fetchQuery({
            queryKey: ["card", params.id],
            queryFn: async () => {
                const { data, error } = await supabase
                    .from("card")
                    .select(
                        "id, name, collector_number, rich_text, media(image_url), set!inner(id, name, riftbound_id, tcgplayer_id), card_domain!inner(id, domain_ref_id), prices:card_price(blueprint_id, card_market_id, country_code, min_price_cents, avg_price_cents, created_at)",
                    )
                    .eq("id", parseInt(params.id, 10));
                // Handle errors and return the card data
                if (error || data.length === 0) throw redirect({ to: "/" });
                return data[0] as ICard;
            },
            initialData: () => {
                // Check if the card data is already in the location state (passed from the card list)
                return location.state?.card;
            },
        });
    },
});

function RouteComponent() {
    const { history } = useRouter();

    const card = Route.useLoaderData();

    return (
        <Modal isOpen size="full" scrollBehavior="inside" onClose={() => history.go(-1)}>
            <ModalContent>
                <ModalHeader>
                    <h1>
                        #{card.collector_number}, {card.name}
                    </h1>
                </ModalHeader>
                <ModalBody className="px-2">
                    <div className="w-full aspect-[2/2.8]">
                        <ImageWithSkeleton name={card.name} src={card.media?.image_url ?? "no-src"} loading="eager" />
                    </div>

                    <div
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: original HTML from Riftbound, should be safe
                        dangerouslySetInnerHTML={{ __html: card.rich_text ?? "" }}
                    />

                    {card.prices && <PricePanel prices={card.prices} />}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
