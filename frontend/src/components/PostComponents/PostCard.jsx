import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constant";
import { Link, useNavigate } from "react-router";

const PostCard = ({ post }) => {
  const [isPostLiked, setIsPostLiked] = useState(false);
  const { content, createdAt, postOwner, _id } = post;
  const navigate = useNavigate();
  const handlePostLike = async () => {
    //when clicked change the given state
    try {
      const res = await axios.post(
        `${BASE_URL}/like/p/${_id}`,
        {},
        { withCredentials: true }
      );
      console.log(res.data);
      setIsPostLiked(!isPostLiked);
    } catch (error) {
      console.log(error);
    }
  };

  const isUserLikedThePost = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/like/p/${_id}`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      const likedStatus = res.data.data;
      setIsPostLiked(likedStatus);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostCommentClick=(postId)=>{
    navigate(`/channel/${postOwner._id}/post?id=${postId}`)
  }

  useEffect(() => {
    isUserLikedThePost();
  }, []);
  return (
    <div key={_id} className=" p-3 flex mb-7 rounded-xl border-2">
      <div className=" mr-2">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={postOwner?.avatar}
          alt="avatar"
        />
      </div>
      <div className="">
        <div className="flex space-x-2 text-sm">
          <p className="font-bold ">{postOwner?.fullName}</p>
          <p>{createdAt}</p>
        </div>
        <div className="mt-1 text-lg">{content}</div>
        <div className="flex space-x-3 mt-5 text-[15px] font-semibold">
          <button
            onClick={handlePostLike}
            className={`hover:bg-gray-300 rounded-full text-3xl ${
              isPostLiked ? "bg-red-500 hover:bg-red-300" : ""
            } h-7 w-7 flex items-center justify-center overflow-clip`}
          >
            <span
              className={`${
                isPostLiked ? " text-white hover:text-black " : ""
              }`}
            >
              ♡
            </span>
          </button>
          <button onClick={()=>handlePostCommentClick(_id)}>💬</button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
