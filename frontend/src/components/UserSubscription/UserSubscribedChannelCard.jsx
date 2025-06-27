import { Link } from "react-router";

const UserSubscribedChannelCard = ({ channel }) => {
  const { userSubscribedChannels } = channel;
  const { avatar, fullName, username } = userSubscribedChannels;

  return (
    <Link to={`/channel/@${username}`} className="  hover:cursor-pointer">
      <div className="bg-gray-400 rounded-lg items-center flex m-2 sm:block sm:px-4 sm:py-1">
        <img
          className="sm:w-32 sm:h-32  sm:mr-0 mr-4 w-20 h-20 rounded-full object-cover"
          src={avatar}
        />
        <div className="flex-1 flex-col sm:text-center">
          <div className="text-xl">{fullName}</div>
          <div className="text-[16px] mt-2 ">{`@${username}`}</div>
        </div>
      </div>
    </Link>
  );
};

export default UserSubscribedChannelCard;
