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

  const [newPostDisplay ,setNewPostDisplay] = useState([]);

  const user = useSelector((store) => store.user);

  const handleChannelPosts = async () => {
    try {
      //data fetch
      const res = await axios.get(`${BASE_URL}/post/user/${channelId}`, {
        withCredentials: true,
      });
      const channelPost = res.data.data;
      console.log(channelPost)
      setChannelPosts(channelPost);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleChannelPosts();
    if (user._id == channelId) {
      setShowCreatePostBox(true);
    }
  }, []);
  if (!channelPosts) return <div>This Channel has No Posts!!</div>;
  return (
    <>
      {showCreatePostBox && <CreatePost setNewPost={setNewPostDisplay} newPost={newPostDisplay}/>}
      <div className="no-flex w-4/5 m-10">
        {newPostDisplay && newPostDisplay.map((post)=>(
          <PostCard post={post} userInfo={user}/>
        ))}
        {channelPosts.map((post) => (
          <PostCard post={post} userInfo={user} />
        ))}
      </div>
    </>
  );
};

export default ChannelPosts;
