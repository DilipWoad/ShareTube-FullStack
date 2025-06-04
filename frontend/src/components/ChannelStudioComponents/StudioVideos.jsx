import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constant";
import StudioVideoCard from "./StudioVideoCard";

const StudioVideos = () => {
  const [channelVideos, setChannelVideos] = useState(null);

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
    <div className="bg-orange-400 h-screen mx-2 overflow-y-scroll">
      {channelVideos.map((video) => (
        <StudioVideoCard channelVideos={video} />
      ))}
    </div>
  );
};
export default StudioVideos;
