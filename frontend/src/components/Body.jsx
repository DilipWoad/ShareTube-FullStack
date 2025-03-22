import { Outlet } from "react-router";
import Header from "./Header";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
import SideBar from "./Sidebar";
import { useSelector } from "react-redux";


const Body = () => {
  const videoStore = useSelector((store) => store.video);

  useGetUserInfo();

  return (
    <div className="bg-gray-800">
      <Header />
      <div className="flex">
        <SideBar menuClicked={videoStore?.isMenuClicked} />
        <Outlet />
      </div>
    </div>
  );
};

export default Body;
