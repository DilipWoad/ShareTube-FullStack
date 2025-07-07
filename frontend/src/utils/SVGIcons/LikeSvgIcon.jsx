const LikeSvgIcon = ({ liked = false, size = "w-6 h-6", className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={liked ? "currentColor" : "none"}
      stroke="black"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${size} ${liked ? "text-blue-600" : "text-gray-500"} transition-all duration-300 ${className}`}
    >
      <path d="M2 20h2a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H2v10Zm20-9a1 1 0 0 0-1-1h-6.31l.95-4.57.03-.32a1 1 0 0 0-.29-.7L14.17 3 7.59 9.59A2 2 0 0 0 7 11v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-1.58l1.38-7a1 1 0 0 0 .01-.42Z" />
    </svg>
  );
};

export default LikeSvgIcon;

