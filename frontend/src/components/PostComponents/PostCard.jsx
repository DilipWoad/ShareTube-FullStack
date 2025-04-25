const PostCard = ({ post }) => {
  const { content, createdAt, postOwner, _id } = post;
  return (
   
      <div className=" p-3 flex mb-7 rounded-xl border-2">
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
            <p>Like</p>
            <p>Comments</p>
          </div>
        </div>
      </div>
    
  );
};

export default PostCard;
