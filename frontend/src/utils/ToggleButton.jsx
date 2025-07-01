const ToggleButton = ({ toggle, setShowBox }) => {
  return (
    <div
      onClick={() => setShowBox(true)}
      className={` w-8 h-4 rounded-full relative flex items-center mr-1 ${
        toggle
          ? " bg-gray-400 transition-all duration-200"
          : "bg-white transition-all duration-200"
      }`}
    >
      <div
        className={`bg-gray-500 w-3 h-3 rounded-full  ${
          toggle
            ? " absolute right-0 transition-all duration-500 "
            : "transition-all duration-200"
        }`}
      ></div>
    </div>
  );
};

export default ToggleButton;
