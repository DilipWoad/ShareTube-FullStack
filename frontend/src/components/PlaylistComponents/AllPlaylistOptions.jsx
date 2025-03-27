import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../utils/constant";
import CreateNewPlaylist from "./CreateNewPlaylist";

const AllPlaylistOptions = ({ setPlaylistOption, videoId }) => {
  const [playlistId, setPlaylistId] = useState(null);
  const [createPlaylistOption, setCreatePlaylistOption] = useState(false);

  const playlistMenu = useSelector((store) => store.library.playlist);

  if (!playlistMenu) return <div>Loading...</div>;

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
    } finally {
      setPlaylistOption(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-400 w-60 flex flex-col p-4 rounded-lg shadow-lg">
        <div className="flex justify-between text-lg mb-4">
          <p>Add to Playlist</p>
          <button
            onClick={() => setPlaylistOption(false)}
            className="hover:bg-slate-300 w-8 h-8 rounded-full"
          >
            ✕
          </button>
        </div>
        {playlistMenu.map((playlist) => (
          <div>
            <input
              className="m-2"
              type="checkbox"
              defaultValue={playlistId}
              onChange={(e) =>
                setPlaylistId(e.target.checked ? playlist._id : null)
              }
            />
            {playlist?.title}
          </div>
        ))}
        <div className="mt-10 flex justify-between ">
          <button
            onClick={() => setCreatePlaylistOption(!createPlaylistOption)}
            className="bg-gray-500 px-2 rounded-lg "
          >
            Create new Playlist
          </button>
          <button
            onClick={addVideoToPlaylist}
            className="bg-white px-3 py-1 rounded-lg"
          >
            Add
          </button>
        </div>
      </div>
      {createPlaylistOption && (
        <CreateNewPlaylist createOption={setCreatePlaylistOption} />
      )}
    </div>
  );
};

export default AllPlaylistOptions;
