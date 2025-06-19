import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { LOGOUT_ICON, MENU_IMG, YT_LOGO } from "../../utils/constant";
import { useHandleLogout } from "../../hooks/useHandleLogout";
import { removeUser } from "../../slices/userSlice";
import { removeVideoFeed, toggleMenuClick } from "../../slices/videoSlice";
import {
  removeUserHistory,
  removeUserLikeVideos,
  removeUserPlaylist,
} from "../../slices/librarySlice";
import { useState } from "react";

const Header = () => {
  const userDetails = useSelector((store) => store?.user);
  const [createOption, setCreateOption] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  const handleLogout = async () => {
    await useHandleLogout();
    dispatch(removeUser());
    dispatch(removeVideoFeed());
    dispatch(removeUserHistory());
    dispatch(removeUserLikeVideos());
    dispatch(removeUserPlaylist());
    navigate("/login");
  };

  return (
    <div className="h-16 bg-gray-500 flex items-center justify-between pl-2 pr-10">
      <div className="flex items-center gap-x-8 p-2">
        <div
          onClick={() => dispatch(toggleMenuClick())}
          className="hover:cursor-pointer relative hover:bg-slate-300 p-2 rounded-full transition"
        >
          <img className="w-9" src={MENU_IMG} />
        </div>
        {/* TODO:This need to be protect when at login page clicked on logo it goes to /feed page */}
        <Link to={"/"}>
          <img className="w-20" src={YT_LOGO} />
        </Link>
      </div>
      {userDetails ? (
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setCreateOption(!createOption)}
            className="bg-white px-2 py-1 rounded-full hover:bg-gray-300"
          >
            ✚ Create
          </button>
          {createOption && (
            <div className="bg-sky-400 absolute flex flex-col top-10 p-2 rounded-lg">
              <Link to={"/studio"}>
                <div
                  onClick={() => setCreateOption(false)}
                  className="hover:bg-yellow-300 p-1 hover:cursor-pointer"
                >
                  upload video
                </div>
              </Link>
              <Link
                to={`/channel/@${userDetails?.username}/posts`}
                className="hover:bg-yellow-300 p-1 hover:cursor-pointer"
                onClick={() => setCreateOption(false)}
              >
                create post
              </Link>
            </div>
          )}
          <div>
            <p>Welcome, {userDetails.fullName}</p>
          </div>
          <Link to={`/channel/@${userDetails.username}`} className="">
            <img
              className="w-11 h-11 rounded-full object-cover"
              src={userDetails.avatar}
            />
          </Link>
          <button onClick={handleLogout} className="">
            <img className="w-6 ml-3 " src={LOGOUT_ICON} alt="logout" />
          </button>
        </div>
      ) : (
        location.pathname !== "/login" && (
          <Link to={"/login"}>
            <button className="bg-blue-500 px-4 rounded-md py-1 hover:bg-blue-600 text-white transition">
              Login
            </button>
          </Link>
        )
      )}
    </div>
  );
};

export default Header;
