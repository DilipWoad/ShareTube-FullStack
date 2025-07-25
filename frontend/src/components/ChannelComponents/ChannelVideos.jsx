import { useOutletContext } from "react-router";
import VideoCard from "../VideoComponents/VideoCard";
import axiosInstance from "../../api/axiosInstance.js";
import { useEffect, useState } from "react";
const ChannelVideos = () => {
  const { channelId, menuClick, channelVideos, setChannelVideos } =
    useOutletContext();

  const handleChannelVideos = async () => {
    try {
      //setting other clicks as false
      //data fetch
      const res = await axiosInstance.get(`/video/channel/${channelId}`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setChannelVideos(res.data.data);
      //video Clicked
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    !channelVideos && handleChannelVideos();
  }, []);
  if (!channelVideos) return <div>This Channel has No Videos!!</div>;
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap py-1 sm:justify-start justify-center gap-2 sm:gap-1">
      {channelVideos.map((video) => (
        <VideoCard
          key={video._id}
          video={video}
          menuClicked={menuClick}
          css="w-full sm:w-[235px] bg-slate-400 mb-2 sm:pb-2 p-1 sm:p-0 sm:rounded-lg rounded-md flex sm:block"
          thumbnailcss="w-[230px] h-24 sm:w-full sm:h-32 object-cover rounded-l-md sm:rounded-none"
          isChannelVideos={true}
        />
      ))}
    </div>
  );
};

export default ChannelVideos;
