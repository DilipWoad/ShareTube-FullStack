import axiosInstance from "../../api/axiosInstance.js";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPlaylist } from "../../slices/playlistSlice";
import PlaylistVideoCard from "./PlaylistVideoCard";
import VideoAndPlaylistEditOption from "./VideoAndPlaylistEditOption";
import EditSvgIcon from "../../utils/SVGIcons/EditSvgIcon";
import LoadingScreen from "../../utils/LoadingScreen";
import emptyThumbnail from "../../assets/no_video_in_playlist-thumbnail.png"


const Playlist = () => {
  const dispatch = useDispatch();
  const playlist = useSelector((store) => store.playlist);
  const user = useSelector((store) => store.user);
  const [editOption, setEditOption] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(playlist);

  const [searchParams, setSearchParams] = useSearchParams();
  const playlistId = searchParams.get("list");

  const getPlaylist = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/playlist/${playlistId}`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      dispatch(addPlaylist(res.data.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getPlaylist();
  }, [dispatch, playlistId]);
  console.log("Current playlist state:", playlist);

  if (!playlist) return <LoadingScreen />;
  return (
    <div className=" flex flex-col sm:flex-row p-2 sm:p-4 w-full h-full ">
      {/* playlistDescription+CoverImg+Info */}
      <div className="bg-gray-700 sm:w-[360px] p-2 sm:p-5 rounded-lg h-fit mb-4">
        {/* coverImg */}
        <div className=" mb-6 border-1 shadow-xl">
          <img
            className="max-h-44 w-full rounded-lg object-cover"
            src={playlist?.playlistVideos[0]?.thumbnail || emptyThumbnail}
            alt="thumbnail"
          />
        </div>
        {/* playlistInfo */}
        <div className="bg-gray-300 rounded-lg p-2 mb-2">
          <p className="text-xl font-bold">{playlist.title}</p>
          <div className=" flex items-center gap-2 my-1 mx-1">
            <img
              className="w-8 h-8 sm:w-6 sm:h-6 hover:cursor-pointer rounded-full object-cover"
              src={user.avatar}
              alt="avatar"
            />
            <p className="text-sm font-medium">by {user.fullName}</p>
          </div>
          <p className="text-[12px] font-semibold">
            Playlist · {playlist?.playlistVideos?.length} videos
          </p>
          <div
            onClick={() => setEditOption(!editOption)}
            className="flex items-center hover:cursor-pointe "
          >
            <button className="  mt-1 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-500">
              <EditSvgIcon />
            </button>
            Edit
          </div>
        </div>
        {/* playlistDescription */}
        <div className="bg-gray-500 p-2 rounded-lg">
          <p className="text-[12px] font-semibold ">{playlist.description}</p>
        </div>
      </div>

      {/* playlistVideos */}
      <div className="bg-gray-700 h-screen overflow-y-scroll flex-1 sm:mx-2 p-2 rounded-lg">
        <div className="">
          {playlist.playlistVideos.map((video) => (
            <div key={video._id} className="">
              <PlaylistVideoCard video={video} playlistId={playlistId} />
            </div>
          ))}
        </div>
      </div>
      {editOption && (
        <VideoAndPlaylistEditOption
          id={playlist._id}
          setEditOption={setEditOption}
          title={playlist.title}
          description={playlist.description}
          thumbnail={playlist.playlistVideos[0]?.thumbnail}
          isVideoEdit={false}
        />
      )}
    </div>
  );
};

export default Playlist;
