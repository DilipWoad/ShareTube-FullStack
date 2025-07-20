import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../utils/constant";
import CreateNewPlaylist from "./CreateNewPlaylist";
import { addUserPlaylist } from "../../slices/librarySlice";
import { setToastCardHidden, toastCardDetail } from "../../slices/toastCardSlice";

const AllPlaylistOptions = ({ setPlaylistOption, videoId }) => {
  const [playlistId, setPlaylistId] = useState(null);
  const [createPlaylistOption, setCreatePlaylistOption] = useState(false);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const playlistMenu = useSelector((store) => store.library.playlist);

  const getPlaylist = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/playlist/user/${user._id}`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      dispatch(addUserPlaylist(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };
  const addVideoToPlaylist = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/playlist/add/${videoId}/${playlistId}`,
        {},
        { withCredentials: true }
      );
      console.log(res.data);
      // mke here the tost to work
      dispatch(
        toastCardDetail({
          label: "Video added to the playlist Successfully",
          cardColor: "bg-green-500",
        })
      );
    } catch (error) {
      console.error(error);
      
    } finally {
      setPlaylistOption(false);
      getPlaylist();
    }
  };

  // if (!playlistMenu) return <div>Loading...</div>;

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
        {playlistMenu &&
          playlistMenu.map((playlist) => (
            <div key={playlist._id}>
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
