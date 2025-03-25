import { useState } from "react";
import { Link } from "react-router";
import AllPlaylistOptions from "./AllPlaylistOptions";

const VideoCard = ({ video, menuClicked, css, thumbnailcss }) => {
  const { _id, thumbnail, videoOwner, title, views } = video;
  const [options, setOptions] = useState(false);
  const [playlistOption,setPlaylistOption] = useState(false);

  return (
    <>
      <div
        className={`bg-purple-400 w-96 rounded-lg overflow-hidden m-4 ${
          menuClicked ? "w-[330px]" : ""
        } shadow-lg hover:shadow-gray-300 ${css}`}
      >
        <img className={`w-full max-h-48 ${thumbnailcss}`} src={thumbnail} />
        <div className="flex bg-yellow-400">
          <Link
            to={{ pathname: "/watch", search: `?v=${_id}` }}
            className={`flex`}
          >
            <div className="m-2">
              <img
                className="w-10 h-10 rounded-full"
                src={videoOwner?.avatar}
                alt="avatar"
              />
            </div>
            <div className="mt-2 bg-lime-200 w-[300px]">
              <p className="text-md font-semibold text-wrap ">{title}</p>
              <p className="text-sm mt-2">{videoOwner?.fullName}</p>
              <p className="text-sm">{views} views</p>
            </div>
          </Link>
          <div className="relative">
            <button
              onClick={() => setOptions(!options)}
              className="text-xl w-8 h-8 hover:bg-orange-700 font-semibold rounded-full "
            >
              ⫶
            </button>
            {options && (
              <div className="absolute bg-cyan-300 w-32  right-1 p-1 z-10">
                <button onClick={()=>setPlaylistOption(!playlistOption)}>add to playlist</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {playlistOption && <AllPlaylistOptions setPlaylistOption={setPlaylistOption} videoId={_id}/>}
    </>
  );
};

export default VideoCard;
