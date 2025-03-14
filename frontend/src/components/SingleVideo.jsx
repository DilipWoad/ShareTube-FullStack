import axios from "axios";
import { useSearchParams } from "react-router";
import { BASE_URL, LIKE_ICON } from "../utils/constant";
import { useEffect, useState } from "react";
const SingleVideo = () => {
  //now i am this page
  //that means u have video id on the url
  //get the query value from url
  const [searchParams, setSearchParams] = useSearchParams();
  const [videoDetail, setVideoDetail] = useState(null);
  const videoId = searchParams.get("v");
  const [isSubscribed, setIsSubscribed] = useState(null);
  //i guess use REDUX TOOLKIT
  
 
 //in axios do a get call to /video/:videoId
  const getAVideo = async () => {
    //add the query value to the videoId place
    const res = await axios.get(BASE_URL + `/video/v/${videoId}`, {
      withCredentials: true,
    });
    console.log(res.data.data);
    setVideoDetail(res.data.data);
    //need to pipeline and get videoOwner Details then with
    // user-> go to subscription schema get subscriber count ->with video id get likes
  };

  const handleLikes = async () => {
    const res = await axios.post(
      BASE_URL + `/like/v/${videoId}`,
      {},
      { withCredentials: true }
    );
    console.log(res.data);
  };

  const handleSubscription = async () => {
    const res = await axios.post(
      BASE_URL + `/subscription/c/${videoDetail.channelDetails[0]._id}`,
      {},
      { withCredentials: true }
    );
    // if(res.data.message.includes('Subscribe')){
    //   setIsSubscribed(true);
    // }else{
    //   setIsSubscribed(false);
    // }
    console.log(res.data)
  };

  const isUserSubscribed = async () => {
    await axios.get("/");
    //create a function which will check is current user(current logged in user is subscribed to the current opened video)
  };

  const isUserLikedTheVideo = async () => {
    await axios.get();
    //create a function which will check is current user(current logged in user has liked the current opened video)
  };

  useEffect(() => {
    !videoDetail && getAVideo();
  }, [videoId]);

  //And get the video
  //first of dont think of the video place as of now
  //ensure that video is coming and it is in the video div position
  if (!videoDetail) return <div>Loading....</div>;
  return (
    <div className=" mx-8 bg-purple-400 w-fit">
      <div className="mt-5 mb-3">
        <iframe
          className="rounded-lg overflow-hidden"
          src={videoDetail?.videoFile}
          width="850"
          height="460"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="text-xl font-bold">{videoDetail?.title}</div>
      <div className="flex justify-between py-2 items-center">
        <div className="flex bg-red-200 space-x-7 items-center ">
          <div className="bg-lime-300 flex space-x-3 items-center">
            <div className="bg-pink-300 hover:cursor-pointer">
              <img
                className="w-10 h-10 rounded-full"
                src={videoDetail.channelDetails[0].avatar}
                alt="channel-image"
              />
            </div>
            <div className="bg-sky-300 px-2">
              <p className="font-semibold">
                {videoDetail.channelDetails[0].fullName}{" "}
              </p>
              <p className="text-sm font-light">
                {videoDetail.channelDetails[0].subscribers} subscribers
              </p>
            </div>
          </div>
          <div className="bg-orange-300 px-4 py-1 rounded-l-full rounded-r-full">
            <button onClick={handleSubscription}>{isSubscribed ? "🔔 Subscribed" :"Subscribe" }</button>
          </div>
        </div>
        <div className="bg-slate-300 mr-4 rounded-l-full rounded-r-full">
          <button
            onClick={handleLikes}
            className="flex items-center gap-x-2 px-2 py-1"
          >
            <img className="w-5 h-5" src={LIKE_ICON} alt="like-icon" />{" "}
            {videoDetail.likesDetails[0]
              ? videoDetail.likesDetails[0].videoLikes
              : 0}
          </button>
        </div>
      </div>
      <div className="bg-yellow-300 rounded-lg p-2">
        <p className="font-semibold"> {videoDetail?.views} views</p>
        <p>{videoDetail?.description}</p>
      </div>
    </div>
  );
};

export default SingleVideo;
