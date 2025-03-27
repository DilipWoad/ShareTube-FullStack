import { useDispatch } from "react-redux";
import { addCreatedPlaylist } from "../../slices/librarySlice";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";

const CreateNewPlaylist=({createOption})=>{
      const [title, setTitle] = useState("");
      const [description, setDescriptiont] = useState("");
      const dispatch = useDispatch();
    
    //   let editInfo = {
    //     id: playlistId,
    //     title: editTitle,
    //     description: editDescription,
    //   };
    
      const createPlaylist = async () => {
        try {
          const res = await axios.post(
            BASE_URL + `/playlist`,
            {
              title,
              description,
            },
            { withCredentials: true }
          );
    
          console.log(res.data.data);
          dispatch(addCreatedPlaylist(res.data.data))
          createOption(false);
        } catch (error) {
          console.log(error);
        }
      };
    
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-slate-400  w-72 flex flex-col p-3 shadow-lg rounded-lg">
            <div className="flex justify-between p-2 text-lg">
              <p>Create a Playlist...</p>
              <button onClick={() => createOption(false)}>✕</button>
            </div>
            <div className="">
              <label className=" flex flex-col my-3">
                Title
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  value={title}
                  className=" p-1 bg-slate-400 border-b-2"
                />
              </label>
              <label className=" flex flex-col my-3">
                Description
                <input
                  onChange={(e) => setDescriptiont(e.target.value)}
                  type="text"
                  value={description}
                  className=" p-1 bg-slate-400 border-b-2"
                />
              </label>
    
              <button
                onClick={createPlaylist}
                className="bg-white w-full mt-5 py-1 rounded-full hover:bg-slate-300 hover:text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div> 
      );
    
}
export default CreateNewPlaylist;