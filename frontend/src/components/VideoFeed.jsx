import { useSelector } from "react-redux";

import { Link } from "react-router";
import { useGetAllVideos } from "../hooks/useGetAllVideos";

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
            <Link to={{ pathname: "/watch", search: `?v=${video._id}` }}>
              <div className="bg-purple-400 w-96 rounded-lg overflow-hidden m-4">
                <div className="">
                  <img className="w-full h-48" src={video.thumbnail} />
                </div>
                <div className="flex">
                  <div className="m-2">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={video.videoOwner.avatar}
                      alt=""
                    />
                  </div>
                  <div className="mt-2">
                    <p>{video.title}</p>
                    <p>{video.description}</p>
                    <div>
                      <p>{video.views} views</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default VideoFeed;
