import { Routes } from "react-router-dom";
import { getRoutes } from "./utils/routes";
import Header from "./components/headers/Header";
import Footer from "./components/footers/Footer";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "./shared/context/AuthContext";

const App = () => {

  const { can_manage_announcements, can_manage_users, is_admin, isLoggedIn, reload } = useContext(AuthContext);
  const hasLoadedAuth = useRef(false);


  useEffect(() => {
    if (hasLoadedAuth.current) return;
    hasLoadedAuth.current = true;

    void reload();
  }, [reload]);


  return (

    <div className="bg-[#0d0d0d] text-white font-[Poppins] min-h-screen flex flex-col">
      <Header />
      <main
        className="w-[94%] sm:w-11/12 max-w-6xl mx-auto my-5 sm:my-8 lg:my-10 p-4 sm:p-6 lg:p-8 bg-[#1e1e1e] rounded-lg border border-[#2b2b2b] shadow-[0_0_30px_rgba(37,117,252,0.12)] text-center flex-grow"
      >
        <Routes>{getRoutes(isLoggedIn, can_manage_users, can_manage_announcements, is_admin)}</Routes>
      </main>
      <Footer />
    </div>


  );

};

export default App;
