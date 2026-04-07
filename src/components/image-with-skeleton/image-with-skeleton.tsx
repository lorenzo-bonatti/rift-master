import { Image, Skeleton } from "@heroui/react";
import { useState } from "react";

interface IProps extends Pick<Parameters<typeof Image>[0], "loading"> {
    name: string;
    src: string;
    orientation?: string | null;
}

export const ImageWithSkeleton = ({ name, src, orientation, ...props }: IProps) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const imageEl = (
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

    if (orientation === "landscape") {
        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] aspect-[2.8/2] rotate-270">
                {imageEl}
            </div>
        );
    }

    return imageEl;
};
