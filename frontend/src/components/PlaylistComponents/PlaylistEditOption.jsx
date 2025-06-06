import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../../utils/constant";
import { useDispatch } from "react-redux";
import { editPlaylistInfo } from "../../slices/librarySlice";

const PlaylistEditOption = ({
  playlistId,
  setEditOption,
  description,
  title,
  playlistThumbnail,
  isVideoEdit,
}) => {
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescriptiont] = useState(description);
  const dispatch = useDispatch();

  const [videoThumbnail, setVideoThumbnail] = useState(null);

  const handleThumbnail = (e) => {
    if (e.target.files) {
      console.log(e.target.files);
      setVideoThumbnail(e.target.files[0]);
    }
  };

  //video edit
  const data = new FormData();
  data.append("thumbnail", videoThumbnail);
  data.append("title", editTitle);
  data.append("description", editDescription);
  ///

  let editInfo = {
    id: playlistId,
    title: editTitle,
    description: editDescription,
  };

  const editPlaylistDetails = async () => {
    if (!isVideoEdit) {
      try {
        const res = await axios.patch(
          BASE_URL + `/playlist/${playlistId}`,
          {
            title: editTitle,
            description: editDescription,
          },
          { withCredentials: true }
        );

        console.log(res.data.data);
        dispatch(editPlaylistInfo(editInfo));
        setEditOption(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      // For Video Editing Details
      try {
        const res = await axios.patch(
          `${BASE_URL}/video/update/${playlistId}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        console.log(res.data);
        // dispatch(editPlaylistInfo(editInfo));
        setEditOption(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="bg-slate-400  w-72 flex flex-col p-3 shadow-lg rounded-lg">
        <div className="flex justify-between p-2 text-lg">
          <p>Edit Playlist...</p>
          <button onClick={() => setEditOption(false)}>✕</button>
        </div>
        <div className="">
          <img
            className="rounded-lg w-72 h-36 my-4"
            src={playlistThumbnail}
            alt="thumbnail"
          />
          {/* for video edit thumbnail */}
          <label>Cover Image</label>
          <input
            type="file"
            className="text-sm  py-1 rounded-lg flex flex-wrap"
            onChange={handleThumbnail}
          />
          {/* //// */}
          <label className=" flex flex-col my-3">
            Title
            <input
              onChange={(e) => setEditTitle(e.target.value)}
              type="text"
              value={editTitle}
              className=" p-1 bg-slate-400 border-b-2"
            />
          </label>
          <label className=" flex flex-col my-3">
            Description
            <input
              onChange={(e) => setEditDescriptiont(e.target.value)}
              type="text"
              value={editDescription}
              className=" p-1 bg-slate-400 border-b-2"
            />
          </label>

          <button
            onClick={editPlaylistDetails}
            className="bg-white w-full mt-5 py-1 rounded-full hover:bg-slate-300 hover:text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistEditOption;
