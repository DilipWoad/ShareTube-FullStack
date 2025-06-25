import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../utils/constant";
import { addNewPost } from "../../slices/postSlice";

const CreatePost = () => {
  const [userPostContent, setUserPostContent] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const owner = {
    avatar: user?.avatar,
    fullName: user?.fullName,
    _id: user?._id,
  };

  const handleCreatePost = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/post`,
        {
          content: userPostContent,
        },
        { withCredentials: true }
      );
      console.log(res.data.data);
      const currentPost = res.data.data;
      //doing this because the create post only returns "content" and ownerId ,
      //  so i just add the postOwner property to this received obj from the server
      const postWithPostOwnerields = {
        ...currentPost,
        postOwner: owner,
      };
      dispatch(addNewPost(postWithPostOwnerields));
      // setNewPost([postWithPostOwnerields,...newPost]);

      setUserPostContent("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="sm:w-4/5 sm:m-10 bg-slate-300 sm:px-10 sm:py-2 rounded-xl flex-col w-full p-2 mb-10 mt-10 ">

      {/* img+fullNme */}
      <div className="flex items-center space-x-3 my-2">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={user?.avatar}
          alt="user-avatar"
        />
        <p className="text-[15px] font-semibold">{user?.fullName}</p>
      </div>
       
      {/* inputBox */}
      <div className="">
        <input
          className="w-full rounded-lg py-1 px-2 my-2 bg-gray-100"
          type="text"
          placeholder="Write your Post..."
          value={userPostContent}
          onChange={(e) => setUserPostContent(e.target.value)}
        />
      </div>
    
      {/* Cancel+Post Btn */}
      <div className="flex justify-end space-x-4 my-2">
        <button
          disabled={userPostContent.trim() === ""}
          onClick={()=>setUserPostContent("")}
          className={`bg-white rounded-full text-sm font-medium py-2 px-5
             ${
              userPostContent.trim() === ""
                ? "hover:cursor-not-allowed bg-gray-300 text-gray-400"
                : "bg-white hover:bg-gray-100 transition-all duration-200"
            }`}
        >
          Cancel
        </button>
        <button
          disabled={userPostContent.trim() === ""}
          onClick={handleCreatePost}
          className={` rounded-full text-sm font-medium py-2 px-5 
            ${
              userPostContent.trim() === ""
                ? "hover:cursor-not-allowed bg-blue-400 text-gray-500"
                : "bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white"
            }`}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
