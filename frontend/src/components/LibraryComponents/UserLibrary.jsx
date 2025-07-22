import { useDispatch, useSelector } from "react-redux";
import LibraryCardComponent from "./LibraryCardComponent";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { useEffect } from "react";
import { addUserHistory, addUserLikedVideos } from "../../slices/librarySlice";
import LoadingScreen from "../../utils/LoadingScreen";

const UserLibrary = () => {
  const user = useSelector((store) => store.user);
  const library = useSelector((store) => store.library);

  const dispatch = useDispatch();

  const history = library.history;
  const like = library.likeVideos;
  const playlist = library.playlist;
  console.log("plffvbgvbmb",playlist);

  const getHistory = async () => {
    try {
      const res = await axios.get(BASE_URL + `/user/history`, {
        withCredentials: true,
      });
      console.log(res.data.data.watchHistory);
      const userHistoryVideos = await res.data.data.watchHistory;
      dispatch(addUserHistory(userHistoryVideos));
    } catch (error) {
      console.log(error);
    }
  };

  const likeVideos = async () => {
    try {
      let likeArray = [];
      const res = await axios.get(BASE_URL + `/like/videos`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      const userLike = await res.data.data;
      console.log(userLike);
      for (let i = 0; i < userLike.length; i++) {
        likeArray.push(userLike[i].videoDetail);
      }
      dispatch(addUserLikedVideos(likeArray));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHistory();
    likeVideos();
  }, [dispatch]);
  if (!history) return <LoadingScreen/>;
  return (
    <div className="w-full bg-gray-700 justify-center  sm:m-2">
      <div className=" flex sm:flex-row sm:p-2 py-2 flex-col items-center gap-2 ">
        {/* avatar */}
        <img
          className="w-28 h-28 rounded-full object-cover"
          src={user?.avatar}
          alt="user-avatar"
        />
        {/* fullName+username */}
        <div className="text-center sm:text-start">
          <p className="sm:text-4xl text-3xl font-bold">{user?.fullName}</p>
          <p className="text-lg sm:my-2">@{user?.username}</p>
        </div>
      </div>

      {/* //videos */}
      <div className=" h-screen ">
        <div>
          {history && (
            <LibraryCardComponent library={history} label={"History"} />
          )}
        </div>
        <div>
          {like && (
            <LibraryCardComponent library={like} label={"Like Videos"} />
          )}
        </div>
        <div>
          {playlist && (
            <LibraryCardComponent library={playlist} label={"Playlists"} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLibrary;
