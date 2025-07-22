import { useDispatch, useSelector } from "react-redux";
import { useGetAllVideos } from "../../hooks/useGetAllVideos";
import VideoCard from "./VideoCard";
import { useEffect } from "react";
import { removeComment } from "../../slices/commentSlice";
import { BASE_URL } from "../../utils/constant";
import axios from "axios";
import { addUserPlaylist } from "../../slices/librarySlice";
import { removePost } from "../../slices/postSlice";
import ToastCard from "../../utils/ToastCard.jsx"
import LoadingScreen from "../../utils/LoadingScreen.jsx";

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
      console.log("yhhh hi prblem : ->",res.data.data);
      dispatch(addUserPlaylist(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };
  useGetAllVideos(videos);
  useEffect(() => {
    !playlistStore && getPlaylist();
    videoComment && dispatch(removeComment());
    postStore && dispatch(removePost());
  }, [dispatch]);

  if (!videos) return <LoadingScreen/>;
  return (
    <div className="relative w-full px-1 mt-2 sm:mt-2 sm:py-2 sm:w-fit space-y-4 sm:space-y-0 flex flex-col sm:flex-row sm:flex-wrap ">
        {videos &&
          videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              menuClicked={videoStore?.isMenuClicked}
              isChannelVideos={false}
              css={"mb-4 mx-0"}
              thumbnailcss={"h-44 w-full"}
            />
          ))}
          {/* <ToastCard/> */}
      </div>
  );
};

export default VideoFeed;
