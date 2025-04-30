import axios from "axios";
import PostCard from "../PostComponents/PostCard";
import { BASE_URL } from "../../utils/constant";
import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CreatePost from "../PostComponents/CreatePost";

const ChannelPosts = () => {
  const { channelId } = useOutletContext();
  const [channelPosts, setChannelPosts] = useState(null);
  const [showCreatePostBox, setShowCreatePostBox] = useState(false);

  const userId = useSelector((store) => store.user._id);

  const handleChannelPosts = async () => {
    try {
      //data fetch
      const res = await axios.get(`${BASE_URL}/post/user/${channelId}`, {
        withCredentials: true,
      });
      const channelPost = res.data.data;
      setChannelPosts(channelPost.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleChannelPosts();
    if (userId == channelId) {
      setShowCreatePostBox(true);
    }
  }, []);
  if (!channelPosts) return <div>This Channel has No Posts!!</div>;
  return (
    <>
      {showCreatePostBox && <CreatePost />}
      <div className="no-flex w-4/5 m-10">
        {channelPosts.map((post) => (
          <PostCard post={post} />
        ))}
      </div>
    </>
  );
};

export default ChannelPosts;
