import { useDispatch, useSelector } from "react-redux";
import { useGetAllVideos } from "../../hooks/useGetAllVideos";
import VideoCard from "./VideoCard";
import { useEffect } from "react";
import { removeVideoComments } from "../../slices/commentSlice";
import { BASE_URL } from "../../utils/constant";
import axios from "axios";
import { addUserPlaylist } from "../../slices/librarySlice";

const VideoFeed = () => {
  const videoStore = useSelector((store) => store.video);
  const userStore = useSelector((store)=>store.user);
  const playlistStore = useSelector((store)=>store.library.playlist);
  const userId = userStore?._id
  const videos = videoStore?.feeds;
  const dispatch=useDispatch();

  console.log(playlistStore);

  const getPlaylist=async()=>{
    try {
        const res = await axios.get(BASE_URL+`/playlist/user/${userId}`,{withCredentials:true})
        console.log(res.data.data);
        dispatch(addUserPlaylist(res.data.data))
    } catch (error) {
        console.log(error);
    }
  }

  useGetAllVideos();
  useEffect(()=>{
    getPlaylist();
    dispatch(removeVideoComments());
  },[playlistStore?.length])
  
  if (videos?.length === 0) return <div>Loading...</div>;
  return (
    <div className="flex">

      <div className="flex flex-wrap my-10">
        {videos &&
          videos.map((video) => (
            <VideoCard key={video._id} video={video} menuClicked={videoStore?.isMenuClicked}/>
          ))}
      </div>
    </div>
  );
};

export default VideoFeed;
