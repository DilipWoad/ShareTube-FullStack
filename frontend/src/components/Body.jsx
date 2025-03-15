import { Outlet } from "react-router";
import Header from "./Header";
import { useGetUserInfo } from "../hooks/useGetUserInfo";

const Body = () => {
  useGetUserInfo();
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default Body;
