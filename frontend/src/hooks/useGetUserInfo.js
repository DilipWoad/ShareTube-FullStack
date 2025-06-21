import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../slices/userSlice";
import { BASE_URL } from "../utils/constant";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

export const useGetUserInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = useSelector((store) => store.user);

  const userInfo = async () => {
    try {
      const response = await axiosInstance.get("/user/userinfo", {
        withCredentials: true,
      });
      console.log(response);
      dispatch(addUser(response.data.data));
    } catch (error) {
      navigate("/login");
      console.log(error);
    }
  };
  useEffect(()=>{
    !userDetails && userInfo();
  },[])
};
