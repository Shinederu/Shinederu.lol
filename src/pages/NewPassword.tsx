import Title from "@/components/decoration/Title";
import { ModalContext } from "@/shared/context/ModalContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@shinederu/auth-react";

const getResponseMessage = (data: unknown, fallback: string) => {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    if (record.data && typeof record.data === "object") {
      const nested = record.data as Record<string, unknown>;
      if (typeof nested.message === "string") return nested.message;
    }
  }
  return fallback;
};

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState<{ password: string; passwordConfirm: string }>({ password: "", passwordConfirm: "" });
  const navigate = useNavigate();
  const modalCtx = useContext(ModalContext);
  const auth = useAuth();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const submitNewPassword = async () => {
    const token = new URLSearchParams(location.search).get("token");
    if (!token) {
      navigate("/");
      return;
    }

    const response = await auth.resetPassword(token, newPassword.password, newPassword.passwordConfirm);

    if (!response.ok) {
      modalCtx.open(response.error ?? "Erreur pendant la reinitialisation.", "error");
      return;
    }

    setNewPassword({ password: "", passwordConfirm: "" });
    modalCtx.open(getResponseMessage(response.data, "Mot de passe mis a jour."), "info", "", () => {
      navigate("/");
    });
  };

  return (
    <>
      <div className="text-white max-w-md mx-auto mt-10">
        <Title title="Reinitialisation du mot de passe" size={1} />

        <div className="mt-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Nouveau mot de passe</label>
            <input
              type="password"
              name="newPassword"
              value={newPassword.password}
              onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
              className="w-full p-2 border border-gray-700 rounded-md bg-[#202020] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={newPassword.passwordConfirm}
              onChange={(e) => setNewPassword({ ...newPassword, passwordConfirm: e.target.value })}
              className="w-full p-2 border border-gray-700 rounded-md bg-[#202020] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2">
            <button onClick={submitNewPassword} className="w-full px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition">
              Valider
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPassword;
