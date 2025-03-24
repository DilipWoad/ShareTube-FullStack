import { useState } from "react";
import { Link, useLocation } from "react-router";

const VideoCard = ({
  video,
  menuClicked,
  css,
  thumbnailcss,
}) => {
  const { _id, thumbnail, videoOwner, title, views } = video;
  const location = useLocation();
  const isPlaylist = location.pathname === "/playlist";
  const [options, setOptions] = useState(false);
  return (
    <>
      <div
        className={`bg-purple-400 w-96 rounded-lg overflow-hidden m-4 ${
          menuClicked ? "w-[330px]" : ""
        } shadow-lg hover:shadow-gray-300 ${css}`}
      >
        <div className={`${isPlaylist ? "flex justify-between" : ""}`}>
          <Link
            to={{ pathname: "/watch", search: `?v=${_id}` }}
            className={`${isPlaylist ? "flex" : ""}`}
          >
            <img
              className={`w-full max-h-48 ${thumbnailcss}`}
              src={thumbnail}
            />
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
                <p className="text-sm">{views} views</p>
              </div>
            </div>
          </Link>
          {isPlaylist && (
            <div className="bg-lime-400 my-4 flex items-center">
              <button onClick={() => setOptions(!options)} className="relative">
                dot
              </button>
              {options && (
                <div className="absolute right-12 w-20 bg-sky-300"> option</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoCard;
