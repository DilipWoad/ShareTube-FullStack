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
        className={`bg-purple-400 w-96 rounded-lg overflow-hidden m-4 ${
          menuClicked && !isChannelVideos ? "w-[350px]" : ""
        } shadow-lg hover:shadow-gray-300 ${css} ${
          isChannelVideos && menuClicked ? "w-[225px] mr-[19px]" : ""
        }`}
      >
        <Link to={{ pathname: "/watch", search: `?v=${_id}` }}>
          <img className={`w-full max-h-48 ${thumbnailcss}`} src={thumbnail} />
        </Link>
        <div className="flex bg-yellow-400">
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
            className={`flex`}
          >
            <div
              className={`mt-2 bg-lime-200 ${
                menuClicked && !isChannelVideos ? "w-[260px]" : ""
              } ${isChannelVideos && menuClicked ? "w-[200px]" : ""} ${
                isChannelVideos ? "w-52 px-2" : "w-72"
              }`}
            >
              <p className="text-md font-semibold text-wrap ">{title}</p>
              <p className="text-sm mt-2">{videoOwner?.fullName}</p>
              <p className="text-sm">{views} views</p>
            </div>
          </Link>
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOptions(!options)}
              className={`text-xl w-7 h-7  ${
                isChannelVideos ? "ml-0" : ""
              }   hover:bg-orange-700 font-semibold rounded-full m-1`}
            >
              ⫶
            </button>
            {options && (
              <div className="absolute bg-cyan-300 rounded-lg  right-1 p-1 z-10">
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
