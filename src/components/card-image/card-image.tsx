import { Image, Skeleton } from "@heroui/react";
import type { ICard } from "@models/card";
import type { TransformOptions } from "@supabase/storage-js";
import { useEffect, useRef, useState } from "react";

interface IProps {
    card: ICard;
    transform?: TransformOptions;
    className?: string;
}

export const CardImage = ({ card, className = "" }: IProps) => {
    const publicUrl = `${import.meta.env.VITE_CLOUDFRONT_URL}/cards/${card.id}.png`;

    return (
        <div className={`grid place-items-center aspect-[2/2.8] overflow-hidden ${className}`}>
            {card.orientation === "landscape" ? (
                <div className="w-[140%] aspect-[2.8/2] rotate-270">
                    <ImageWithSkeleton name={card.name} src={publicUrl} />
                </div>
            ) : (
                <ImageWithSkeleton name={card.name} src={publicUrl} />
            )}
        </div>
    );
};

const ImageWithSkeleton = ({ name, src }: { name: string; src: string }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "400px" },
        );

        if (containerRef.current) observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full">
            <Skeleton isLoaded={isLoaded} className="w-full h-full rounded-xl">
                {isVisible && (
                    <Image
                        alt={name}
                        src={src}
                        fallbackSrc="https://placehold.co/744x1039?text=No+Image"
                        className="w-full h-full object-cover rounded-xl"
                        onLoad={() => setIsLoaded(true)}
                    />
                )}
            </Skeleton>
        </div>
    );
};
