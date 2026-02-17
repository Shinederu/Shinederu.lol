import ActusCards from "@/components/cards/ActusCards";
import InfoCards from "@/components/cards/InfoCards";
import Title from "@/components/decoration/Title";
import { useInterval } from "@/shared/hooks/useInterval";
import { useMemo, useState } from "react";

type Actu = {
  title: string;
  message: string;
  date: string;
  btnLabel: string;
  link: string;
};

const ACTUS: Actu[] = [
  {
    title: "Nouveau design web !",
    message:
      "Finalement l'autre style n'etait pas assez adapte a mes envies. Difficile d'y ajouter des elements sans casser l'ensemble.",
    date: "08 fevrier 2025",
    btnLabel: "",
    link: "",
  },
  {
    title: "Spodeur se met aux lives",
    message:
      "Mon copain Spodeur a commence a streamer. Son contenu change de ses videos YouTube, allez jeter un oeil a ses lives.",
    date: "28 janvier 2025",
    btnLabel: "Visiter sa chaine Twitch",
    link: "https://www.twitch.tv/spodeuroof",
  },
  {
    title: "Retour des lives",
    message: "Apres une pause, je suis de retour pour lancer des directs avec les copaings. Rejoins-moi sur Twitch.",
    date: "28 janvier 2025",
    btnLabel: "",
    link: "",
  },
  {
    title: "Refonte du site web",
    message: "Une nouvelle charte graphique est arrivee, avec des fonctionnalites qui vont arriver progressivement.",
    date: "28 janvier 2025",
    btnLabel: "",
    link: "",
  },
];

const TWITCH_STATUSES = [
  "Hors ligne, mais ca peut partir en live d'un coup.",
  "Preparation en cours pour un prochain stream.",
  "Pense a activer les notifs Twitch pour ne rien louper.",
];

const Homepage = () => {
  const [now, setNow] = useState(new Date());
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  useInterval(() => setNow(new Date()), 1000);
  useInterval(() => setFeaturedIndex((prev) => (prev + 1) % ACTUS.length), 7000);
  useInterval(() => setStatusIndex((prev) => (prev + 1) % TWITCH_STATUSES.length), 5000);

  const localTime = useMemo(
    () =>
      now.toLocaleTimeString("fr-CH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [now]
  );

  return (
    <>
      <section className="mb-8 rounded-xl border border-[#2f2f2f] bg-[#181818] p-5 sm:p-7 animate-fadeInUp">
        <Title title="Salutation jeune aventurier !" size={1} />
        <p>
          Bienvenue sur mon site ! Je suis Shinederu, un mec assez random qui joue a des jeux video. Profite bien de cet espace mis a ta disposition.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#3f3f3f] bg-[#121212] px-3 py-2 text-sm text-gray-300">
          Heure locale: <span className="font-semibold text-white">{localTime}</span>
        </div>
      </section>

      <InfoCards twitchStatus={TWITCH_STATUSES[statusIndex]} />

      <section className="mb-4 inline-block w-full">
        <Title title="A la une" size={2} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
          {ACTUS.map((actu, index) => (
            <ActusCards
              key={`${actu.title}-${actu.date}`}
              title={actu.title}
              message={actu.message}
              date={actu.date}
              btnLabel={actu.btnLabel}
              link={actu.link}
              highlighted={index === featuredIndex}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Homepage;
