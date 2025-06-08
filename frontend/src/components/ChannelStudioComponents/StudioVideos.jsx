import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constant";
import StudioVideoCard from "./StudioVideoCard";
import VideoAndPlaylistEditOption from "../PlaylistComponents/VideoAndPlaylistEditOption";
import { useOutletContext } from "react-router";

const StudioVideos = () => {
  const [channelVideos, setChannelVideos] = useState(null);
  const [selectedId, setSelectedId] = useState([]);
  const [videoEditOption, setVideoEditOption] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);

  const {setCancelFalse} = useOutletContext();

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
      setChannelVideos(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChannelVideo();
  }, []);
  if (!channelVideos) return <div>Loading....</div>;
  return (
    <>
      <div className="flex justify-between m-5">
        <div className="space-x-2">
          <button
            onClick={() => handleEditClick(selectedId[0])}
            disabled={selectedId.length !== 1}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
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
            className={`ml-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
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
          className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700"
        >
          Upload Video
        </button>
      </div>
      <div className="">
        <div className="flex justify-between flex-1 text-white text-lg font-medium">
          <div className="flex space-x-16 m-2">
            <div>Edit/Delete</div>
            <div>Video</div>
          </div>
          <div className="flex space-x-12 m-2">
            <div>Views</div>
            <div>Published</div>
          </div>
        </div>
        <div className="h-screen mx-2 overflow-y-scroll">
          {channelVideos.map((video) => (
            <StudioVideoCard
              channelVideos={video}
              key={video._id}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          ))}
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
      </div>
    </>
  );
};
export default StudioVideos;
