import { Link } from "react-router";

const UserSubscribedChannelCard = ({ channel }) => {
  const { userSubscribedChannels } = channel;
  const { avatar, fullName, username } = userSubscribedChannels;

  return (
    <Link to={`/channel/@${username}`} className="bg-gray-400 block w-fit h-fit m-2 p-2 rounded-xl text-center hover:cursor-pointer">
      <img
          className="w-32 h-32 rounded-full object-cover"
          src={avatar}
        />
        <div className=" h-full py-2">
          <div className="text-2xl">{fullName}</div>
          <div className="text-lg mt-4 ">{`@${username}`}</div>
        </div>
    </Link>
  );
};

export default UserSubscribedChannelCard;
