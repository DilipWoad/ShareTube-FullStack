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
        className={`bg-gray-600 w-96 h-fit rounded-lg overflow-hidden sm:ml-4 ${
          menuClicked && !isChannelVideos ? "sm:w-[350px] w-auto " : ""
        } shadow-lg hover:shadow-gray-300 ${css} ${
          isChannelVideos && menuClicked ? "sm:w-[225px] " : ""
        }`}
      >
        <Link to={{ pathname: "/watch", search: `?v=${_id}` }}>
          <img className={`w-full max-h-48 ${thumbnailcss} object-cover`} src={thumbnail} loading="lazy" />
        </Link>
        <div className="flex  justify-between w-full ">
          {!isChannelVideos ? (
            <Link to={`/channel/@${videoOwner?.username}`} className="m-2">
              <img
                className="w-10 h-10 rounded-full object-cover"
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
              className={`mt-2  ${
                menuClicked && !isChannelVideos ? "sm:w-[260px]" : ""
              } ${isChannelVideos && menuClicked ? "sm:w-[200px]" : ""} ${
                isChannelVideos ? "w-52 px-2" : "w-72"
              }`}
            >
              <p className="text-md font-semibold text-wrap w-64 ">{title}</p>
              <p className="text-sm mt-2">{videoOwner?.fullName}</p>
              <p className="text-sm">{views} views</p>
            </div>
          </Link>

          <div ref={menuRef} className="relative ">
            <button
              onClick={() => setOptions(!options)}
              className={`text-xl w-7 h-7   ${
                isChannelVideos ? "ml-0" : ""
              }   hover:bg-gray-100 font-semibold rounded-full m-1`}
            >
              ⫶
            </button>
            {options && (
              <div className="absolute top-5 right-8 bg-gray-800 text-white rounded-lg  p-2 z-10">
                <button
                  className="w-36"
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
