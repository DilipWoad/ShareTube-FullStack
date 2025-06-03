import axios from "axios";
import UploadVideo from "../VideoComponents/UploadVideo";
import StudioVideoCard from "./StudioVideoCard";
import { BASE_URL } from "../../utils/constant";
import { useEffect, useState } from "react";
import {useSelector} from "react-redux";

const ChannelStudio = () => {
    const[dashboard,setDashboard] =useState(null);
    const[channelVideos,setChannelVideos] =useState(null);
    const user = useSelector((store)=>store.user);
  const getChannelStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/dashboard`, { withCredentials: true });
      setDashboard(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getChannelVideo=async()=>{
    try {
        const res= await axios.get(`${BASE_URL}/dashboard/videos`,{withCredentials:true})
        console.log(res.data.data);
        setChannelVideos(res.data.data);
    } catch (error) {
        console.log(error)
    }
  }
  useEffect(()=>{
    getChannelStats();
    getChannelVideo();
  },[])
  if(!dashboard) return <div>Loading....</div>
  return (
    <div className="flex w-screen h-screen m-2">
      <div className="bg-yellow-300 w-52 text-center mr-4">
        <div className="bg-lime-200 flex justify-center h-44 mb-4">
          <img
            className="w-44 h-44 rounded-full object-cover"
            src={user?.avatar}
            alt="avatar"
          />
        </div>
        <div className="bg-green-600 text-lg">
          <div className="p-2 bg-gray-400 border-[1px] hover:cursor-pointer hover:bg-gray-500 hover:text-white">
            Dashboard
          </div>
          <div className="p-2 bg-gray-400 border-[1px] hover:cursor-pointer hover:bg-gray-500 hover:text-white">
            Edit profile
          </div>
          <div className="p-2 bg-gray-400 border-[1px] hover:cursor-pointer hover:bg-gray-500 hover:text-white text">
            Videos
          </div>
          <div className="p-2 bg-gray-400 border-[1px] hover:cursor-pointer hover:bg-gray-500 hover:text-white">
            Posts
          </div>
        </div>
      </div>
      <div className="bg-blue-300 flex-grow">
        <div className="bg-red-500 h-44 mb-4">
          <img
            className="h-44 rounded-xl w-full object-fill"
            src={user?.coverImage}
          />
        </div>
        <div className="bg-orange-400 h-screen mx-2">
          {
            channelVideos && channelVideos.map((video)=>(
                <StudioVideoCard channelVideos={video} />
            ))
          }
        </div>
      </div>
      {/* <UploadVideo uploadBgCss={"bg-black bg-opacity-20"}/> */}
    </div>
  );
};

export default ChannelStudio;
