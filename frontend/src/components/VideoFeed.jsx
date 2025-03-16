import { useSelector } from "react-redux";

import { Link } from "react-router";
import { useGetAllVideos } from "../hooks/useGetAllVideos";
import VideoCard from "./VideoCard";

const VideoFeed = () => {
  const videos = useSelector((store) => store.video);
  console.log(videos);
  useGetAllVideos();
  if (videos?.length === 0) return <div>Loading...</div>;
  return (
    <div className="flex">
      <div className="bg-sky-300 h-fit">
        <ul className="bg-red-300 flex flex-col items-center gap-y-8 mt-5 text-sm min-w-24">
          <li>Home</li>
          <li>Shorts</li>
          <li>Music</li>
          <li>Subscription</li>
          <li>You</li>
        </ul>
      </div>
      <div className="flex flex-wrap my-10   bg-lime-400">
        {videos &&
          videos.map((video) => (
            <VideoCard key={video._id} video={video}/>
          ))}
      </div>
    </div>
  );
};

export default VideoFeed;
