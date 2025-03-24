import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { useSelector } from "react-redux";

const Playlist = () => {
  const [playlist, setPlaylist] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const menuClicked = useSelector((store) => store.video.isMenuClicked);

  const playlistId = searchParams.get("list");
  const getPlaylist = async () => {
    try {
      const res = await axios.get(BASE_URL + `/playlist/${playlistId}`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setPlaylist(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPlaylist();
  }, []);

  if (!playlist) return <div>Loading...</div>;
  return (
    <div className="bg-lime-400 flex p-4 w-full">
      <div className="bg-sky-400 w-[360px] p-5 rounded-lg h-fit">
        <div className="bg-orange-300 rounded-lg overflow-hidden mb-6">
          <img
            className="max-h-44 w-full"
            src={playlist.playlistVideos[0]?.thumbnail}
            alt="thumbnail"
          />
        </div>
        <div className="bg-red-300 mb-2">
          <p className="text-xl font-bold">{playlist.title}</p>
          <p className="text-sm">creator name</p>
          <p className="text-[12px] font-semibold">
            Playlist · {playlist?.playlistVideos?.length} videos
          </p>
        </div>
        <div className="bg-pink-500">
          <p className="text-[12px] font-semibold ">{playlist.description}</p>
        </div>
      </div>
      <div className="bg-yellow-300 flex-1 mx-1">
        <div className="">
          {playlist.playlistVideos.map((video) => (
            <div className="flex  justify-between items-center">
              <VideoCard
                key={video._id}
                video={video}
                css={`
                  ${menuClicked ? "w-[713px]" : "w-[850px]"} z-10
                `}
                thumbnailcss={"w-[200px] h-[120px]"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
