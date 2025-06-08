import axios from "axios";
import { useState } from "react";
import { Link } from "react-router";
import { removeVideoFromPlaylist } from "../../slices/playlistSlice";
import { BASE_URL } from "../../utils/constant";
import { useDispatch } from "react-redux";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const PlaylistVideoCard = ({ video, playlistId }) => {
  const { videoOwner, thumbnail, title, views, _id } = video;
  const dispatch = useDispatch();
  const [options, setOptions] = useState(false);
  const menuRef = useOutsideClick(setOptions);

  const removeVideo = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + `/playlist/remove/${_id}/${playlistId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeVideoFromPlaylist(_id));
    } catch (error) {
      console.log("Error removing video:", error);
    }
  };
  return (
    <div
    ref={menuRef}
      className={
        "bg-gray-500 w-full rounded-lg overflow-hidden mb-2 border-2"
      }
    >
      <div className={"flex justify-between"}>
        <Link
          to={{ pathname: "/watch", search: `?v=${_id}` }}
          className={"flex"}
        >
          <img className={`w-56 h-36 object-cover`} src={thumbnail} />
          <div className="flex">
            <div className="m-2">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={videoOwner?.avatar}
                alt="avatar"
              />
            </div>
            <div className="mt-2">
              <p className="text-md font-semibold text-wrap">{title}</p>
              <p className="text-sm mt-2">{videoOwner?.fullName}</p>
              <p className="text-sm">{views} views</p>
            </div>
          </div>
        </Link>

        <div className="bg-gray-600 flex items-center relative">
          <button
            onClick={() => setOptions(!options)}
            className=" text-2xl h-9 w-9 rounded-full hover:bg-gray-800 text-white"
          >
            ⫶
          </button>
          {options && (
            <div className="absolute right-6 top-20 w-44 text-center bg-gray-800 text-white p-1 rounded-lg">
              <button onClick={removeVideo} className="p-1">
                Remove from playlist
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistVideoCard;
