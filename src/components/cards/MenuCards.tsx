import { useEffect, useMemo, useState } from "react";
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
  const basePictureName = props.picture.replace(/\.(gif|png)$/i, "").trim();
  const [resolvedImage, setResolvedImage] = useState<string | null>(null);

  const candidates = useMemo(() => {
    const lower = basePictureName.toLowerCase();
    const capitalized = lower ? `${lower.charAt(0).toUpperCase()}${lower.slice(1)}` : lower;
    const names = Array.from(new Set([basePictureName, lower, capitalized])).filter(Boolean);
    const paths: string[] = [];

    names.forEach((name) => {
      paths.push(`/img/dashboard/${name}.gif`);
      paths.push(`/img/dashboard/${name}.png`);
    });

    return paths;
  }, [basePictureName]);

  useEffect(() => {
    let cancelled = false;
    setResolvedImage(null);

    const tryLoad = (index: number) => {
      if (cancelled || index >= candidates.length) return;

      const image = new Image();
      image.onload = () => {
        if (!cancelled) setResolvedImage(candidates[index]);
      };
      image.onerror = () => {
        tryLoad(index + 1);
      };
      image.src = candidates[index];
    };

    tryLoad(0);

    return () => {
      cancelled = true;
    };
  }, [candidates]);

  const cardContent = (
    <div
      className={`w-full aspect-square rounded-xl border-2 ${props.active ? "border-[#3eda30]" : "border-[#da3030]"} transition-transform duration-300 hover:scale-[1.02]`}
      style={{
        backgroundImage: resolvedImage ? `url(${resolvedImage})` : "none",
        backgroundColor: "#222222",
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
