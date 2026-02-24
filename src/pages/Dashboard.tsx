import MenuCards from "@/components/cards/MenuCards";
import { AuthContext } from "@/shared/context/AuthContext";
import { useContext } from "react";

const Dashboard = () => {
  const authCtx = useContext(AuthContext);

  return (
    <div className="grid gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <MenuCards active={true} name="Profile" desc="Vois et modifie ton profile !" url="/profile" picture="profile.gif" />
        {authCtx.is_admin ? (
          <MenuCards active={true} name="Utilisateurs" desc="Gere les droits administrateurs." url="/users" picture="profile.gif" />
        ) : null}
        {authCtx.is_admin ? (
          <MenuCards active={true} name="Annonces" desc="Gere les annonces de l'accueil." url="/announcements" picture="profile.gif" />
        ) : null}
        <MenuCards active={false} name="MelodyQuest" desc="Un blindtest amusant !" url="/MelodyQuest" picture="MelodyQuest.png" />
        <MenuCards active={false} name="Ananas" desc="Le celebre reseau social #FUN" url="/Ananas" picture="Ananas.png" />
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
