type TitleProps = {
  title: string;
  size: number;
};

const Title = (props: TitleProps) => {
  const checkSize = () => {
    switch (props.size) {
      case 1:
        return "text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f0f0f0]";
      case 2:
        return "text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f0f0f0]";
      case 3:
        return "text-xl sm:text-2xl font-extrabold tracking-tight text-[#f0f0f0]";
      case 4:
        return "text-lg sm:text-xl font-extrabold tracking-tight text-[#f0f0f0]";
      default:
        return "text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f0f0f0]";
    }
  };

  return (
    <div className="pt-2 pb-3">
      <h1 className={checkSize()}>{props.title}</h1>
    </div>
  );
};

export default Title;
