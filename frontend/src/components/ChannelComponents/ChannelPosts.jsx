import PostCard from "../PostComponents/PostCard";

const ChannelPosts = ({ channelPosts }) => {
  return <div className="no-flex w-4/5 m-10">
  {
    channelPosts.map((post)=>(
        <PostCard post={post}/>
    ))
  }
  </div>;
};

export default ChannelPosts;
