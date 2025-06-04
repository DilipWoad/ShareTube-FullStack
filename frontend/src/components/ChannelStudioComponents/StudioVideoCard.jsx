const StudioVideoCard = ({channelVideos}) => {
    const {thumbnail,views,title} = channelVideos;
  return (
    <div className="bg-gray-500 h-28 border-y-[1px] items-center flex rounded-lg">
      <div className="bg-gray-400 h-24 w-full flex items-center px-2">
        <input className="mx-2" type="checkbox" />
        <div className="flex bg-lime-300 w-[700px]">
          <div className="mr-4">
            <img
              className="h-20 w-32 rounded-lg"
              src={thumbnail}
              alt="thumbnail"
            />
          </div>
          <div className="text-lg font-semibold">
            {title}
          </div>
        </div>
        <div className="mx-3 flex items-center justify-center w-20">
            {views} views
        </div>
        
        <div className ="flex items-center justify-center ">
            <input className="" type="checkbox" />
        </div>
      </div>
    </div>
  );
};

export default StudioVideoCard;
