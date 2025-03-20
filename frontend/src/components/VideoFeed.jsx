import { useDispatch, useSelector } from "react-redux";
import { useGetAllVideos } from "../hooks/useGetAllVideos";
import VideoCard from "./VideoCard";
import { useEffect } from "react";
import { removeVideoComments } from "../slices/commentSlice";


const VideoFeed = () => {
  const videoStore = useSelector((store) => store.video);
  const videos = videoStore?.feeds;
  const dispatch=useDispatch();

  console.log(videos);
  useGetAllVideos();
  useEffect(()=>{
    dispatch(removeVideoComments());
  })
  
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
