import axios from "axios";
import PostCard from "../PostComponents/PostCard";
import { BASE_URL } from "../../utils/constant";
import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";

const ChannelPosts = () => {

  const {channelId } = useOutletContext();
  const [channelPosts,setChannelPosts] = useState(null);

  const handleChannelPosts = async () => {
    try {
      //data fetch
      const res = await axios.get(`${BASE_URL}/post/user/${channelId}`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setChannelPosts(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    handleChannelPosts();
  },[])
  if(!channelPosts) return <div>Loading Posts ...</div>
  return (
    <div className="no-flex w-4/5 m-10">
      {channelPosts.map((post) => (
        <PostCard post={post} />
      ))}
    </div>
  );
};

export default ChannelPosts;
