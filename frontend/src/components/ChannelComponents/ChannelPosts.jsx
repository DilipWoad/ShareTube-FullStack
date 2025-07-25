import axiosInstance from "../../api/axiosInstance.js";
import PostCard from "../PostComponents/PostCard";
import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "../PostComponents/CreatePost";
import { addPost } from "../../slices/postSlice";

const ChannelPosts = () => {
  const { channelId } = useOutletContext();
  // const [channelPosts, setChannelPosts] = useState(null);
  const [showCreatePostBox, setShowCreatePostBox] = useState(false);

  const channelPosts = useSelector((store) => store.post);
  const dispatch = useDispatch();

  // const [newPostDisplay ,setNewPostDisplay] = useState([]);

  const user = useSelector((store) => store.user);

  const handleChannelPosts = async () => {
    try {
      //data fetch
      const res = await axiosInstance.get(`/post/user/${channelId}`, {
        withCredentials: true,
      });
      const channelPost = res.data.data;
      console.log(channelPost);
      dispatch(addPost(channelPost));
      // setChannelPosts(channelPost);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleChannelPosts();
    if (user._id == channelId) {
      setShowCreatePostBox(true);
    }
  }, [dispatch, channelId]);
  if (!channelPosts) return <div>This Channel has No Posts!!</div>;
  return (
    <div className="px-1">
      {showCreatePostBox && <CreatePost />}
      <div className=" sm:w-4/5 w-full  sm:m-10">
        {/* {newPostDisplay && newPostDisplay.map((post)=>(
          <PostCard post={post} userInfo={user}/>
        ))} */}
        {channelPosts.map((post) => (
          <PostCard key={post._id} post={post} userInfo={user} />
        ))}
      </div>
    </div>
  );
};

export default ChannelPosts;
