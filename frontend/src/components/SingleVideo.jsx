import axios from "axios";
import { useSearchParams } from "react-router";
import { BASE_URL } from "../utils/constant";
import { useEffect, useState } from "react";
const SingleVideo = () => {
  //now i am this page
  //that means u have video id on the url
  //get the query value from url
  const [searchParams, setSearchParams] = useSearchParams();
  const [videoDetail, setVideoDetail] = useState(null);
  const videoId = searchParams.get("v");
  //in axios do a get call to /video/:videoId
  const getAVideo = async () => {
    //add the query value to the videoId place
    const res = await axios.get(BASE_URL + `/video/v/${videoId}`, {
      withCredentials: true,
    });
    console.log(res.data);
    setVideoDetail(res.data.data);
    //need to pipeline and get videoOwner Details then with 
    // user-> go to subscription schema get subscriber count ->with video id get likes
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
            <div className="bg-pink-300 hover:cursor-pointer">image</div>
            <div className="bg-sky-300">
              <p className="font-semibold">Channel Name </p>
              <p className="text-sm">Subsciber Count</p>
            </div>
          </div>
          <div className="bg-orange-300">
            <button>Subscribe</button>
          </div>
        </div>
        <div className="bg-slate-300">Like and DisLike button</div>
      </div>
      <div className="bg-yellow-300 rounded-lg p-2">
        <p className="font-semibold"> {videoDetail?.views} views</p>
        <p>{videoDetail?.description}</p>
      </div>
    </div>
  );
};

export default SingleVideo;
