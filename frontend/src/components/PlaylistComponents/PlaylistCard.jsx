import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { BASE_URL } from "../../utils/constant";
import { useDispatch } from "react-redux";
import { deletePlaylist } from "../../slices/librarySlice";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import VideoAndPlaylistEditOption from "./VideoAndPlaylistEditOption";

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
        className={` w-96 h-fit  rounded-lg ${
          menuClicked ? "w-[330px]" : ""
        } shadow-lg hover:shadow-gray-300 ${css} `}
      >
        <div className="">
          <img
            className={`w-full max-h-48 rounded-t-lg ${thumbnailcss} object-cover`}
            src={playlistVideos[0]?.thumbnail}
          />{" "}
          {/*get the first video thumbnail*/}
        </div>
        <div className="bg-gray-700 flex justify-between rounded-b-xl">
          <Link to={{ pathname: "/playlist", search: `?list=${_id}` }}>
            <div className=" ">
              <p className="text-md font-semibold text-wrap">{title}</p>
              <p className="text-[13px] font-semibold text-wrap">
                Channel Name
              </p>
              <p className="text-[12px] text-wrap hover:text-gray-300 hover:cursor-pointer my-2">                         
                View full playlist
              </p>
            </div>
          </Link>
          <div ref={menuRef} className="relative  text-center ">
            <button
              onClick={() => setOptions(!options)}
              className="text-lg  w-7 h-7 font-semibold   hover:bg-gray-100 rounded-full"
            >
              ⫶
            </button>
            {options && (
              <div className="absolute top-5 right-8 bg-gray-900 text-white w-24 rounded-lg p-1 space-y-2 flex flex-col items-start">
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
        <VideoAndPlaylistEditOption
          id={_id}
          setEditOption={setEditOption}
          title={title}
          description={description}
          thumbnail={playlistVideos[0]?.thumbnail}
        />
      )}
    </>
  );
};

export default PlaylistCard;
