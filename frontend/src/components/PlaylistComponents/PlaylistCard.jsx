import axios from "axios";
import { useState } from "react";
import { Link } from "react-router";
import { BASE_URL } from "../../utils/constant";
import { useDispatch } from "react-redux";
import { deletePlaylist } from "../../slices/librarySlice";
import PlaylistEditOption from "./PlaylistEditOption";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const PlaylistCard = ({ playlist, menuClicked, css, thumbnailcss }) => {
  const [options, setOptions] = useState(false);
  const [editOption, setEditOption] = useState(false);
  const { _id, description, playlistVideos, title } = playlist;
  const dispatch = useDispatch();
  const menuRef = useOutsideClick(setOptions);

  const deleteAPlaylist = async () => {
    try {
      const res = await axios.delete(BASE_URL + `/playlist/${_id}`, {
        withCredentials: true,
      });
      console.log(res);
      dispatch(deletePlaylist(_id));
    } catch (error) {
      console.log(error);
    }
  };

  if (!playlist) return <div>Loading...</div>;

  return (
    <>
      <div
        className={`bg-purple-400 w-96 rounded-lg overflow-hidden m-4 ${
          menuClicked ? "w-[330px]" : ""
        } shadow-lg hover:shadow-gray-300 ${css} `}
      >
        <div className="">
          <img
            className={`w-full max-h-48 ${thumbnailcss}`}
            src={playlistVideos[0]?.thumbnail}
          />{" "}
          {/*get the first video thumbnail*/}
        </div>
        <div className="bg-yellow-400 flex justify-between">
          <Link to={{ pathname: "/playlist", search: `?list=${_id}` }}>
            <div className="mt-1 px-2">
              <p className="text-md font-semibold text-wrap">{title}</p>
              <p className="text-[13px] font-semibold text-wrap">
                Channel Name
              </p>
              <p className="text-[12px] text-wrap hover:text-gray-300 hover:cursor-pointer">
                View full playlist
              </p>
            </div>
          </Link>
          <div ref={menuRef} className="bg-lime-300  text-center ">
            <button
              onClick={() => setOptions(!options)}
              className="text-lg  w-7 h-7 font-semibold  relative hover:bg-orange-700 rounded-full"
            >
              ⫶
            </button>
            {options && (
              <div className="absolute bg-cyan-300 w-24 rounded-lg p-1 z-10 space-y-2 flex flex-col items-start">
                <button
                  onClick={() => setEditOption(!editOption)}
                  className="hover:bg-lime-300 w-full text-start relative"
                >
                  Edit
                </button>
                <button
                  onClick={deleteAPlaylist}
                  className="hover:bg-lime-300 w-full text-start "
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {editOption && (
        <PlaylistEditOption
          playlistId={_id}
          setEditOption={setEditOption}
          title={title}
          description={description}
          playlistThumbnail={playlistVideos[0]?.thumbnail}
        />
      )}
    </>
  );
};

export default PlaylistCard;
