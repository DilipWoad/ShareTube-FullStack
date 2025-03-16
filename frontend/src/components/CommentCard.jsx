const CommentCard = ({comment}) => {
    const{commentOwner,content} = comment;
    if(!comment) return <div>Loading... wait</div>
  return (
    <div className="p-2 flex bg-slate-300 my-2 ml-2 mr-7 max-w-[800px] rounded-lg">
      <div className="">
        <img
          className="w-10 h-10 rounded-full"
          src={commentOwner?.avatar}
          alt="avatar"
        />
      </div>
      <div className="bg-slate-300 mx-2 flex items-center justify-between w-full rounded-lg">
        <div>
          <div className="font-semibold">@{commentOwner?.username}</div>
          <div>{content}</div>
        </div>
        <div className="w-fit p-2 rounded-full hover:cursor-pointer hover:bg-white hover:transt">
          ⫶
        </div>
      </div>
    </div>
  );
};
export default CommentCard;
