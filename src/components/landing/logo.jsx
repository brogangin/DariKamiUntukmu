const Logo = ({ size = 5, textSize = "text-2xl" }) => {
  return (
    <div className="flex items-center space-x-3">
      <img
        src="/logo.png"
        alt="Logo"
        className={`w-[60px] h-[50px] -ml-2 drop-shadow-lg`}
      />
      <span
        className={`${textSize} font-poppins font-semibold bg-gradient-to-r from-pink-500 to-amber-600 text-transparent bg-clip-text tracking-wide`}
      >
        DariKamiUntukmu
      </span>
    </div>
  );
};

export default Logo;