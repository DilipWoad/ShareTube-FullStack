import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constant";
import StudioVideoCard from "./StudioVideoCard";
import VideoAndPlaylistEditOption from "../PlaylistComponents/VideoAndPlaylistEditOption";
import { useOutletContext } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addVideoInStudio } from "../../slices/studioSlice";

const StudioVideos = () => {
  const [selectedId, setSelectedId] = useState([]);
  const [videoEditOption, setVideoEditOption] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);

  const dispatch = useDispatch();
  const studioVideos = useSelector((store) => store.studio.videos);
  const { setCancelFalse } = useOutletContext();

  console.log(selectedId);

  const handleDelete = async (arr) => {
    try {
      // await axios.delete()
      const deleteArrayOfPromises = arr.map(
        async (videoId) =>
          await axios.delete(`${BASE_URL}/video/delete/${videoId}`, {
            withCredentials: true,
          })
      );
      //res give array of promises and it takes too much of time
      //this happens because this map func is fast it objective is over
      //but the request are waiting for each to finished so it lead to longer time
      //so we should do is promis.All to resolve all the pending promise in parallel
      const res = await Promise.all(deleteArrayOfPromises);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/video/v/${id}`, {
        withCredentials: true,
      });
      setVideoInfo(res.data.data);
    } catch (error) {
    } finally {
      setVideoEditOption(true);
    }
  };

  const getChannelVideo = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/dashboard/videos`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      dispatch(addVideoInStudio(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChannelVideo();
  }, []);
  if (!studioVideos) return <div>Loading....</div>;
  return (
    <>
      <div className="flex justify-between m-5 sticky top-0">
        <div className="space-x-2 ">
          <button
            onClick={() => handleEditClick(selectedId[0])}
            disabled={selectedId.length !== 1}
            className={`sm:px-5 sm:py-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 
              ${
                selectedId.length === 1
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } `}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(selectedId)}
            disabled={!selectedId.length > 0}
            className={`ml-2 sm:px-5 sm:py-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
              ${
                selectedId.length > 0
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-red-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Delete
          </button>
        </div>
        <button
          onClick={() => setCancelFalse()}
          className="bg-blue-600 text-white sm:px-5 sm:py-2 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-700"
        >
          Upload Video
        </button>
      </div>
      <div className=" px-1 sm:mx-2 overflow-y-scroll sm:h-[calc(100vh-60px)] sticky top-0">
        <div className=" ">
          <div className="flex justify-between flex-1 text-white sm:text-lg text-sm font-medium">
            <div className="flex gap-4 sm:space-x-16 m-2">
              <div className="">Edit/Delete</div>
              <div>Video</div>
            </div>
            <div className="flex sm:space-x-12 gap-4 m-2">
              <div>Views</div>
              <div>Status</div>
            </div>
          </div>
          <div className="">
            {studioVideos.map((video) => (
              <StudioVideoCard
                channelVideos={video}
                key={video._id}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            ))}
          </div>
        </div>
      </div>
      {videoEditOption && (
        <VideoAndPlaylistEditOption
          id={videoInfo?._id}
          thumbnail={videoInfo?.thumbnail}
          title={videoInfo?.title}
          description={videoInfo?.description}
          setEditOption={setVideoEditOption}
          isVideoEdit={true}
        />
      )}
    </>
  );
};
export default StudioVideos;
