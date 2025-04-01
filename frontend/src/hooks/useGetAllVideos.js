import { useDispatch, useSelector } from "react-redux";
import { addVideo } from "../slices/videoSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useEffect } from "react";
export const useGetAllVideos = () => {
  const dispatch = useDispatch();
  const videoStore = useSelector((store)=>store.video);

  const getAllVideo = async () => {
    try {
      const res = await axios.get(BASE_URL + "/video", {
        withCredentials: true,
      });
      const videos = res.data; 
      dispatch(addVideo(videos.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllVideo();
  }, [dispatch]);
};
