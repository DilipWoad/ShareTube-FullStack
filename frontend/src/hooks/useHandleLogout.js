import { useDispatch } from "react-redux";
import axiosInstance from "../api/axiosInstance.js";
import { removeUser } from "../slices/userSlice.js";
import { removeVideoFeed } from "../slices/videoSlice.js";
import {
  removeUserHistory,
  removeUserLikeVideos,
  removeUserPlaylist,
} from "../slices/librarySlice.js";

export const useHandleLogout = () => {
  const dispatch = useDispatch();
  const logout = async () => {
    try {
      await axiosInstance.post(
        "/user/logout",
        {},
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(removeUser());
      dispatch(removeVideoFeed());
      dispatch(removeUserHistory());
      dispatch(removeUserLikeVideos());
      dispatch(removeUserPlaylist());
    } catch (error) {
      console.log(error);
    }
  };

  return logout;
};
