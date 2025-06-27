import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { useEffect } from "react";
import { useState } from "react";
import UserSubscribedChannelCard from "./UserSubscribedChannelCard";
const UserSubscription = () => {
  const [userSubscription,setUserSubscription] = useState(null);
  const getUserSubscriptionVideos=async()=>{
    try {
      const res= await axios.get(`${BASE_URL}/subscription/my-subscription`,{withCredentials:true});
      console.log(res.data.data);
      setUserSubscription(res.data.data);
    } catch (error) {
      console.log(error)
    }
  }
  //by this chnnel id get chnnel video

  useEffect(()=>{
    !userSubscription&&getUserSubscriptionVideos();
  },[])
  if(!userSubscription) return <div>U dont hv ny subscription</div>
  return (
    <div className="w-full h-auto sm:w-fit sm:flex sm:flex-wrap">
        {
        userSubscription.map((channel)=> (<UserSubscribedChannelCard key={channel._id} channel={channel}/>))
        }
    </div>
  );
};

export default UserSubscription;
