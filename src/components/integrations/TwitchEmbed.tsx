import { useEffect } from "react";

const TwitchEmbed = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://player.twitch.tv/js/embed/v1.js";
    script.async = true;
    script.onload = () => {
      if (window.Twitch) {
        new window.Twitch.Embed("twitch-embed", {
          width: "100%",
          height: "100%",
          channel: "Shinederu",
          layout: "video",
          theme: "dark",
          parent: [window.location.hostname],
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="aspect-video rounded-xl border-4 border-[#6a11cb] mt-5 mb-6 w-full max-w-5xl overflow-hidden">
        <div id="twitch-embed" className="w-full h-full" />
      </div>
    </div>
  );
};

export default TwitchEmbed;
