import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constant";
import { removeUser } from "../slices/userSlice";

const Header = () => {
  const userDetails = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/user/logout",
        {},
        { withCredentials:true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(removeUser());
      navigate('/login')
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-16 bg-gray-500 flex items-center justify-between px-10">
      <div>
        <Link to={"/"}>
          <img
            className="w-20"
            src="https://cdn-icons-png.flaticon.com/512/1383/1383260.png"
          />
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
