const Header = ({ title }) => {
  return (
    <header className="
      bg-white
      h-[64px]
      px-8
      shadow-sm
      border-b border-gray-200
      flex items-center justify-between
      w-full
    ">
      <h5 className="text-lg font-semibold text-[#2f1e14] tracking-tight">
        {title}
      </h5>

      <div className="flex items-center gap-4">
        {/* future actions */}
      </div>
    </header>
  );
};

export default Header;
