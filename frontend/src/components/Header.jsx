import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";

const Header = () => {
  const userDetails = useSelector((store) => store.user);
  const location = useLocation();
  return (
    <div className="h-16 bg-gray-500 flex items-center justify-between px-10">
      <div>
        <Link to={'/'}>
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
            <img
              className="w-11 h-11 rounded-full"
              src={userDetails.avatar}
            />
          </div>
        </div>
      ) : (
        location.pathname !== '/login' &&
        <Link to={"/login"}>
          <button className="bg-blue-500 px-4 rounded-md py-1 hover:bg-blue-600 text-white transition">
            Login
          </button>
        </Link>
      )}
    </div>
  );
};

export default Header;
