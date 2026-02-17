type InfoCardsProps = {
  twitchStatus: string;
};

const InfoCards = ({ twitchStatus }: InfoCardsProps) => {
  return (
    <div className="pb-8 mb-6 w-full inline-block border-b-4 border-[#6b6b6b]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
        <div className="flex flex-col items-start bg-[#10101f] p-5 sm:p-6 rounded-xl border-2 border-[#6a11cb] animate-fadeInUp">
          <div>
            <h2 className="text-xl font-bold mb-2 border-b-2 border-[#6a11cb] pb-1 flex items-center gap-2">
              Les Directs
              <span className="inline-flex h-3 w-3 rounded-full bg-[#20c70e] animate-pulse" />
            </h2>
            <p className="text-[#f0f0f0] leading-relaxed">
              Il arrive de temps en temps que je lance des streams sur Twitch. Je n'ai aucun planning et ca n'est pas mon activite principale.
              Mais j'aime bien en faire de temps en temps pour m'amuser.
            </p>
            <p className="mt-2 text-sm text-[#adadad]">Statut du moment: {twitchStatus}</p>
          </div>
          <div className="flex justify-center w-full">
            <a
              href={import.meta.env.VITE_TWITCH_CHANNEL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#6a11cb] to-[#2575fc] py-3 px-5 mt-4 rounded-md font-bold transition-transform duration-200 hover:scale-105"
            >
              Rejoindre Twitch
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start bg-[#10101f] p-5 sm:p-6 rounded-xl border-2 border-[#cb1111] animate-fadeInUp">
          <div>
            <h2 className="text-xl font-bold mb-2 border-b-2 border-[#cb1111] pb-1">Les Rediffusions</h2>
            <p className="text-[#f0f0f0] leading-relaxed">
              Si t'aimes mes lives, bonne nouvelle: l'integralite des streams est disponible sur YouTube.
              Tu peux en profiter quand tu veux et laisser ton avis en commentaire.
            </p>
          </div>
          <div className="flex justify-center w-full">
            <a
              href={import.meta.env.VITE_YOUTUBE_CHANNEL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#6a11cb] to-[#2575fc] py-3 px-5 mt-4 rounded-md font-bold transition-transform duration-200 hover:scale-105"
            >
              Voir les rediffusions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
