import { Link } from "react-router";

const VideoCard = ({video,menuClicked}) => {
    const {_id,thumbnail,videoOwner,title,description,views} = video;
  return (
    <>
      <Link to={{ pathname: "/watch", search: `?v=${_id}` }}>
        <div className={`bg-purple-400 w-96 rounded-lg overflow-hidden m-4 ${menuClicked?"w-[330px]":""}`}>
          <div className="">
            <img className="w-full h-48" src={thumbnail} />
          </div>
          <div className="flex">
            <div className="m-2">
              <img
                className="w-10 h-10 rounded-full"
                src={videoOwner.avatar}
                alt=""
              />
            </div>
            <div className="mt-2">
              <p>{title}</p>
              <p>{description}</p>
              <div>
                <p>{views} views</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default VideoCard;
