import Title from "@/components/decoration/Title";
import { useInterval } from "@/shared/hooks/useInterval";
import { useState } from "react";

const COMMUNITY_TIPS = [
  "Passe sur Discord pour suivre les lives et les annonces.",
  "Propose tes idees, la page communaute evolue en continu.",
  "N'hesite pas a partager memes, clips et moments marquants.",
];

const Community = () => {
  const [tipIndex, setTipIndex] = useState(0);

  useInterval(() => {
    setTipIndex((prev) => (prev + 1) % COMMUNITY_TIPS.length);
  }, 5000);

  return (
    <>
      <section className="border-b-4 border-[#6b6b6b] pb-8 mb-8 w-full flex justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-5 w-full max-w-5xl">
          <div className="flex justify-center">
            <iframe
              src="https://discord.com/widget?id=539000723023724545&theme=dark"
              width="340"
              height="500"
              className="w-full max-w-[340px] rounded-xl border-2 border-[#6a11cb]"
              title="Discord Widget"
            />
          </div>

          <div className="bg-[#10101f] p-5 sm:p-6 rounded-xl border-2 border-[#6a11cb] text-white animate-fadeInUp">
            <Title size={2} title="Rejoins la Communaute" />
            <p className="mb-4">
              Rejoins une communaute fun et accueillante ou tu pourras discuter de tout et de rien: jeux video, tech, et memes.
              Le serveur Discord est le meilleur endroit pour rester informe de mes lives, evenements et projets.
            </p>
            <p className="mb-4 text-sm text-[#bbbbbb]">{COMMUNITY_TIPS[tipIndex]}</p>
            <div className="flex justify-center">
              <a
                href={import.meta.env.VITE_DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#6a11cb] to-[#2575fc] py-3 px-5 rounded-md font-bold transition-transform duration-200 hover:scale-105"
              >
                Rejoindre le Discord
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center">
        <div className="w-full max-w-5xl bg-[#10101f] p-5 sm:p-6 rounded-xl border-2 border-[#ffed46a6] animate-fadeInUp">
          <Title title="Et apres ?" size={2} />
          <p>
            Cette page evoluera au fil du temps. Je prevois d'ajouter de nouvelles fonctionnalites, comme un espace de discussion en direct
            ou d'autres moyens d'interagir avec la communaute.
            <br />
            <br />
            Tu retrouveras ici des informations sur les elements disponibles quand tu es connecte.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            Pour l'instant, rejoins-nous sur Discord et n'hesite pas a partager tes idees pour ameliorer cette page.
          </p>
        </div>
      </section>
    </>
  );
};

export default Community;
