import MenuCards from "@/components/cards/MenuCards";
import { AuthContext } from "@/shared/context/AuthContext";
import { useContext } from "react";

const Dashboard = () => {
  const authCtx = useContext(AuthContext);

  return (
    <div className="grid gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <MenuCards active={true} name="Profile" desc="Vois et modifie ton profile !" url="/profile" picture="Profile" />
        {authCtx.can_manage_users ? (
          <MenuCards active={true} name="Utilisateurs" desc="Consulte les comptes et leurs acces." url="/users" picture="Utilisateurs" />
        ) : null}
        {authCtx.can_manage_announcements ? (
          <MenuCards active={true} name="Annonces" desc="Gere les annonces de l'accueil." url="/announcements" picture="Annonces" />
        ) : null}
        {authCtx.is_admin ? (
          <MenuCards active={true} name="Permissions" desc="Gere les projets et droits centralises." url="/permissions" picture="Permission" />
        ) : null}
        <MenuCards active={true} name="MelodyQuest" desc="Un blindtest amusant !" url="https://melodyquest.shinederu.ch/#/main" picture="MelodyQuest" />
        <MenuCards active={true} name="ShinedeWake" desc="Reveille et gere tes machines a distance." url="https://wake.shinederu.ch/" picture="ShinedeWake" />
        <MenuCards active={false} name="Ananas" desc="Le celebre reseau social #FUN" url="/Ananas" picture="Ananas" />
      </div>

      <div className="flex items-center flex-col justify-center gap-4 rounded-xl border border-[#2f2f2f] bg-[#181818] py-8 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">Prochainement ici, encore plus de projets !</h1>
        <p>
          <i>Vous verrez, ca va bientot se remplir !</i>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
