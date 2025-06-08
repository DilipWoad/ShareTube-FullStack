import PlaylistCard from "../PlaylistComponents/PlaylistCard";
import VideoCard from "../VideoComponents/VideoCard";

const LibraryCardComponent = ({ library, label }) => {
  if (!library) return <div>Loading...</div>;
  return (
    <div className="bg-gray-500 rounded-xl mx-2 my-5 p-2">
      <p className="text-xl font-bold">{label}</p>
      <div className=" flex overflow-x-auto p-2">
        {library.length !== 0 ? (
          <div className="flex space-x-4 min-w-max ">
            {label !== "Playlists"
              ? library.map((video) => (
                  <VideoCard
                    key={video?._id}
                    video={video}
                    css={"w-[224px] h-52 text-md"}
                    thumbnailcss={"h-32"}
                  />
                ))
              : library.map((playlist) => (
                  <PlaylistCard
                    key={playlist?._id}
                    playlist={playlist}
                    css={"w-[224px] h-52 text-md"}
                    thumbnailcss={"h-32"}
                  />
                ))}
          </div>
        ) : (
          <h1>No {label}.</h1>
        )}
      </div>
    </div>
  );
};

export default LibraryCardComponent;
