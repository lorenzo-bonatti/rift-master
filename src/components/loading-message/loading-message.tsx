import { type ReactNode, useEffect, useMemo } from "react";

import { useLoadingMessage } from "../../stores";

interface IStringProps {
    message: string;
}

interface IChildrenProps {
    children: ReactNode;
}

export const LoadingMessage = (props: IStringProps | IChildrenProps) => {
    const id = useMemo(() => crypto.randomUUID(), []);

    const setMessage = useLoadingMessage((state) => state.setMessage);
    const clearMessage = useLoadingMessage((state) => state.clearMessage);

    useEffect(() => {
        setMessage(id, "message" in props ? props.message : props.children);

        return () => {
            clearMessage(id);
        };
    }, [id, props, setMessage, clearMessage]);

    return null;
};
