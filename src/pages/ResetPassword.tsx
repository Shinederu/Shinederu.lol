import Title from "@/components/decoration/Title";
import { ModalContext } from "@/shared/context/ModalContext";
import { useHttpClient } from "@/shared/hooks/http-hook";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";



const ResetPassword = () => {

    const { sendRequest } = useHttpClient();
    const [email, setEmail] = useState("");
    const modalCtx = useContext(ModalContext);
    const navigate = useNavigate();

    const sendPasswordResetRequest = async () => {
        await sendRequest({
            key: 1,
            url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
            method: 'POST',
            body: { action: "requestPasswordReset", email: email },
            onSuccess: (data) => {
                modalCtx.open(data.message, "info", "", () => {
                    setEmail("");
                    navigate("/");
                    return;
                });
            },
            onError: (error) => {
                modalCtx.open(error, "error");
            }
        });
    }

    return (
        <>
            <div className="text-white max-w-md mx-auto mt-10">
                <Title title="Demander une réinitialisation du mot de passe" size={1} />

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="block mb-1 text-sm text-gray-300">
                            Adresse Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            placeholder="Entrez votre adresse email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-700 rounded-md bg-[#202020] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            onClick={sendPasswordResetRequest}
                            className="w-full px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition"
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
            </div>
        </>

    );

}


export default ResetPassword;