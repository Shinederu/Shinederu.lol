import Title from "@/components/decoration/Title";
import { AuthContext } from "@/shared/context/AuthContext";
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

const NewEmail = () => {
  const [message, setMessage] = useState("Chargement...");
  const authCtx = useContext(AuthContext);
  const auth = useAuth();
  const navigate = useNavigate();

  const refreshAuthData = async () => {
    await authCtx.reload();
  };

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    const action = new URLSearchParams(location.search).get("action");

    if (!token || !action) {
      navigate("/");
      return;
    }

    const runAction = async () => {
      switch (action) {
        case "confirmEmailUpdate": {
          const response = await auth.confirmEmailUpdate(token);
          if (response.ok) {
            setMessage(getResponseMessage(response.data, "Email mis a jour."));
            await refreshAuthData();
          } else {
            setMessage(response.error ?? "Erreur lors de la confirmation d'email.");
          }
          break;
        }
        case "verifyEmail": {
          const response = await auth.verifyEmail(token);
          setMessage(response.ok ? getResponseMessage(response.data, "Email verifie.") : response.error ?? "Erreur de verification.");
          break;
        }
        case "revokeRegister": {
          const response = await auth.revokeRegister(token);
          setMessage(response.ok ? getResponseMessage(response.data, "Inscription revoquee.") : response.error ?? "Erreur de revocation.");
          break;
        }
        case "revokeEmailUpdate": {
          const response = await auth.revokeEmailUpdate(token);
          setMessage(response.ok ? getResponseMessage(response.data, "Changement d'email annule.") : response.error ?? "Erreur de revocation.");
          break;
        }
        default:
          setMessage("Action inconnue.");
      }
    };

    void runAction();
  }, [auth, authCtx, navigate]);

  return (
    <>
      <Title title={message} size={1} />
    </>
  );
};

export default NewEmail;
