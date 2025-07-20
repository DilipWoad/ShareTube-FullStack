import { Outlet } from "react-router";
import Header from "./HeaderComponets/Header";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
import SideBar from "./Sidebar";
import { useSelector } from "react-redux";
import ToastCard from "../utils/ToastCard";


const Body = () => {
  const videoStore = useSelector((store) => store.video);
  const showToastCard = useSelector((store)=>store.toast.showCard)
  
  useGetUserInfo();

  return (
    <div className="min-h-screen bg-gray-800 text-black flex flex-col relative ">
      <Header />
      <div className="flex flex-grow overflow-auto">
        <SideBar menuClicked={videoStore?.isMenuClicked} />
        <Outlet />
      </div>
      {showToastCard && <ToastCard/>}
    </div>
  );
};

export default Body;
