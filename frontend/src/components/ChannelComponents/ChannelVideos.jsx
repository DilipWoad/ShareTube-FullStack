import { useOutletContext } from "react-router";
import VideoCard from "../VideoComponents/VideoCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constant";

const ChannelVideos = () => {
  const { channelId, menuClick,channelVideos,setChannelVideos } = useOutletContext();

  const handleChannelVideos = async () => {
    try {
      //setting other clicks as false
      //data fetch
      const res = await axios.get(`${BASE_URL}/video/channel/${channelId}`, {
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
    <div className=" flex flex-wrap  py-1 sm:justify-start justify-center gap-2 sm:gap-1">
      {channelVideos.map((video) => (
        <VideoCard
          key={video._id}
          video={video}
          menuClicked={menuClick}
          css={"sm:w-[235px] bg-slate-400 sm:h-[215px] sm:mb-2 sm:pb-2 sm:pb-0 sm:block flex truncate sm:rounded-lg rounded-sm mx-1"}
          thumbnailcss={"sm:h-32 h-full w-full"}
          isChannelVideos={true}
        />
      ))}
    </div>
  );
};

export default ChannelVideos;
