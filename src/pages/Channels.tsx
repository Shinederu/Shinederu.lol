import Title from "@/components/decoration/Title";
import TwitchEmbed from "@/components/integrations/TwitchEmbed";
import YouTubeEmbed from "@/components/integrations/YouTubeEmbed";
import { useInterval } from "@/shared/hooks/useInterval";
import { useState } from "react";

const TWITCH_HINTS = [
  "Pas de planning fixe, alors garde les notifs activees.",
  "Les lives peuvent tomber sans prevenir.",
  "Le Discord reste le meilleur canal pour les annonces.",
];

const Channels = () => {
  const [hintIndex, setHintIndex] = useState(0);

  useInterval(() => {
    setHintIndex((prev) => (prev + 1) % TWITCH_HINTS.length);
  }, 4500);

  return (
    <>
      <section className="border-b-4 border-[#6b6b6b] pb-10 mb-6 inline-block w-full">
        <Title title="Twitch" size={2} />
        <p>Si tu souhaites regarder mes streams en direct, tout se passe sur Twitch.</p>
        <TwitchEmbed />
        <div className="flex flex-col items-center bg-[#10101f] p-5 sm:p-6 rounded-xl border-2 border-[#6a11cb] animate-fadeInUp">
          <p>
            Comme je n'ai pas de planning, il faut rester connecte pour ne rien louper. Qui sait, peut-etre qu'un planning finira par arriver.
            <br />
            <i>(Astuce: tu peux activer les notifs pour savoir si je lance un live.)</i>
          </p>
          <p className="mt-2 text-sm text-[#bbbbbb]">{TWITCH_HINTS[hintIndex]}</p>
          <div className="mt-4 text-center">
            <a
              href={import.meta.env.VITE_TWITCH_CHANNEL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#6a11cb] to-[#2575fc] py-3 px-5 mt-4 rounded-md font-bold transition-transform duration-200 hover:scale-105"
            >
              Voir la chaine Twitch
            </a>
          </div>
        </div>
      </section>

      <section className="pb-6 mb-4 inline-block w-full">
        <Title title="YouTube" size={2} />
        <p>Si tu as loupe un live, les rediffusions sont disponibles sur YouTube.</p>
        <YouTubeEmbed />
        <div className="flex flex-col items-center bg-[#10101f] p-5 sm:p-6 rounded-xl border-2 border-[#cb1111] animate-fadeInUp">
          <p>
            Tous les lives sont disponibles sur YouTube.
            <br />
            <i>(Pour l'instant, l'integration affiche une image de previsualisation.)</i>
          </p>
          <div className="mt-4 text-center">
            <a
              href={import.meta.env.VITE_YOUTUBE_CHANNEL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#6a11cb] to-[#2575fc] py-3 px-5 mt-4 rounded-md font-bold transition-transform duration-200 hover:scale-105"
            >
              Voir la chaine YouTube
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Channels;
