import { useState } from "react";
import { Link } from "react-router";
import AllPlaylistOptions from "../PlaylistComponents/AllPlaylistOptions";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const VideoCard = ({
  video,
  menuClicked,
  css,
  thumbnailcss,
  isChannelVideos,
}) => {
  const { _id, thumbnail, videoOwner, title, views } = video;
  const [options, setOptions] = useState(false);
  const [playlistOption, setPlaylistOption] = useState(false);
  const menuRef = useOutsideClick(setOptions);
  return (
    <>
      <div
        className={` bg-gray-600 w-96 h-fit rounded-lg overflow-hidden sm:ml-4 ${
          menuClicked && !isChannelVideos ? "sm:w-[350px] " : ""
        } shadow-lg hover:shadow-gray-300 ${css} ${
          isChannelVideos && menuClicked ? "sm:w-[225px] " : ""
        }`}
      >
        <Link to={{ pathname: "/watch", search: `?v=${_id}` }}>
          <img className={`w-full max-h-48 ${thumbnailcss} object-cover`} src={thumbnail} loading="lazy" />
        </Link>
        <div className="flex  justify-between w-full items-start px-1 ">
          {!isChannelVideos ? (
            <Link to={`/channel/@${videoOwner?.username}`} className=" mt-2 ">
              <img
                className="w-10 h-10 rounded-full object-cover flex-2  "
                src={videoOwner?.avatar}
                alt="avatar"
              />
            </Link>
          ) : (
            ""
          )}

          <Link
            to={{ pathname: "/watch", search: `?v=${_id}` }}
            className={""}
          >
            <div
              className={`sm:mt-1 py-1 sm:pb-1 sm:py-0 px-1  flex-1  ${
                menuClicked && !isChannelVideos ? "sm:w-[260px]" : ""
              } ${isChannelVideos && menuClicked ? "sm:w-[200px]" : ""} ${
                isChannelVideos ? "w-52 " : "w-72"
              }`}
            >
              <p className="text-base font-semibold truncate">{title}</p>
              <p className="text-sm mt-2">{videoOwner?.fullName}</p>
              <p className="text-sm">{views} views</p>
            </div>
          </Link>

          <div ref={menuRef} className="relative  ">
            <button
              onClick={() => setOptions(!options)}
              className={`sm:text-xl text-lg sm:w-7 sm:h-7 w-6 h-6 flex justify-center items-center   ${
                isChannelVideos ? "ml-0" : ""
              }   hover:bg-gray-100 sm:font-semibold font-medium rounded-full  ml-1 `}
            >
              ⫶
            </button>
            {options && (
              <div className="absolute opacity-85 sm:top-8 sm:right-6 right-5 top-5 bg-gray-800 text-white rounded-lg px-2 py-1 z-10">
                <button
                  className={`text-nowrap text-sm font-light ${isChannelVideos ? "sm:w-auto" : ""}`} 
                  onClick={() => setPlaylistOption(!playlistOption)}
                >
                  ⛉ Add to playlist
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {playlistOption && (
        <AllPlaylistOptions
          setPlaylistOption={setPlaylistOption}
          videoId={_id}
        />
      )}
    </>
  );
};

export default VideoCard;
