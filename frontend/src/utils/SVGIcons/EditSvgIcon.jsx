const EditSvgIcon = ({ size = "w-6 h-6", color = "text-gray-600", hover = "hover:text-white" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${size} ${color} ${hover} transition-all duration-300`}
    >
      <path d="M16.474 3.586a2 2 0 0 1 2.828 0l1.112 1.112a2 2 0 0 1 0 2.828l-2.486 2.486-3.94-3.94 2.486-2.486Zm-3.171 3.171 3.94 3.94L7.95 19.889a1 1 0 0 1-.53.278l-3.49.582a.5.5 0 0 1-.584-.584l.582-3.49a1 1 0 0 1 .278-.53L13.303 6.757Z" />
    </svg>
  );
};

export default EditSvgIcon;
