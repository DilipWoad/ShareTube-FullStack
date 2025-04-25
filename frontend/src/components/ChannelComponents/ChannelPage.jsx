import axios from "axios";
import { Link, Outlet, useLocation } from "react-router";
import { BASE_URL } from "../../utils/constant";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoCard from "../VideoComponents/VideoCard";
import ChannelVideos from "./ChannelVideos";
import ChannelPosts from "./ChannelPosts";

const ChannelPage = () => {
  const menuClick = useSelector((store) => store.video.isMenuClicked);
  const userId = useSelector((store) => store.user._id);
  const [channelDetails, setChannelDetails] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [channelVideos, setChannelVideos] = useState(null);
  const [videoClicked,setVideoClicked] = useState(false);
  const [channelPosts,setChannelPosts] = useState(null);
  const [postClicked,setPostClicked] = useState(false);

  const channelUsername = useLocation();
  const username = channelUsername.pathname.replace("/channel/@", "");
  const middleDot = "\u0387";

  const handleSubscription = async () => {
    if (channelDetails?._id === userId) {
      alert("You can't Subscribe to your channel!!");
      return;
    } else {
      try {
        const res = await axios.post(
          `${BASE_URL}/subscription/c/${channelDetails._id}`,
          {},
          { withCredentials: true }
        );
        console.log(res.data.message);
        //toggle the subscribed state
        setIsSubscribed(!isSubscribed);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChannelVideos = async () => {
    try {
      //setting other clicks as false
      setPostClicked(false)

      //data fetch
      const res = await axios.get(
        `${BASE_URL}/video/channel/${channelDetails?._id}`,
        { withCredentials: true }
      );
      setChannelVideos(res.data.data);

      //video Clicked
      setVideoClicked(true)
    } catch (error) {
      console.log(error);
    }
  };

  const handleChannelPosts = async () => {
    try {
      //setting other clicks as false
      setVideoClicked(false)
      
      //data fetch
      const res = await axios.get(`${BASE_URL}/post/user/${channelDetails?._id}`, {
        withCredentials: true,
      });
      const post = res.data.data;
      console.log(res.data.data);

      setChannelPosts(post.reverse());
      
      // post Clicked
      setPostClicked(true)
    } catch (error) {
      console.log(error);
    }
  };

  const userChannelDetails = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/channel/${username.trim()}`,
        {
          withCredentials: true,
        }
      );
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
      className={` w-full ml-[98px] ${
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
              className={`px-4 py-2 rounded-3xl mt-7 ${
                isSubscribed
                  ? "bg-gray-500 text-white hover:bg-gray-400"
                  : "hover:bg-gray-300 bg-white"
              } `}
            >{`${isSubscribed ? "Subscribed" : "Subscribe"}`}</button>
          </div>
        </div>
      </div>

      {/* Video/post/Playlist section */}

      <div className="bg-orange-800">
        <div className=" text-white border-b-[1px] border-gray-500">
          <button
            onClick={handleChannelVideos}
            className="mx-2 mt-1 h-8 py-1 px-2 hover:border-b-2 hover:border-gray-200"
          >
            Videos
          </button>
          <button
            onClick={handleChannelPosts}
            className="mx-2 mt-1 h-8 py-1 px-2 hover:border-b-2 hover:border-gray-200"
          >
            Posts
          </button>
          <button className="mx-2 mt-1 h-8 py-1 px-2 hover:border-b-2 hover:border-gray-200">
            Playlists
          </button>
        </div>

        { (
          <div className="flex flex-wrap bg-teal-400">
            {/* VideoCards/PostCards/PlaylistCard */}
            {videoClicked && <ChannelVideos
              channelVideos={channelVideos}
              menuClick={menuClick}
            />}
            
            {postClicked && <ChannelPosts channelPosts={channelPosts}/>}
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default ChannelPage;
