import { Outlet } from "react-router";
import Header from "./HeaderComponets/Header";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
import SideBar from "./Sidebar";
import { useSelector } from "react-redux";


const Body = () => {
  const videoStore = useSelector((store) => store.video);
  
  useGetUserInfo();

  return (
    // <div className="bg-gray-800 w-screen">
    //   <Header />
    //   <div className="flex">
    //     <SideBar menuClicked={videoStore?.isMenuClicked} />
    //     <Outlet />
    //   </div>
    // </div>
    <div className="min-h-screen bg-gray-800 text-black flex flex-col w-screen">
      <Header />
      <div className="flex flex-grow overflow-auto">
        <SideBar menuClicked={videoStore?.isMenuClicked} />
        <Outlet />
      </div>
    </div>
  );
};

export default Body;
