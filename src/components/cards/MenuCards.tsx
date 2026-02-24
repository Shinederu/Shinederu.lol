import { Link } from "react-router-dom";
import Title from "../decoration/Title";

type MenuCardsType = {
  active: boolean;
  url: string;
  name: string;
  picture: string;
  desc: string;
};

const MenuCards = (props: MenuCardsType) => {
  const cardContent = (
    <div
      className={`w-full aspect-square rounded-xl border-2 ${props.active ? "border-[#3eda30]" : "border-[#da3030]"} transition-transform duration-300 hover:scale-[1.02]`}
      style={{
        backgroundImage: `url(/img/dashboard/${props.picture})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-black rounded-xl bg-opacity-65 w-full h-full flex justify-center flex-col px-4 py-5">
        <Title size={3} title={props.name} />
        <p>{props.desc}</p>
        {!props.active && <i>Prochainement...</i>}
      </div>
    </div>
  );

  if (props.active) {
    return (
      <Link to={props.url} className="block w-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default MenuCards;
