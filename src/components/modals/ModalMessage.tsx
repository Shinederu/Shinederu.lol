import { useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import { ModalContext } from "@/shared/context/ModalContext";

const MessageModal = () => {
    const modalCtx = useContext(ModalContext);

    const [color, setColor] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [promptValue, setPromptValue] = useState<string>("");

    useEffect(() => {
        switch (modalCtx.type) {
            case "result":
                setTitle("Succès !");
                setColor("#20c70e");
                break;
            case "error":
                setTitle("Une erreur est survenue !");
                setColor("#b50909");
                break;
            case "confirm":
                setTitle("Confirmation");
                setColor("#ffe342");
                break;
            case "prompt":
                setTitle("Saisie requise");
                setColor("#3a7bd5");
                break;
            default:
                setTitle("Information");
                setColor("#ffe342");
                break;
        }

        // Reset le champ prompt si besoin
        setPromptValue("");
    }, [modalCtx.type, modalCtx.isOpen]);

    if (!modalCtx.isOpen) return null;

    const formatText = (text: string) =>
        text.split("\n").map((line, idx) => (
            <span key={idx}>
                {line}
                <br />
            </span>
        ));

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#10101f] text-white rounded-lg p-6 max-w-7xl border" style={{ borderColor: color }}>
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-1 mb-1 gap-6" style={{ borderColor: color }}>
                    <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
                    <button onClick={() => modalCtx.close()} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="py-4 space-y-2">
                    <p className="text-gray-300">{formatText(modalCtx.message)}</p>
                    {modalCtx.subMessage && (
                        <p className="text-gray-400 text-sm">{formatText(modalCtx.subMessage)}</p>
                    )}

                    {/* Champ pour type "prompt" */}
                    {modalCtx.type === "prompt" && (
                        <input
                            type="text"
                            className="mt-2 w-full px-3 py-2 rounded-md bg-[#181828] text-white border border-gray-600 focus:outline-none focus:ring focus:border-blue-500"
                            placeholder="Ta réponse ici..."
                            value={promptValue}
                            onChange={(e) => setPromptValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    modalCtx.close(promptValue.trim());
                                }
                            }}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 mt-4">
                    {/* Confirm: Oui / Non */}
                    {modalCtx.type === "confirm" ? (
                        <>
                            <button
                                onClick={() => modalCtx.close(false)}
                                className="text-white px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600 transition"
                            >
                                Non
                            </button>
                            <button
                                onClick={() => modalCtx.close(true)}
                                className="text-white px-4 py-2 rounded-md font-semibold shadow-md hover:scale-105 transition-transform"
                                style={{ backgroundColor: color }}
                            >
                                Oui
                            </button>
                        </>
                    ) : (
                        // Tous les autres types : bouton unique
                        <button
                            onClick={() =>
                                modalCtx.type === "prompt"
                                    ? modalCtx.close(promptValue.trim())
                                    : modalCtx.close()
                            }
                            className="text-white px-4 py-2 rounded-md font-semibold shadow-md hover:scale-105 transition-transform"
                            style={{ backgroundColor: color }}
                        >
                            Compris !
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
