import PlaylistCard from "../PlaylistComponents/PlaylistCard";
import VideoCard from "../VideoComponents/VideoCard";

const LibraryCardComponent = ({ library, label }) => {
  if (!library) return <div>Loading...</div>;
  return (
    <div className="bg-green-300 my-5 p-2">
      <p className="text-xl font-bold">{label}</p>
      <div className="bg-pink-300 flex overflow-x-auto p-2">
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
      </div>
    </div>
  );
};

export default LibraryCardComponent;
