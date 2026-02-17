import Title from "@/components/decoration/Title";
import { ModalContext } from "@/shared/context/ModalContext";
import { useHttpClient } from "@/shared/hooks/http-hook";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NewPassword = () => {

    const [newPassword, setNewPassword] = useState<{ password: string, passwordConfirm: string }>({ password: "", passwordConfirm: "" });
    const navigate = useNavigate();
    const { sendRequest } = useHttpClient();
    const modalCtx = useContext(ModalContext);

    useEffect(() => {
        const token = new URLSearchParams(location.search).get('token');
        if (!token) {
            navigate("/");
            return;
        }
    }, []);


    const sumbitNewPassword = async () => {

        await sendRequest({
            key: 3,
            url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
            method: 'PUT',
            body: { action: "resetPassword", token: new URLSearchParams(location.search).get('token'), password: newPassword.password, passwordConfirm: newPassword.passwordConfirm },
            onSuccess: (data) => {
                navigate("/login");
                setNewPassword({ password: "", passwordConfirm: "" });
                modalCtx.open(data.message, "info", "", () => {
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
                <Title title="Réinitialisation du mot de passe" size={1} />

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="block mb-1 text-sm text-gray-300">
                            Nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={newPassword.password}
                            onChange={(e) =>
                                setNewPassword({ ...newPassword, password: e.target.value })
                            }
                            className="w-full p-2 border border-gray-700 rounded-md bg-[#202020] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm text-gray-300">
                            Confirmer le mot de passe
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={newPassword.passwordConfirm}
                            onChange={(e) =>
                                setNewPassword({ ...newPassword, passwordConfirm: e.target.value })
                            }
                            className="w-full p-2 border border-gray-700 rounded-md bg-[#202020] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={sumbitNewPassword}
                            className="w-full px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition"
                        >
                            Valider
                        </button>
                    </div>
                </div>
            </div>
        </>

    )
}


export default NewPassword;