import { useSelector } from "react-redux";
import { Link, NavLink, Outlet } from "react-router";
import UploadVideo from "../VideoComponents/UploadVideo";
import { useState } from "react";

const ChannelStudio = () => {
  const user = useSelector((store) => store.user);
  const [cancel, setCancel] = useState(false);

  const setCancelFalse = () => {
    setCancel(false);
  };

  return (
    <div className="flex flex-col sm:flex-row w-screen h-screen my-2 sm:m-2 bg-gray-700">
      {/* avatar+navLink */}
      <div className="sm:w-52 sm:h-fit text-center sm:mr-4 flex flex-col px-2">
        {/* avatar */}
        <div className=" flex justify-center sm:h-44 sm:mb-4 ">
          <img
            className="w-28 h-28 sm:w-44 sm:h-44 rounded-full object-cover"
            src={user?.avatar}
            alt="avatar"
          />
        </div>

        {/* navLink */}
        <div className="sm:rounded-xl rounded-lg overflow-hidden bg-slate-400 sm:p-2 sm:items-stretch items-center justify-between mb-2 mt-6  text-sm sm:text-lg flex sm:flex-col sm:h-fit">
          <NavLink
            to={"/studio/dashboard"}
            className={({ isActive }) =>
              isActive
                ? "p-2  border-[1px] hover:text-black hover:cursor-pointer bg-gray-500 text-white"
                : "bg-gray-400 p-2  hover:cursor-pointer hover:bg-gray-500 hover:text-white text"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to={"/studio/edit-profile"}
            className={({ isActive }) =>
              isActive
                ? "p-2  border-[1px] hover:text-black hover:cursor-pointer bg-gray-500 text-white"
                : "bg-gray-400 p-2  hover:cursor-pointer hover:bg-gray-500 hover:text-white"
            }
          >
            Edit profile
          </NavLink>
          <NavLink
            to={"/studio"}
            className={({ isActive }) =>
              isActive
                ? "p-2  border-[1px] hover:text-black hover:cursor-pointer bg-gray-500 text-white"
                : "bg-gray-400 p-2  hover:cursor-pointer hover:bg-gray-500 hover:text-white text"
            }
          >
            Videos
          </NavLink>
          <NavLink
            to={`/channel/@${user?.username}/posts`}
            className={({ isActive }) =>
              isActive
                ? "p-2  border-[1px] hover:text-black hover:cursor-pointer bg-gray-500 text-white"
                : "bg-gray-400 p-2  hover:cursor-pointer hover:bg-gray-500 hover:text-white text"
            }
          >
            Posts
          </NavLink>
        </div>
      </div>

      {/* coverImage */}
      <div className="flex-grow h-screen overflow-y-scroll">
        <div className=" h-44 mb-4 sm:pr-2 px-2">
          <img
            className="h-44 rounded-xl w-full object-fill"
            src={user?.coverImage}
          />
        </div>
        {/* here all the other options will render */}
        <Outlet context={{ setCancelFalse }} />
      </div>

      <UploadVideo setCancel={setCancel} cancel={cancel} />
    </div>
  );
};

export default ChannelStudio;
