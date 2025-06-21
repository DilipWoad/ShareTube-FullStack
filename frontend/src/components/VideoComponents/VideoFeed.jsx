import { useDispatch, useSelector } from "react-redux";
import { useGetAllVideos } from "../../hooks/useGetAllVideos";
import VideoCard from "./VideoCard";
import { useEffect } from "react";
import { removeComment } from "../../slices/commentSlice";
import { BASE_URL } from "../../utils/constant";
import axios from "axios";
import { addUserPlaylist } from "../../slices/librarySlice";
import { removePost } from "../../slices/postSlice";

const VideoFeed = () => {
  const videoStore = useSelector((store) => store.video);
  const userStore = useSelector((store) => store.user);
  const videoComment = useSelector((store) => store.comment);
  const playlistStore = useSelector((store) => store.library.playlist);
  const postStore = useSelector((store) => store.post);
  const userId = userStore?._id;
  const videos = videoStore?.feeds;
  const dispatch = useDispatch();

  console.log(playlistStore);

  const getPlaylist = async () => {
    try {
      const res = await axios.get(BASE_URL + `/playlist/user/${userId}`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      dispatch(addUserPlaylist(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };
  useGetAllVideos();
  useEffect(() => {
    getPlaylist();
    videoComment && dispatch(removeComment());
    postStore && dispatch(removePost());
  }, [playlistStore?.length, dispatch]);

  if (videos?.length === 0) return <div>Loading...</div>;
  return (
    <div className="flex">
      <div className="flex-col w-screen p-2 space-y-4 sm:space-y-0 flex sm:flex-row sm:flex-wrap sm:my-4 sm:gap-4  ">
        {videos &&
          videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              menuClicked={videoStore?.isMenuClicked}
              isChannelVideos={false}
            />
          ))}
      </div>
    </div>
  );
};

export default VideoFeed;
