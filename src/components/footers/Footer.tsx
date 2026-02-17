const Footer = () => {
  return (
    <footer className="text-center py-5 bg-[#1a1a1a] mt-8 text-gray-400 text-xs sm:text-sm">
      <div>Version : {import.meta.env.VITE_SHINEDERU_VERSION}</div>
      <p>
        &copy; 2025{" "}
        <a href="https://shinederu.lol" target="_blank" rel="noopener noreferrer" className="hover:underline">
          Shinederu.lol
        </a>{" "}
        - Tous droits reserves
      </p>
    </footer>
  );
};

export default Footer;
