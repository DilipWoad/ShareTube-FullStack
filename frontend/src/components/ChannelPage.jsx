import axios from "axios";
import { useLocation } from "react-router";
import { BASE_URL } from "../utils/constant";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ChannelPage = () => {
  const menuClick = useSelector((store) => store.video.isMenuClicked);
  const userId = useSelector((store)=>store.user._id)
  const [channelDetails, setChannelDetails] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const channelUsername = useLocation();
  const na = channelUsername.pathname.replace("/channel/@", "");
  const middleDot = "\u0387";


  const handleSubscription = async () => {
    if(channelDetails?._id===userId){
    alert("You can't Subscribe to your channel!!")
      return;
    }else{
      try {
        const res = await axios.post(
          `${BASE_URL}/subscription/c/${channelDetails._id}`,
          {},
          { withCredentials: true }
        );
        console.log(res.data.message)
        //toggle the subscribed state
        setIsSubscribed(!isSubscribed);
      } catch (error) {
        console.log(error);
      } 
    }  
  };


  const userChannelDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/channel/${na.trim()}`, {
        withCredentials: true,
      });
      console.log(res.data);
      setChannelDetails(res.data.data);
      setIsSubscribed(res.data.data.isCurrentUserSubscribed);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    userChannelDetails();
  }, []);
  if (!channelDetails) return <div>Loading...</div>;
  return (
    <div
      className={`text-purple-400 w-full ml-[98px] ${
        menuClick ? "mr-8 ml-14" : "mr-[120px]"
      } space-y-5 my-2`}
    >
      {/* Welcome to Channel Page {na} */}
      <div className="bg-purple-400 rounded-xl overflow-hidden">
        <img
          className="w-full h-44 object-fill"
          src={channelDetails?.coverImage}
        />
      </div>
      <div className="bg-lime-300 h-44">
        <div className="flex bg-yellow-300 text-black h-full">
          <img
            className="bg-red-400 w-44 object-cover rounded-full mr-3"
            src={channelDetails?.avatar}
            alt="avatar"
          />
          <div className="bg-sky-400">
            <p className="text-4xl font-bold">{channelDetails?.fullName}</p>
            <div className="bg-green-500 flex my-3 space-x-1 text-[15px]">
              <p className="font-semibold text-black">{`@${channelDetails?.username} ${middleDot}`}</p>
              <p className="text-gray-800">
                {channelDetails?.subscriberCount} Subscribers
              </p>
            </div>
            <button
                onClick={handleSubscription}
              className={`bg-white px-4 py-2 rounded-3xl mt-7 ${
                isSubscribed
                  ? "bg-gray-400 text-white hover:bg-gray-500"
                  : "hover:bg-gray-300"
              } `}
            >{`${isSubscribed ? "Subscribed" : "Subscribe"}`}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
