import { useDispatch, useSelector } from "react-redux";
import { addVideo } from "../slices/videoSlice";
import axiosInstance from "../api/axiosInstance.js";

import { useEffect } from "react";
export const useGetAllVideos = (videos) => {
  const dispatch = useDispatch();
  const getAllVideo = async () => {
    try {
      const res = await axiosInstance.get(`/video`, {
        withCredentials: true,
      });
      const videos = res.data;
      console.log("nbvbvjf0", videos.data);
      dispatch(addVideo(videos.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllVideo();
  }, [dispatch]);
};
