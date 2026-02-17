import Title from "@/components/decoration/Title";
import { ModalContext } from "@/shared/context/ModalContext";
import { useContext, useState } from "react";
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

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const modalCtx = useContext(ModalContext);
  const navigate = useNavigate();
  const auth = useAuth();

  const sendPasswordResetRequest = async () => {
    const response = await auth.requestPasswordReset(email);

    if (!response.ok) {
      modalCtx.open(response.error ?? "Erreur pendant la demande.", "error");
      return;
    }

    modalCtx.open(getResponseMessage(response.data, "Demande envoyee."), "info", "", () => {
      setEmail("");
      navigate("/");
    });
  };

  return (
    <>
      <div className="text-white max-w-md mx-auto mt-10">
        <Title title="Demander une reinitialisation du mot de passe" size={1} />

        <div className="mt-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Adresse Email</label>
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
};

export default ResetPassword;
