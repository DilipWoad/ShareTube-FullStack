import { Link } from "react-router";

const PlaylistCard = ({ playlist, menuClicked, css, thumbnailcss }) => {
  const { _id, description, playlistVideos, title } = playlist;
  return (
    <>
      <Link to={{ pathname: "/playlist", search: `?list=${_id}` }}>
        <div
          className={`bg-purple-400 w-96 rounded-lg overflow-hidden m-4 ${
            menuClicked ? "w-[330px]" : ""
          } shadow-lg hover:shadow-gray-300 ${css}`}
        >
          <div className="">
            <img
              className={`w-full max-h-48 ${thumbnailcss}`}
              src={playlistVideos[0]?.thumbnail}
            />{" "}
            {/*get the first video thumbnail*/}
          </div>
          <div className="mt-1 px-2">
            <p className="text-md font-semibold text-wrap">{title}</p>
            <p className="text-[13px] font-semibold text-wrap">Channel Name</p>
            <p className="text-[12px] text-wrap hover:text-gray-300 hover:cursor-pointer">
              View full playlist
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default PlaylistCard;
