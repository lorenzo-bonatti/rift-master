import { Image, Skeleton } from "@heroui/react";
import type { TransformOptions } from "@supabase/storage-js";
import { useState } from "react";
import { supabase } from "../../integration/supabase";
import type { ICard } from "../../types/card";

interface IProps {
    card: ICard;
    transform?: TransformOptions;
    className?: string;
}

export const CardImage = ({ card, className = "", ...props }: IProps) => {
    const options = props.transform ? { transform: props.transform } : {};
    const { data } = supabase.storage.from("rift_master").getPublicUrl(`cards/${card.id}.png`, options);

    return (
        <div className={`grid place-items-center aspect-[2/2.8] overflow-hidden ${className}`}>
            {card.orientation === "landscape" ? (
                <div className="aspect-[2.8/2] rotate-270">
                    <ImageWithSkeleton name={card.name} src={data.publicUrl} />
                </div>
            ) : (
                <ImageWithSkeleton name={card.name} src={data.publicUrl} />
            )}
        </div>
    );
};

const ImageWithSkeleton = ({ name, src }: { name: string; src: string }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <Skeleton isLoaded={isLoaded} className="w-full h-full rounded">
            <Image
                alt={name}
                src={src}
                fallbackSrc="https://placehold.co/744x1039?text=No+Image"
                className="w-full h-full object-cover rounded"
                onLoad={() => setIsLoaded(true)}
            />
        </Skeleton>
    );
};
