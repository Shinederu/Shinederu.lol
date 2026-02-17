import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./shared/context/AuthContext";
import { ModalProvider } from "./shared/context/ModalContext";
import MessageModal from "./components/modals/ModalMessage";
import { AuthProvider as ExternalAuthProvider } from "@shinederu/auth-react";
import { authClient } from "./shared/auth/client";

createRoot(document.getElementById('app')!).render(
  <ExternalAuthProvider client={authClient} autoRefreshOnMount={false}>
    <AuthProvider>
      <BrowserRouter>
        <ModalProvider>
          <App />
          <MessageModal />
        </ModalProvider>
      </BrowserRouter>
    </AuthProvider>
  </ExternalAuthProvider>
);
