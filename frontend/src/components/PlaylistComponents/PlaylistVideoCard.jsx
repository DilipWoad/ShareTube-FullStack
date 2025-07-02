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
      className={"bg-gray-500 w-full rounded-lg  mb-2 border-2 sm:p-2 p-1"}
    >
      <div className={"flex justify-between"}>
        <Link
          to={{ pathname: "/watch", search: `?v=${_id}` }}
          className={"flex"}
        >
          <img
            className={`sm:w-48 sm:h-28 w-32 object-cover rounded-lg`}
            src={thumbnail}
          />

          <div className=" ml-2">
            <p className="text-base sm:text-lg font-semibold truncate">{title}</p>
            <p className="text-sm sm:mt-2 mt-1">{videoOwner?.fullName}</p>
            <p className="text-sm">{views} views</p>
          </div>
        </Link>

        <div className=" rounded-r-lg sm:flex sm:items-center relative">
          <button
            onClick={() => setOptions(!options)}
            className=" sm:text-2xl text-lg w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-gray-800 text-white"
          >
            ⫶
          </button>
          {options && (
            <div className="absolute sm:right-6 right-6 top-5 sm:top-20 text-nowrap text-sm opacity-85 text-center bg-gray-800 text-white p-1 rounded-lg">
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
