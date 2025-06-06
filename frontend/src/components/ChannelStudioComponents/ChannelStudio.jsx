import { useSelector } from "react-redux";
import { Link, NavLink, Outlet } from "react-router";
import UploadVideo from "../VideoComponents/UploadVideo";
import { useState } from "react";

const ChannelStudio = () => {
  const user = useSelector((store) => store.user);
  const [cancel, setCancel] = useState(false);

  return (
    <div className="flex w-screen h-screen m-2">
      <div className="bg-yellow-300 w-52 text-center mr-4">
        <div className="bg-lime-200 flex justify-center h-44 mb-4">
          <img
            className="w-44 h-44 rounded-full object-cover"
            src={user?.avatar}
            alt="avatar"
          />
        </div>
        <div className="bg-green-600 text-lg flex flex-col">
          <NavLink
            to={"/studio/dashboard"}
            className={({ isActive }) =>
              isActive
                ? "p-2 border-[1px] hover:text-black hover:cursor-pointer bg-gray-500 text-white"
                : "bg-gray-400 p-2 hover:cursor-pointer hover:bg-gray-500 hover:text-white text"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to={"/studio/edit-profile"}
            className={({ isActive }) =>
              isActive
                ? "p-2 border-[1px] hover:text-black hover:cursor-pointer bg-gray-500 text-white"
                : "bg-gray-400 p-2 hover:cursor-pointer hover:bg-gray-500 hover:text-white text"
            }
          >
            Edit profile
          </NavLink>
          <NavLink
            to={"/studio"}
            className={({ isActive }) =>
              isActive
                ? "p-2 border-[1px] hover:text-black hover:cursor-pointer bg-gray-500 text-white"
                : "bg-gray-400 p-2 hover:cursor-pointer hover:bg-gray-500 hover:text-white text"
            }
          >
            Videos
          </NavLink>
          <NavLink
            to={"/studio/posts"}
            className={({ isActive }) =>
              isActive
                ? "p-2 border-[1px] hover:text-black hover:cursor-pointer bg-gray-500 text-white"
                : "bg-gray-400 p-2 hover:cursor-pointer hover:bg-gray-500 hover:text-white text"
            }
          >
            Posts
          </NavLink>
        </div>
      </div>
      <div className="bg-blue-300 flex-grow h-screen overflow-y-scroll">
        <div className="bg-red-500 h-44 mb-4">
          <img
            className="h-44 rounded-xl w-full object-fill"
            src={user?.coverImage}
          />
        </div>
        {/* here all the other options will render */}
        <Outlet/>
      </div>
      <UploadVideo setCancel={setCancel} cancel={cancel} />
    </div>
  );
};

export default ChannelStudio;
