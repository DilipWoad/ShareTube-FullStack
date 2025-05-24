import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../utils/constant";
import { addNewPost } from "../../slices/postSlice";


const CreatePost = () => {
  const [userPostContent, setUserPostContent] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((store)=>store.user)

  const owner = {
    avatar:user?.avatar,
    fullName:user?.fullName,
    _id:user?._id
  }

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
        postOwner:owner
      }
      dispatch(addNewPost(postWithPostOwnerields));
      // setNewPost([postWithPostOwnerields,...newPost]);
      
      setUserPostContent("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-4/5 m-10 bg-purple-400 px-10 py-2 rounded-xl">
      <div className="flex items-center space-x-3 my-2">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={user?.avatar}
          alt="user-avatar"
        />
        <p className="text-[15px] font-semibold">{user?.fullName}</p>
      </div>
      <div className="">
        <input
          className="w-full rounded-lg py-1 px-2 my-2"
          type="text"
          placeholder="Write your Post..."
          value={userPostContent}
          onChange={(e) => setUserPostContent(e.target.value)}
        />
      </div>
      <div className="flex justify-end space-x-4 my-2">
        <button className="bg-white py-1 px-2 rounded-2xl">Cancel</button>
        <button
          onClick={handleCreatePost}
          className="bg-blue-600 py-1 px-4 rounded-2xl"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
