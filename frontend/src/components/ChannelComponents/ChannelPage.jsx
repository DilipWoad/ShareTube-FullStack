import axios from "axios";
import { NavLink, Outlet, useParams } from "react-router";

import { BASE_URL } from "../../utils/constant";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addChannelInfo } from "../../slices/channelSlice";

const ChannelPage = () => {
  const dispatch = useDispatch();
  const menuClick = useSelector((store) => store.video.isMenuClicked);
  const userId = useSelector((store) => store.user._id);

  const [channelDetails, setChannelDetails] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(null);

  const middleDot = "\u0387";
  const channelId = channelDetails?._id;

  const { id } = useParams();
  const username = id.replace("@", "");

  const handleSubscription = async () => {
    if (channelDetails?._id === userId) {
      alert("You can't Subscribe to your channel!!");
      return;
    } else {
      try {
        const res = await axios.post(
          `${BASE_URL}/subscription/c/${channelId}`,
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
      dispatch(addChannelInfo(res.data.data));
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
      className={`p-2 rounded-xl bg-gray-600 w-full ml-[98px] ${
        menuClick ? "mr-8 ml-14" : "mr-[120px]"
      } space-y-5 my-2`}
    >
      {/* Welcome to Channel Page {na} */}
      <div className=" rounded-xl overflow-hidden">
        <img
          className="w-full h-44 object-fill"
          src={channelDetails?.coverImage}
        />
      </div>
      <div className=" h-44">
        <div className="flex text-black h-full">
          <img
            className="bg-red-400 w-44 object-cover rounded-full mr-3"
            src={channelDetails?.avatar}
            alt="avatar"
          />
          <div className="">
            <p className="text-4xl font-bold">{channelDetails?.fullName}</p>
            <div className=" flex my-3 space-x-1 text-lg">
              <p className="font-semibold text-black">{`@${channelDetails?.username} ${middleDot}`}</p>
              <p className="text-gray-400 font-medium ">
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

      <div className="bg-gray-800">
        <div className=" text-white border-b-[1px] border-gray-500 space-x-6 m-4">
          <NavLink
            to={`/channel/@${username}/videos`}
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-white text-white"
                : "hover:border-b-2 hover:border-gray-400"
            }
          >
            Videos
          </NavLink>

          <NavLink
            to={`/channel/@${username}/posts`}
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-white text-white "
                : "hover:border-b-2 hover:border-gray-400"
            }
          >
            Posts
          </NavLink>

          <button className="mx-2 mt-1 h-8 py-1 px-2 hover:border-b-2 hover:border-gray-200">
            Playlists
          </button>
        </div>

        <div className="flex flex-wrap bg-gray-600 justify-start">
          <Outlet context={{ channelId, menuClick }} />
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
