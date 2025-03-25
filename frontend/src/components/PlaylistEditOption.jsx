import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { editPlaylistInfo } from "../slices/librarySlice";

const PlaylistEditOption = ({
  playlistId,
  setEditOption,
  description,
  title,
  playlistThumbnail,
}) => {
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescriptiont] = useState(description);
  const dispatch = useDispatch();

  let editInfo ={
    id:playlistId,
    title:editTitle,
    description:editDescription
  }

  const editPlaylistDetails=async()=>{
    try {
        const res = await axios.patch(BASE_URL+`/playlist/${playlistId}`,{
            title:editTitle,
            description:editDescription
        },{withCredentials:true})

        console.log(res.data.data);
        dispatch(editPlaylistInfo(editInfo))
        setEditOption(false)
    } catch (error) {
        console.log(error);
    }

  }

  return (
    <div className="absolute h-screen w-screen bg-black/50 flex items-center justify-center top-0 left-0">
      <div className="bg-slate-400  w-72 flex flex-col p-3 shadow-lg rounded-lg">
        <div className="flex justify-between p-2 text-lg">
          <p>Edit Playlist...</p>
          <button onClick={() => setEditOption(false)}>X</button>
        </div>
        <div className="">
          <img
            className="rounded-lg w-72 h-36 my-4"
            src={playlistThumbnail}
            alt="thumbnail"
          />
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

          <button onClick={editPlaylistDetails} className="bg-white w-full mt-5 py-1 rounded-full hover:bg-slate-300 hover:text-white">Save</button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistEditOption;
