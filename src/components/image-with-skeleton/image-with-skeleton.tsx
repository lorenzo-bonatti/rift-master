import { Image, Skeleton } from "@heroui/react";
import { useState } from "react";

interface IProps extends Pick<Parameters<typeof Image>[0], "loading"> {
    name: string;
    src: string;
}

export const ImageWithSkeleton = ({ name, src }: IProps) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <Skeleton isLoaded={isLoaded} className="w-full h-full rounded">
            <Image
                alt={name}
                src={src}
                fallbackSrc="https://placehold.co/744x1039?text=No+Image"
                // width={340}
                // height={510}
                className="w-full h-full object-cover rounded"
                onLoad={() => setIsLoaded(true)}
            />
        </Skeleton>
    );
};
