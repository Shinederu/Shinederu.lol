import { AuthContext } from "@/shared/context/AuthContext";
import { ModalContext } from "@/shared/context/ModalContext";
import { useHttpClient } from "@/shared/hooks/http-hook";
import { useContext } from "react";
import { Link } from "react-router-dom";

const ProfileHeader = () => {
  const { sendRequest } = useHttpClient();
  const authCtx = useContext(AuthContext);
  const modalCtx = useContext(ModalContext);

  const sendLogout = async () => {
    try {
      await sendRequest({
        key: 3,
        url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
        method: "POST",
        body: {
          action: "logout",
        },
        onSuccess: () => {
          authCtx.setAuthData({
            isLoggedIn: false,
            id: 0,
            username: "",
            email: "",
            role: "",
            avatar_url: "",
            created_at: "",
          });
        },
        onError: (error) => {
          modalCtx.open(error, "error");
        },
      });
    } catch (error) {
      modalCtx.open(error + "", "error");
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
