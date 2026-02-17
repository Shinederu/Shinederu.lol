import { ModalContext } from "@/shared/context/ModalContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@shinederu/auth-react";

const ProfileHeader = () => {
  const modalCtx = useContext(ModalContext);
  const auth = useAuth();

  const sendLogout = async () => {
    const response = await auth.logout();

    if (!response.ok) {
      modalCtx.open(response.error ?? "Erreur lors de la deconnexion.", "error");
    }
  };

  return (
    <div className="flex items-center gap-3 sm:gap-6 text-sm sm:text-lg">
      <Link to="/dashboard" className="transition-colors duration-300 hover:text-[#6a11cb] whitespace-nowrap">
        Dashboard
      </Link>
      <button onClick={sendLogout} className="transition hover:text-[#cb1111] whitespace-nowrap">
        Se deconnecter
      </button>
    </div>
  );
};

export default ProfileHeader;
