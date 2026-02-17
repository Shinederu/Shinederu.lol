import { useContext, useState } from "react";
import { X } from "lucide-react";
import { AuthContext } from "@/shared/context/AuthContext";
import Title from "../decoration/Title";
import { ModalContext } from "@/shared/context/ModalContext";
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

const ModalLogin = () => {
  const modalCtx = useContext(ModalContext);
  const authCtx = useContext(AuthContext);
  const auth = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    loginUsername: "",
    loginPassword: "",
    registerUsername: "",
    registerMail: "",
    registerPassword: "",
    registerConfirmPassword: "",
  });

  const sendRegister = async () => {
    if (!formData.registerUsername || !formData.registerMail || !formData.registerPassword || !formData.registerConfirmPassword) {
      modalCtx.open("Tous les champs doivent etre remplis !", "error");
      return;
    }

    const result = await auth.register({
      username: formData.registerUsername,
      email: formData.registerMail,
      password: formData.registerPassword,
      password_confirm: formData.registerConfirmPassword,
    });

    if (result.ok) {
      modalCtx.open(getResponseMessage(result.data, "Inscription enregistree."), "result");
      return;
    }

    modalCtx.open(result.error ?? "Erreur pendant l'inscription.", "error");
  };

  const sendLogin = async () => {
    if (!formData.loginUsername || !formData.loginPassword) {
      modalCtx.open("Veuillez entrer un pseudo/email ET un mot de passe !", "error");
      return;
    }

    const result = await auth.login({
      username: formData.loginUsername,
      password: formData.loginPassword,
    });

    if (!result.ok) {
      modalCtx.open(result.error ?? "Erreur de connexion.", "error");
      return;
    }

    await authCtx.reload();
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim().replace(/[<>/'"\\&]/g, "").replace(/\s+/g, " "),
    });
  };

  const forgottedPassword = () => {
    setIsOpen(false);
    navigate("/resetPassword");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white px-4 py-2 rounded-md font-bold transition-transform hover:scale-105"
      >
        Connexion/Inscription
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#10101f] text-white rounded-lg shadow-lg w-11/12 sm:w-4/6 lg:w-3/6 p-6 relative">
            <div className="flex justify-end border-b border-gray-700 pb-4">
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border-2 border-[#5120c2] p-8">
                <Title size={2} title="Connexion" />
                <form>
                  <input
                    type="text"
                    name="loginUsername"
                    placeholder="Pseudo ou Email"
                    value={formData.loginUsername}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-700 rounded bg-[#202020] text-white mb-2"
                  />
                  <input
                    type="password"
                    name="loginPassword"
                    placeholder="Mot de passe"
                    value={formData.loginPassword}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-700 rounded bg-[#202020] text-white mb-4"
                  />
                </form>
                <button onClick={forgottedPassword} className="text-gray-500">
                  Mot de passe oublie ?
                </button>
              </div>

              <div className="rounded-xl border-2 border-[#20c228] p-8">
                <Title size={2} title="Inscription" />
                <form>
                  <input
                    type="text"
                    name="registerUsername"
                    placeholder="Pseudo"
                    value={formData.registerUsername}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-700 rounded bg-[#202020] text-white mb-2"
                  />
                  <input
                    type="email"
                    name="registerMail"
                    placeholder="Email"
                    value={formData.registerMail}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-700 rounded bg-[#202020] text-white mb-2"
                  />
                  <input
                    type="password"
                    name="registerPassword"
                    placeholder="Mot de passe"
                    value={formData.registerPassword}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-700 rounded bg-[#202020] text-white mb-2"
                  />
                  <input
                    type="password"
                    name="registerConfirmPassword"
                    placeholder="Confirmer le mot de passe"
                    value={formData.registerConfirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-700 rounded bg-[#202020] text-white mb-4"
                  />
                </form>
              </div>
            </div>

            <div className="pr-4 pl-4 grid grid-cols-2 gap-16">
              <button
                type="submit"
                onClick={sendLogin}
                className="bg-gradient-to-r bg-[#6a11cb] text-white px-4 py-2 rounded-md font-bold hover:scale-105 transition-transform"
              >
                Se connecter
              </button>
              <button
                type="submit"
                onClick={sendRegister}
                className="bg-gradient-to-r bg-[#11cb5f] text-white px-4 py-2 rounded-md font-bold hover:scale-105 transition-transform"
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalLogin;
