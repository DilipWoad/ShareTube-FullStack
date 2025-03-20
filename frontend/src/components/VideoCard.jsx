import { Link } from "react-router";

const VideoCard = ({video,menuClicked,css,thumbnailcss}) => {
    const {_id,thumbnail,videoOwner,title,views} = video;
  return (
    <>
      <Link to={{ pathname: "/watch", search: `?v=${_id}` }}>
        <div className={`bg-purple-400 w-96 rounded-lg overflow-hidden m-4 ${menuClicked?"w-[330px]":""} shadow-lg hover:shadow-gray-300 ${css}`}>
          <div className="">
            <img className={`w-full max-h-48 ${thumbnailcss}`} src={thumbnail} />
          </div>
          <div className="flex">
            <div className="m-2">
              <img
                className="w-10 h-10 rounded-full"
                src={videoOwner?.avatar}
                alt="avatar"
              />
            </div>
            <div className="mt-2">
              <p className="text-md font-semibold text-wrap">{title}</p>
              <p className="text-sm mt-2">{videoOwner?.fullName}</p>
              <div>
                <p className="text-sm">{views} views</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default VideoCard;
