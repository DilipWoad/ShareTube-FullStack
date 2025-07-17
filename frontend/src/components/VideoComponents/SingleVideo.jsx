import axios from "axios";
import { useSearchParams } from "react-router";
import { BASE_URL, LIKE_ICON } from "../../utils/constant";
import { useEffect, useState } from "react";
import VideoDescription from "./VideoDescription";
import VideoComment from "../CommentComponents/VideoComment";
import { useSelector } from "react-redux";
import LikeSvgIcon from "../../utils/SVGIcons/LikeSvgIcon";
import ConfirmationBox from "../../utils/ConfirmationBox";
const SingleVideo = () => {
  //now i am this page
  //that means u have video id on the url
  //get the query value from url
  const userId = useSelector((store) => store.user?._id);
  console.log(userId);
  const [searchParams, setSearchParams] = useSearchParams();
  const videoId = searchParams.get("v");

  const [videoDetail, setVideoDetail] = useState(null);

  const [isSubscribed, setIsSubscribed] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const [isLiked, setIsLiked] = useState(null);
  const [likeCount, setLikeCount] = useState(0);

  
  const [showBox, setShowBox] = useState(false);

  console.log("Subscription state :", isSubscribed);
  console.log("Subscription Count state :", subscriberCount);

  console.log("Liked state :", isLiked);
  console.log("Liked Count state :", likeCount);

  const getAVideo = async () => {
    console.log(videoId);
    const res = await axios.get(BASE_URL + `/video/v/${videoId}`, {
      withCredentials: true,
    });
    const video = res.data.data;
    console.log(video);
    setVideoDetail(video);
    setIsLiked(video.isLikedByCurrentUser);
    setLikeCount(video.likesDetails.videoLikes);
    setSubscriberCount(video?.channelDetails?.subscribers);
    setIsSubscribed(video.isSubscribedByCurrentUser);
  };

  // const isUserSubscribed = async () => {
  //   try {
  //     const res = await axios.get(BASE_URL + `/subscription/${videoId}`, {
  //       withCredentials: true,
  //     });
  //     console.log(res.data.message);
  //     console.log("Subscription", res.data.data);
  //     setIsSubscribed(res.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handleSubscription = async () => {
    if (videoDetail?.channelDetails?._id === userId) {
      alert("You can't Subscribe to your channel!!");
      return;
    } else {
      const toggleSubs = !isSubscribed;
      setIsSubscribed(toggleSubs);
      setSubscriberCount((prevSubCount) =>
        toggleSubs ? prevSubCount + 1 : prevSubCount - 1
      );
      try {
        const res = await axios.post(
          `${BASE_URL}/subscription/c/${videoDetail.channelDetails._id}`,
          {},
          { withCredentials: true }
        );
        console.log(res.data.message);
        //toggle the subscribed state
      } catch (error) {
        console.log(error);
        //if error rollbck to prevs states
        setIsSubscribed((prev) => !prev);
        setSubscriberCount((prevSubCount) =>
          toggleSubs ? prevSubCount - 1 : prevSubCount + 1
        );
      }
    }
  };

  // const isUserLikedTheVideo = async () => {
  //   try {
  //     const res = await axios.get(BASE_URL + `/like/v/${videoId}`, {
  //       withCredentials: true,
  //     });
  //     //create a function which will check is current user(current logged in user has liked the current opened video)
  //     console.log(res.data.message);
  //     console.log("Liked", res.data.data);
  //     setIsLiked(res.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handleLikes = async () => {
    const toggleLike = !isLiked;
    setIsLiked(toggleLike);
    setLikeCount((prevCount) => (toggleLike ? prevCount + 1 : prevCount - 1));
    try {
      const res = await axios.post(
        BASE_URL + `/like/v/${videoId}`,
        {},
        { withCredentials: true }
      );
      console.log(res.data.message);
    } catch (error) {
      console.log(error);
      //if error hppen rollbck to prevs stte
      setIsLiked((prev) => !prev);
      setLikeCount((prevCount) => (toggleLike ? prevCount - 1 : prevCount + 1));
    }
  };

  useEffect(() => {
    // isUserSubscribed();
    // isUserLikedTheVideo();
    !videoDetail && getAVideo();
  }, [videoId]);

  //And get the video
  //first of dont think of the video place as of now
  //ensure that video is coming and it is in the video div position
  if (!videoDetail) return <div>Loading....</div>;
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:px-6 lg:px-8">
      {/* video plyer */}
      <div className="mb-4 sm:mb-6">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={"https" + videoDetail?.videoFile.substring(4)}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* video title */}
      <div className="text-xl px-1 font-bold">{videoDetail?.title}</div>

      {/* video-chnnel pic,nme,subscriber n sub-like button */}
      {/* flex justify-between px-1 py-2 items-center */}
      <div className="">
        <div className="flex  sm:items-center justify-between my-2 ">
          <div className="flex sm:my-3 sm:text-lg">
            {/* avatar */}
            <div className=" hover:cursor-pointer">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={videoDetail?.channelDetails?.avatar}
                alt="channel-image"
              />
            </div>

            {/* fullName-subscriberCount */}
            <div className=" px-2">
              <p className="font-bold text-lg">
                {videoDetail?.channelDetails?.fullName}
              </p>
              <p className="text-sm font-normal">
                {subscriberCount} subscribers
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-end">
            {/* hndle Subscribiton */}
            <div
              className={`px-4 py-1 rounded-l-full rounded-r-full ${
                isSubscribed ? "bg-gray-300" : "bg-white text-gray-600"
              }`}
            >
              <button onClick={handleSubscription}>
                {isSubscribed ? "🔔 Subscribed" : "Subscribe"}
              </button>
            </div>

            {/* hndle likes */}
            <div className="bg-slate-300 sm:mr-4  rounded-l-full rounded-r-full hover:bg-slate-200">
              <button
                onClick={handleLikes}
                className="flex items-center gap-x-2 px-2 py-1 min-w-16 justify-between "
              >
                {/* <img
                  className={`w-5 h-5 ${
                    isLiked ? "bg-white " : ""
                  } overflow-hidden`}
                  src={LIKE_ICON}
                  alt="like-icon"
                /> */}
                <LikeSvgIcon liked={isLiked} />
                {videoDetail?.likesDetails ? likeCount : likeCount}
              </button>
            </div>
          </div>
        </div>
      </div>
      <VideoDescription videoDetail={videoDetail} />
      <VideoComment videoId={videoId} />
      {showBox && (
          <ConfirmationBox
            toggle={true}
            setShowBox={setShowBox}
            setToggle={setIsSubscribed}
            id={_id}
            subscription={true}
          />
        )}
    </div>
  );
};

export default SingleVideo;
