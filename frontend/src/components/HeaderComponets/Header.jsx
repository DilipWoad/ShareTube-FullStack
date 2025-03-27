import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { MENU_IMG, YT_LOGO } from "../../utils/constant";
import { useHandleLogout } from "../../hooks/useHandleLogout";
import { removeUser } from "../../slices/userSlice";
import { removeVideoFeed, toggleMenuClick } from "../../slices/videoSlice";

const Header = () => {
  const userDetails = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  const handleLogout = async () => {
    await useHandleLogout();
    dispatch(removeUser());
    dispatch(removeVideoFeed());
    navigate("/login");
  };

  return (
    <div className="h-16 bg-gray-500 flex items-center justify-between pl-2 pr-10">
      <div className="flex items-center gap-x-8 p-2">
        <div onClick={()=>dispatch(toggleMenuClick())} className="hover:cursor-pointer relative hover:bg-slate-300 p-2 rounded-full transition">
          <img className="w-9" src={MENU_IMG} />
        </div>
        {/* TODO:This need to be protect when at login page clicked on logo it goes to /feed page */}
        <Link to={"/"}>
          <img className="w-20" src={YT_LOGO} />
        </Link>
      </div>
      {userDetails ? (
        <div className="flex items-center gap-3">
          <div>
            <p>Welcome, {userDetails.fullName}</p>
          </div>
          <div className="">
            <img className="w-11 h-11 rounded-full" src={userDetails.avatar} />
          </div>
          <button onClick={handleLogout} className="">
            <img
              className="w-6 ml-3 "
              src="https://cdn-icons-png.flaticon.com/128/1286/1286853.png"
              alt="logout"
            />
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
