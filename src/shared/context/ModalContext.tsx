import { createContext, PropsWithChildren, useState } from "react";

export type ModalType = "error" | "result" | "info" | "confirm" | "prompt";

export interface ModalContextType {
    isOpen: boolean;
    type: ModalType;
    message: string;
    subMessage: string;

    open(message: string, type: "prompt", subMessage?: string, onResolve?: () => void): Promise<string | undefined>;
    open(message: string, type: "confirm", subMessage?: string, onResolve?: () => void): Promise<boolean>;
    open(message: string, type?: "info" | "error" | "result", subMessage?: string, onResolve?: () => void): Promise<void>;

    close: (response?: string | boolean) => void;
}

// 🛠️ Dummy function castée proprement
const dummyOpen: ModalContextType["open"] = (() => Promise.resolve()) as any;

export const ModalContext = createContext<ModalContextType>({
    isOpen: false,
    type: "info",
    message: "",
    subMessage: "",
    open: dummyOpen,
    close: () => { },
});

export const ModalProvider = ({ children }: PropsWithChildren) => {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<ModalType>("info");
    const [message, setMessage] = useState("");
    const [subMessage, setSubMessage] = useState("");
    const [resolver, setResolver] = useState<((value: string | boolean | void) => void) | null>(null);

    const open = (
        message: string,
        type: ModalType = "info",
        subMessage?: string,
        onResolve?: () => void
    ): Promise<string | boolean | void> => {
        setMessage(message);
        setSubMessage(subMessage ?? "");
        setType(type);
        setIsOpen(true);

        return new Promise((resolve) => {
            setResolver(() => (value: string | boolean | void) => {
                resolve(value);
                if (onResolve) onResolve();
            });
        });
    };

    const close = (response?: string | boolean) => {
        setIsOpen(false);
        setMessage("");
        setSubMessage("");
        setType("info");

        if (resolver) {
            resolver(response);
            setResolver(null);
        }
    };

    const contextValue: ModalContextType = {
        isOpen,
        type,
        message,
        subMessage,
        open: open as ModalContextType["open"],
        close,
    };

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
        </ModalContext.Provider>
    );
};
