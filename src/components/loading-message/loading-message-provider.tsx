import { Modal, ModalContent } from "@heroui/react";
import type { PropsWithChildren } from "react";
import { Fragment } from "react/jsx-runtime";
import { useLoadingMessage } from "../../stores";

export const LoadingMessageProvider = ({ children }: PropsWithChildren) => {
    const messages = useLoadingMessage((state) => state.messages);
    const content = messages.length > 0 ? messages[messages.length - 1]?.content : null;

    return (
        <Fragment>
            {children}
            {/* Message display */}
            <Modal
                isOpen={messages.length > 0}
                size="xs"
                placement="center"
                isDismissable={false}
                hideCloseButton={true}
            >
                <ModalContent>{content}</ModalContent>
            </Modal>
        </Fragment>
    );
};
