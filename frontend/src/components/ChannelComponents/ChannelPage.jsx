import axiosInstance from "../../api/axiosInstance.js";
import { NavLink, Outlet, useParams } from "react-router";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addChannelInfo } from "../../slices/channelSlice";
import ConfirmationBox from "../../utils/ConfirmationBox";
import LoadingScreen from "../../utils/LoadingScreen";

const ChannelPage = () => {
  const dispatch = useDispatch();
  const menuClick = useSelector((store) => store.video.isMenuClicked);
  const user = useSelector((store) => store?.user);

  const [channelDetails, setChannelDetails] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [channelVideos, setChannelVideos] = useState(null);
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showBox, setShowBox] = useState(false);

  const middleDot = "\u0387";
  const channelId = channelDetails?._id;

  const { id } = useParams();
  const username = id.replace("@", "");

  const userChannelDetails = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/user/channel/${username.trim()}`, {
        withCredentials: true,
      });
      console.log(res.data);
      setChannelDetails(res.data.data);
      setIsSubscribed(res.data.data.isCurrentUserSubscribed);
      setSubscriberCount(res.data.data.subscriberCount);
      dispatch(addChannelInfo(res.data.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    !channelDetails && userChannelDetails();
  }, [username,dispatch]);

  if (!channelDetails) return <LoadingScreen />;
  return (
    <div
      className={`p-2 sm:rounded-xl bg-gray-600 w-full sm:ml-[98px] ${
        menuClick ? " sm:ml-14" : "sm:mr-[120px]"
      } space-y-5 sm:m-2 `}
    >
      {/* Welcome to Channel Page {na} */}
      <img
        className="w-full sm:h-44 h-36 object-cover sm:object-fill rounded-xl"
        src={(channelDetails._id === user?._id) ? user.coverImage : channelDetails.coverImage}
      />
      <div className=" sm:h-44 ">
        <div className="flex text-black h-full">
          <img
            className=" sm:w-44 sm:h-auto w-28 h-28 flex-2 object-cover rounded-full mr-3"
            src={(channelDetails._id === user?._id) ? user.avatar : channelDetails.avatar}
            alt="avatar"
          />
          <div className="flex-1">
            <p className="sm:text-4xl text-2xl font-bold">
              {(channelDetails._id === user?._id) ? user.fullName : channelDetails.fullName}
            </p>
            <div className=" flex my-3 space-x-1 sm:text-lg text-sm">
              <p className="font-semibold text-black">{`@${(channelDetails._id === user?._id) ? user.username : channelDetails.username} ${middleDot}`}</p>
              <p className="text-gray-400 font-medium ">
                {subscriberCount} subscribers
              </p>
            </div>
            <button
              onClick={() => setShowBox(true)}
              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-full sm:mt-7 text-sm sm:text-[16px] ${
                isSubscribed
                  ? "bg-gray-500 text-white hover:bg-gray-400"
                  : "hover:bg-gray-300 bg-white"
              } `}
            >{`${isSubscribed ? "🔔 Subscribed" : "Subscribe"}`}</button>
          </div>
        </div>
      </div>

      {/* Video/post/Playlist section */}

      <div className="bg-gray-800 py-1 rounded-lg">
        <div className=" text-white border-b-[1px] border-gray-500 space-x-6 mb-4 mx-4 flex">
          <NavLink
            to={`/channel/@${username}/videos `}
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

          <div className={`${user?._id !== channelId ? "hidden" : ""}`}>
            <NavLink
              to={`/channel/@${username}/profile`}
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-white text-white "
                  : "hover:border-b-2 hover:border-gray-400"
              }
            >
              Profile
            </NavLink>
          </div>
        </div>

        <Outlet
          context={{ channelId, menuClick, channelVideos, setChannelVideos }}
        />
      </div>
      {showBox && (
        <ConfirmationBox
          toggle={isSubscribed}
          setShowBox={setShowBox}
          setToggle={setIsSubscribed}
          id={channelDetails._id}
          subscriptionClick={true}
          setSubscriberCount={setSubscriberCount}
          userId={user?._id}
        />
      )}
    </div>
  );
};

export default ChannelPage;
