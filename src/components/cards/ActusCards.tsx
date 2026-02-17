import Title from "../decoration/Title";

type ActusProps = {
  title: string;
  message: string;
  btnLabel: string;
  link: string;
  date: string;
  highlighted?: boolean;
};

const ActusCards = ({ title, message, btnLabel, link, date, highlighted = false }: ActusProps) => {
  return (
    <div
      className={`grid grid-rows-[auto_1fr_auto_auto] bg-[#10101f] pt-4 pb-4 px-5 sm:px-6 rounded-xl border-2 min-h-[19rem] sm:min-h-[22rem] transition-all duration-300 hover:-translate-y-1 ${
        highlighted ? "border-[#5f9bff] shadow-[0_0_22px_rgba(37,117,252,0.35)]" : "border-[#3eda30]"
      }`}
    >
      <Title title={title} size={3} />

      <p className="text-white text-left overflow-auto">{message}</p>

      {link && btnLabel ? (
        <div className="flex justify-center self-end pb-4">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#6a11cb] to-[#2575fc] py-2.5 px-4 rounded-md font-bold transition-transform duration-200 hover:scale-105"
          >
            {btnLabel}
          </a>
        </div>
      ) : (
        <div className="self-end pb-4" />
      )}

      <p className="text-sm text-gray-400 text-right">Publie le {date}</p>
    </div>
  );
};

export default ActusCards;
