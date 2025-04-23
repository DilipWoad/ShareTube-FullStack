import axios from "axios";
import { useLocation } from "react-router";
import { BASE_URL } from "../utils/constant";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ChannelPage =()=>{
    const menuClick = useSelector((store)=>store.video.isMenuClicked);
    const [channelDetails,setChannelDetails] = useState(null);
    const channelUsername = useLocation();
   const na =  channelUsername.pathname.replace("/channel/@","");

   const userChannelDetails =async()=>{
    try {
        const res =  await axios.get(`${BASE_URL}/user/channel/${na.trim()}`,{withCredentials:true})
        console.log(res.data);
        setChannelDetails(res.data.data);
    } catch (error) {
        console.log(error);
    }
   }
   useEffect(()=>{
    userChannelDetails()
   },[])
   if(!channelDetails) return <div>Loading...</div>
    return(
        <div className={`text-purple-400 w-full ml-[98px] ${menuClick?"mr-8 ml-14":"mr-[120px]"} space-y-2 mt-2`}>
            {/* Welcome to Channel Page {na} */}
            <div className="bg-purple-400 rounded-xl overflow-hidden">
                <img className="w-full h-44 object-fill" src={channelDetails?.coverImage}/>
            </div>
            <div className="bg-lime-300 h-48">
                <p>xQc</p>
            </div>
        </div>
    )
}

export default ChannelPage;