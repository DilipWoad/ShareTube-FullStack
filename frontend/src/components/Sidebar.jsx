import { useLocation } from "react-router";
import MenuOptionCard from "./HeaderComponets/MenuOptionCard";
import { useDispatch } from "react-redux";
import { toggleMenuClick } from "../slices/videoSlice";
import { useEffect } from "react";

const SideBar = ({ menuClicked }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
  if (menuClicked==false  && location.pathname !== '/') {
    dispatch(toggleMenuClick());
  }
}, [location.pathname]); 
  return (
    <div className={`bg-gray-500  fixed sm:relative  rounded-br-xl z-10
      ${location.pathname ===('/login' || '/signup') ? "hidden":""}  h-fit 
    ${menuClicked ? "w-fit hidden sm:block" : ""}`}>
      <ul
        className={` flex flex-col items-center  ${
          menuClicked ? "my-2 gap-y-2" : " gap-y-8 mt-5"
        }  text-[12px] font-semibold min-w-22 mx-1`}
      >
        <MenuOptionCard
          Icon={"🏠︎"}
          Label={"Home"}
          menuClicked={menuClicked}
          currentPath ={location.pathname}
          path={"/"}
        />
        <MenuOptionCard
          Icon={"🎫"}
          Label={"Subscription"}
          menuClicked={menuClicked}
          path={"/subscription"}
        />
        <MenuOptionCard
          Icon={"🙍🏻‍♂️"}
          Label={"You"}
          menuClicked={menuClicked}
          path={"/you"}
        />
      </ul>
    </div>
  );
};

export default SideBar;
