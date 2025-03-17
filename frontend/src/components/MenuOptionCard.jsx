import { Link } from "react-router";

const MenuOptionCard = ({ Icon, Label, menuClicked, path }) => {
  return (
    <li className={`${menuClicked ? "w-full" : ""}`}>
      <Link to={path}>
        <div
          className={`${
            menuClicked
              ? "flex flex-row items-center px-2 mx-3 rounded-lg p-1 hover:bg-yellow-200 hover:cursor-pointer transition"
              : "flex flex-col justify-center items-center hover:cursor-pointer hover:bg-purple-400 w-[70px] py-3 rounded-xl transition "
          }`}
        >
          <span className={`text-2xl ${menuClicked ? "w-8 text-center" : ""}`}>
            {Icon}
          </span>{" "}
          <p className={`${menuClicked ? "text-[16px] ml-5" : ""}`}>{Label}</p>
          
        </div>
        {menuClicked && Label === "You" && (
        <ul className="text-lg bg-lime-300">
          <Link to={'/history'}><li>History</li></Link>
          <li>Playlists</li>
          <li>My videos</li>
          <li>Watch Later</li>
          <li>Liked videos</li>
        </ul>
      )}
      </Link>
      
    </li>
  );
};
export default MenuOptionCard;
