import { useOutletContext } from "react-router";
import VideoCard from "../VideoComponents/VideoCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constant";

const ChannelVideos = () => {
  const { channelId, menuClick } = useOutletContext();
  const [channelVideos, setChannelVideos] = useState(null);

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
    handleChannelVideos();
  }, []);
  if (!channelVideos) return <div>This Channel has No Videos!!</div>;
  return (
    <>
      {channelVideos.map((video) => (
        <VideoCard
          key={video._id}
          video={video}
          menuClicked={menuClick}
          css={"w-[235px]"}
          thumbnailcss={"h-32"}
          isChannelVideos={true}
        />
      ))}
    </>
  );
};

export default ChannelVideos;
