import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constant";

const AllPlaylistOptions = ({ setPlaylistOption, videoId }) => {
  const [playlistId, setPlaylistId] = useState(null);
  const playlistMenu = useSelector((store) => store.library.playlist);
  if (!playlistMenu) return <div>Loading...</div>;

  console.log(playlistId);

  const addVideoToPlaylist = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + `/playlist/add/${videoId}/${playlistId}`,
        {},
        { withCredentials: true }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }finally{
        setPlaylistOption(false)
    }
  };

  return (
    <div className="absolute h-screen w-screen z-40 bg-black/50 flex items-center justify-center top-0 left-0">
      <div className="bg-slate-400 z-50 w-56 flex flex-col p-4 shadow-lg">
        <div
          onClick={() => setPlaylistOption(false)}
          className=" text-end relative -top-3 bg-gray-500 left-52 w-fit px-2 hover:cursor-pointer"
        >
          X
        </div>
        {playlistMenu.map((playlist) => (
          <div>
            <input
              type="checkbox"
              defaultValue={playlistId}
              onChange={(e) =>
                setPlaylistId(e.target.checked ? playlist._id : null)
              }
            />
            {playlist?.title}
          </div>
        ))}
        <div className="mt-4 space-x-2 text-end">
          <button onClick={()=>setPlaylistOption(false)} className="bg-gray-500 px-2 rounded-lg ">Cancel</button>
          <button onClick={addVideoToPlaylist} className="bg-white px-3 rounded-lg">Add</button>
        </div>
      </div>
    </div>
  );
};

export default AllPlaylistOptions;
