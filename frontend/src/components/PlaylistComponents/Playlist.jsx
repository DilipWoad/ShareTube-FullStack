import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { useSearchParams } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPlaylist } from "../../slices/playlistSlice";
import PlaylistVideoCard from "./PlaylistVideoCard";

const Playlist = () => {
  const dispatch = useDispatch();
  const playlist = useSelector((store)=>store.playlist);
  console.log(playlist)

  const [searchParams, setSearchParams] = useSearchParams();
  const playlistId = searchParams.get("list");
  
  const getPlaylist = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/playlist/${playlistId}`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      dispatch(addPlaylist(res.data.data))
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPlaylist();
  }, [dispatch,playlistId]);
  console.log("Current playlist state:", playlist);

  if (!playlist) return <div>Loading...</div>;
  return (
    <div className=" flex p-4 w-full">
      <div className="bg-gray-700 w-[360px] p-5 rounded-lg h-fit">
        <div className=" rounded-lg overflow-hidden mb-6 border-1 shadow-xl">
          <img
            className="max-h-44 w-full object-cover"
            src={playlist?.playlistVideos[0]?.thumbnail}
            alt="thumbnail"
          />
        </div>
        <div className="bg-gray-300 rounded-lg p-2 mb-2">
          <p className="text-xl font-bold">{playlist.title}</p>
          <p className="text-sm">creator name</p>
          <p className="text-[12px] font-semibold">
            Playlist · {playlist?.playlistVideos?.length} videos
          </p>
        </div>
        <div className="bg-gray-500 p-2 rounded-lg">
          <p className="text-[12px] font-semibold ">{playlist.description}</p>
        </div>
      </div>
      <div className="bg-gray-700 flex-1 mx-2 p-2 rounded-lg">
        <div className="">
          {playlist.playlistVideos.map((video) => (
            <div key={video._id} className="flex  justify-between items-center">
              <PlaylistVideoCard video={video} playlistId={playlistId}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
