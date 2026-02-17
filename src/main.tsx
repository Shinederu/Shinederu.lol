import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./shared/context/AuthContext";
import { ModalProvider } from "./shared/context/ModalContext";
import MessageModal from "./components/modals/ModalMessage";

createRoot(document.getElementById('app')!).render(
  /* Contexte d'authentification */
  <AuthProvider>
    {/* Permet le routage avec react-router-dom */}
    <BrowserRouter>
      <ModalProvider>
        {/* Composant principal de l'application */}
        <App />
        <MessageModal/>
      </ModalProvider>
    </BrowserRouter>
  </AuthProvider>
);