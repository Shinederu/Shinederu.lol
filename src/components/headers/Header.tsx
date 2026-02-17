import { Link } from "react-router-dom";
import ModalLogin from "../modals/ModalLogin";
import { useContext, useState } from "react";
import { AuthContext } from "@/shared/context/AuthContext";
import ProfileHeader from "./ProfileHeader";

const Header = () => {
  const authCtx = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Accueil", to: "/" },
    { label: "Les Chaines", to: "/channels" },
    { label: "Communaute", to: "/community" },
    { label: "A Propos", to: "/aboutme" },
  ];

  return (
    <header>
      <h1 className="bg-gradient-to-r from-[#6a11cb] to-[#2575fc] p-4 sm:p-5 text-center text-2xl sm:text-3xl tracking-wider">
        {authCtx.isLoggedIn === true ? (
          <Link to="/dashboard">
            Salutation <b>{authCtx.username}</b> !
          </Link>
        ) : (
          <Link to="/" className="font-bold">
            Shinederu.lol
          </Link>
        )}
      </h1>

      <nav className="bg-[#1a1a1a] px-3 sm:px-6 py-4 border-b border-[#262626]">
        <div className="mx-auto max-w-6xl flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden px-3 py-2 rounded-md bg-[#252525] text-sm font-semibold"
          >
            {menuOpen ? "Fermer" : "Menu"}
          </button>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                className="text-white text-lg transition-colors duration-300 hover:text-[#6a11cb]"
                to={link.to}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto">
            {authCtx.isLoggedIn ? <ProfileHeader /> : <ModalLogin />}
          </div>
        </div>

        <div
          className={`${menuOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"} md:hidden overflow-hidden transition-all duration-300`}
        >
          <div className="flex flex-col items-start gap-3 rounded-md bg-[#202020] p-4">
            {links.map((link) => (
              <Link
                key={link.to}
                className="text-white text-base transition-colors duration-300 hover:text-[#6a11cb]"
                to={link.to}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
