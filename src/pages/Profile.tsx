import { useContext, useState } from "react";
import { useHttpClient } from "@/shared/hooks/http-hook";
import { AuthContext } from "@/shared/context/AuthContext";
import { ModalContext } from "@/shared/context/ModalContext";
import Title from "@/components/decoration/Title";
import { DateTimeFormatter } from "@/utils/DateTimeFormatter";
import { UserType } from "@/types/User";


const Profile = () => {


    const { sendRequest } = useHttpClient();
    const authCtx = useContext(AuthContext);
    const modalCtx = useContext(ModalContext);
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState<UserType>({
        id: authCtx.id,
        username: authCtx.username,
        email: authCtx.email,
        role: authCtx.role,
        created_at: authCtx.created_at
    });
    const [newEmail, setNewEmail] = useState<{ email: string, emailConfirm: string }>({ email: "", emailConfirm: "" });


    const updateUserProfile = async () => {
        await sendRequest({
            key: 3,
            url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
            method: 'POST',
            body: { action: "updateProfile", username: editedUser.username },
            onSuccess: () => {
                authCtx.reload();
            },
            onError: (error) => {
                editedUser.username = authCtx.username;
                modalCtx.open(error, "error");
            },
        });
        setEditMode(false);
    }

    const updatePassword = async () => {
        await sendRequest({
            key: 3,
            url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
            method: 'POST',
            body: { action: "requestPasswordReset", email: authCtx.email },
            onSuccess: () => {
                modalCtx.open("Un email de modification du mot de passe a été envoyé à votre adresse email.", "result");
            },
            onError: (error) => {
                editedUser.username = authCtx.username;
                modalCtx.open(error, "error");
            },
        });
    }

    const sendNewEmailRequest = async () => {

        await sendRequest({
            key: 3,
            url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
            method: 'PUT',
            body: {
                action: "requestEmailUpdate",
                email: newEmail.email,
                emailConfirm: newEmail.emailConfirm
            },
            onSuccess: (data) => {
                modalCtx.open(data.message, "result", "", () => {
                });
                setNewEmail({ email: "", emailConfirm: "" });
            },
            onError: (error) => {
                modalCtx.open(error, "error");
            }

        });
    }

    const sendLogOutAll = async () => {
        await sendRequest({
            key: 4,
            url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
            method: 'POST',
            body: { action: "logoutAll" },
            onSuccess: () => {
                window.location.reload();
            },
            onError: (error) => {
                modalCtx.open(error, "error");
            }
        });
    }


    const sendDeleteAccount = async (password: string) => {
        await sendRequest({
            key: 4,
            url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
            method: "DELETE",
            body: { action: "deleteAccount", password: password },
            onSuccess: () => window.location.reload(),
            onError: (error) => { modalCtx.open(error, "error"); }
        });
    };

    const onSelectAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fd = new FormData();
        fd.append("action", "updateAvatar");
        fd.append("file", file, "avatar.png");

        await sendRequest({
            key: 7,
            url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
            method: "POST",
            body: fd,
            onSuccess: async () => {
                await authCtx.reload();
                modalCtx.open("Avatar mis à jour.", "result");
                e.currentTarget.value = "";
            },
            onError: (error) => modalCtx.open(error, "error"),
        });
    };

    return (
        <>
            <div className="w-5/6 flex items-center justify-center flex-col mx-auto">
                <Title size={1} title={`Profil de ${authCtx.username}`} />
                {/* Bloc profil */}
                <section className="mt-8 w-full max-w-2xl text-white">
                    <div className="mt-4 flex items-center gap-4 flex-col">
                        <img
                            key={authCtx.avatar_url}
                            src={authCtx.avatar_url}
                            alt="avatar"
                            className="w-40 h-40 rounded-full object-cover border border-gray-700"
                        />
                        {editMode ?
                            <div>
                                <input
                                    id="avatarFile"
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={onSelectAvatar}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="avatarFile"
                                    className="inline-block cursor-pointer px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition"
                                >
                                    Choisir une image
                                </label>
                                <p className="mt-2 text-xs text-gray-400">
                                    PNG, JPEG ou WebP — max 5 Mo.
                                </p>
                            </div> : <></>}
                    </div>
                </section>
                <div className="mt-6 space-y-4 text-white">
                    {editMode ? (
                        <div className="space-y-4">
                            <div className="text-gray-400">Identifiant unique: #{authCtx.id}</div>

                            <div>
                                <label className="block mb-1 text-sm text-gray-300">Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={editedUser.username}
                                    onChange={(event) =>
                                        setEditedUser({ ...editedUser, username: event.target.value })
                                    }
                                    className="p-2 border border-gray-700 rounded-md bg-[#202020] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>Email: {authCtx.email}</div>
                            <div>Créé le: {DateTimeFormatter(authCtx.created_at)}</div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={updateUserProfile}
                                    className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div>Identifiant unique: #{authCtx.id}</div>
                            <div>Nom d'utilisateur: {authCtx.username}</div>
                            <div>Email: {authCtx.email}</div>
                            <div>Créé le: {DateTimeFormatter(authCtx.created_at)}</div>
                            <button
                                onClick={() => setEditMode(true)}
                                className="mt-3 px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition"
                            >
                                Modifier mon profile
                            </button>
                        </div>
                    )}
                </div>

                {/* Zone Dangereuse */}
                <section className="border-t border-gray-700 pt-6 text-white mt-10">
                    <Title size={2} title="Zone Dangereuse" />

                    <div className="mt-6 grid gap-8 md:grid-cols-2">
                        {/* Colonne gauche — Modifier l'email */}
                        <div>
                            <Title size={3} title="Modifier l'email" />
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="block mb-1 text-sm text-gray-300">Nouvelle adresse email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newEmail.email}
                                        onChange={(e) => setNewEmail({ ...newEmail, email: e.target.value })}
                                        className="w-full max-w-sm p-2 border border-gray-700 rounded-md bg-[#202020] text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm text-gray-300">Confirmer l'adresse</label>
                                    <input
                                        type="text"
                                        name="emailConfirm"
                                        value={newEmail.emailConfirm}
                                        onChange={(e) =>
                                            setNewEmail({ ...newEmail, emailConfirm: e.target.value })
                                        }
                                        className="w-full max-w-sm p-2 border border-gray-700 rounded-md bg-[#202020] text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>

                                <button
                                    onClick={sendNewEmailRequest}
                                    className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-500 transition"
                                >
                                    Demander le changement
                                </button>
                            </div>
                        </div>

                        {/* Colonne droite — Actions */}
                        <div className="flex flex-col items-center space-y-3 mt-4">
                            <Title size={3} title="Actions" />
                            <button
                                onClick={updatePassword}
                                className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
                            >
                                Modifier votre mot de passe
                            </button>

                            <button
                                onClick={async () => {
                                    const confirmed = await modalCtx.open(
                                        "Souhaitez-vous réellement vous déconnecter de tous les appareils ?",
                                        "confirm",
                                        ""
                                    );
                                    if (confirmed) sendLogOutAll();
                                }}
                                className="px-3 py-2 rounded-md bg-orange-600 hover:bg-orange-500 transition"
                            >
                                Se déconnecter de tous les appareils
                            </button>

                            <button
                                onClick={async () => {
                                    const value = await modalCtx.open(
                                        "Entrez votre mot de passe pour confirmer la suppression de votre compte.",
                                        "prompt",
                                        "Cette action est irréversible. (laisser vide pour annuler)"
                                    );
                                    if (value?.trim()) await sendDeleteAccount(value);
                                }}
                                className="px-3 py-2 rounded-md bg-red-700 hover:bg-red-600 transition"
                            >
                                Supprimer mon compte
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>



    );
};

export default Profile;
