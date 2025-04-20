import axios from "axios";
import { useSearchParams } from "react-router";
import { BASE_URL, LIKE_ICON } from "../../utils/constant";
import { useEffect, useState } from "react";
import VideoDescription from "./VideoDescription";
import VideoComment from "../CommentComponents/VideoComment";
import { useSelector } from "react-redux";
const SingleVideo = () => {
  //now i am this page
  //that means u have video id on the url
  //get the query value from url
  const userId = useSelector((store)=>store.user?._id);
  console.log(userId);
  const [searchParams, setSearchParams] = useSearchParams();
  const videoId = searchParams.get("v");

  const [videoDetail, setVideoDetail] = useState(null);

  const [isSubscribed, setIsSubscribed] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const [isLiked, setIsLiked] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  console.log("Subscription state :",isSubscribed)
  console.log("Subscription Count state :",subscriberCount)

  console.log("Liked state :",isLiked)
  console.log("Liked Count state :",likeCount)

  const getAVideo = async () => {
    console.log(videoId);
    const res = await axios.get(BASE_URL + `/video/v/${videoId}`, {
      withCredentials: true,
    });
    const video = res.data.data;
    console.log(video);
    setVideoDetail(video);
    setLikeCount(video?.likesDetails ? video?.likesDetails?.videoLikes : 0);
    setSubscriberCount(video?.channelDetails?.subscribers);
  };

  const isUserSubscribed = async () => {
    try {
      const res = await axios.get(BASE_URL + `/subscription/${videoId}`, {
        withCredentials: true,
      });
      console.log(res.data.message);
      console.log("Subscription",res.data.data);
      setIsSubscribed(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubscription = async () => {
    if(videoDetail?.channelDetails?._id===userId){
    alert("You can't Subscribe to your channel!!")
      return;
    }else{
      try {
        const res = await axios.post(
          BASE_URL + `/subscription/c/${videoDetail.channelDetails._id}`,
          {},
          { withCredentials: true }
        );
        console.log(res.data.message)
        //toggle the subscribed state
        setIsSubscribed(!isSubscribed);
      } catch (error) {
        console.log(error);
      } finally {
        if (!isSubscribed) {
          setSubscriberCount(subscriberCount + 1);
        } else {
          setSubscriberCount(subscriberCount - 1);
        }
      }
    }  
  };

  const isUserLikedTheVideo = async () => {
    try {
      const res = await axios.get(BASE_URL + `/like/v/${videoId}`, {
        withCredentials: true,
      });
      //create a function which will check is current user(current logged in user has liked the current opened video)
      console.log(res.data.message);
      console.log("Liked",res.data.data);
      setIsLiked(res.data.data);
    } catch (error) {
      console.log(error)
    }
  };
  const handleLikes = async () => {
    try {
      const res = await axios.post(
        BASE_URL + `/like/v/${videoId}`,
        {},
        { withCredentials: true }
      );
      setIsLiked(!isLiked);
      console.log(res.data.message);
      if (isLiked) {
        setLikeCount(likeCount - 1);
      } else {
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }
  };

  useEffect(() => {
    isUserSubscribed();
    isUserLikedTheVideo();
    !videoDetail && getAVideo();
  }, [videoId]);

  //And get the video
  //first of dont think of the video place as of now
  //ensure that video is coming and it is in the video div position
  if (!videoDetail) return <div>Loading....</div>;
  return (
    <div className="mx-20  w-fit pb-1">
      <div className="mt-5 mb-3">
        <iframe
          className="rounded-lg overflow-hidden max-w-[850px]"
          src={videoDetail?.videoFile}
          width="850"
          height="460"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="text-xl px-1 font-bold">{videoDetail?.title}</div>
      <div className="flex justify-between px-1 py-2 items-center">
        <div className="flex space-x-7 items-center ">
          <div className=" flex space-x-3 items-center">
            <div className=" hover:cursor-pointer">
              <img
                className="w-10 h-10 rounded-full"
                src={videoDetail?.channelDetails?.avatar}
                alt="channel-image"
              />
            </div>
            <div className=" px-2">
              <p className="font-semibold">
                {videoDetail?.channelDetails?.fullName}{" "}
              </p>
              <p className="text-sm font-light">
                {subscriberCount} subscribers
              </p>
            </div>
          </div>
          <div
            className={`px-4 py-1 rounded-l-full rounded-r-full ${
              isSubscribed ? "bg-gray-300" : "bg-white text-gray-600"
            }`}
          >
            <button onClick={handleSubscription}>
              {isSubscribed ? "🔔 Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>
        <div className="bg-slate-300 mr-4 rounded-l-full rounded-r-full hover:bg-slate-200">
          <button
            onClick={handleLikes}
            className="flex items-center gap-x-2 px-2 py-1 min-w-16 justify-between"
          >
            <img
              className={`w-5 h-5 ${
                isLiked ? "bg-white " : ""
              } overflow-hidden`}
              src={LIKE_ICON}
              alt="like-icon"
            />
            {videoDetail?.likesDetails ? likeCount : likeCount}
          </button>
        </div>
      </div>
      <VideoDescription videoDetail={videoDetail} />
      <VideoComment videoId={videoId} />
    </div>
  );
};

export default SingleVideo;
