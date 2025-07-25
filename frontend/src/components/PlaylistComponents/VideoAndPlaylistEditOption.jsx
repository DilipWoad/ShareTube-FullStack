import axiosInstance from "../../api/axiosInstance.js";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { editPlaylist } from "../../slices/playlistSlice";
import { editVideoInfo } from "../../slices/studioSlice";
import LoadingScreen from "../../utils/LoadingScreen";
import { editPlaylistInfo } from "../../slices/librarySlice";

const VideoAndPlaylistEditOption = ({
  id,
  setEditOption,
  description,
  title,
  thumbnail,
  isVideoEdit,
}) => {
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescriptiont] = useState(description);
  //video
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  //video
  const handleThumbnail = (e) => {
    if (e.target.files) {
      console.log(e.target.files);
      setVideoThumbnail(e.target.files[0]);
    }
  };

  //video edit
  const videoData = new FormData();
  videoData.append("thumbnail", videoThumbnail);
  videoData.append("title", editTitle);
  videoData.append("description", editDescription);
  ///

  //playlist Edited Data
  // const playlistData = new FormData();
  // playlistData.append("title", editTitle);
  // playlistData.append("description", editDescription);
  //

  let editInfo = {
    id: id,
    title: editTitle,
    description: editDescription,
  };

  //videoinfo sending to dispatch
  let videoEditInfo = {
    _id: id,
    title: editTitle,
    description: editDescription,
    thumbnail: videoThumbnail && URL.createObjectURL(videoThumbnail),
  };

  const editPlaylistDetails = async () => {
    setLoading(true);
    if (!isVideoEdit) {
      try {
        const res = await axiosInstance.patch(
          `/playlist/${id}`,
          {
            title: editTitle,
            description: editDescription,
          },
          { withCredentials: true }
        );

        dispatch(editPlaylist(editInfo));

        dispatch(editPlaylistInfo(editInfo));

        setLoading(false);
        setEditOption(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      // For Video Editing Details
      try {
        const res = await axiosInstance.patch(
          `/video/update/${id}`,
          videoData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        console.log(res.data.data);
        dispatch(editVideoInfo(videoEditInfo));
        setLoading(false);

        setEditOption(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  if (loading) return <LoadingScreen />;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="bg-slate-400  w-72 flex flex-col p-3 shadow-lg rounded-lg">
        <div className="flex justify-between p-2 text-lg">
          {!isVideoEdit ? (
            <p>Edit Playlist Details</p>
          ) : (
            <p>Edit Video Details</p>
          )}
          <button onClick={() => setEditOption(false)}>✕</button>
        </div>
        <div className="">
          <img
            className="rounded-lg w-72 h-36 my-4"
            src={thumbnail}
            alt="thumbnail"
          />

          {/* for video edit thumbnail */}
          {isVideoEdit && (
            <label>
              Cover Image
              <input
                type="file"
                className="text-sm  py-1 rounded-lg flex flex-wrap"
                onChange={handleThumbnail}
              />
            </label>
          )}
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

export default VideoAndPlaylistEditOption;
