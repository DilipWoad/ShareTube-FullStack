import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constant";

const StudioDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  const getChannelStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/dashboard`, {
        withCredentials: true,
      });
      setDashboard(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getChannelStats();
  }, []);

  if (!dashboard) return <div>Loading....</div>;

  return (
    <div className=" bg-gray-800 rounded-xl grid grid-cols-2 gap-4 p-2 mx-2">
      <div className="bg-gray-400 h-36 flex items-center justify-center rounded-xl">
        <div className="text-center">
            <p className="text-lg font-semibold">Total Subscriber Count</p>
            <p className="text-4xl font-bold text-white">{dashboard.totalSubscriber}</p>
        </div>
      </div>
      <div className="bg-gray-400 h-36 flex items-center justify-center rounded-xl">
         <div className="text-center">
            <p className="text-lg font-semibold text-black">Total Number of Videos</p>
            <p className="text-4xl font-bold text-white">{dashboard.totalNoOfVideos}</p>
        </div>
      </div>
      <div className="bg-gray-400 h h-36 flex items-center justify-center rounded-xl">
        
        <div className="text-center">
            <p className="text-lg font-semibold">Total Videos Views</p>
            <p className="text-4xl font-bold text-white">{dashboard.totalViews}</p>
        </div>
        
      </div>
      <div className="bg-gray-400 h-36 flex items-center justify-center rounded-xl">
        
        <div className="text-center">
            <p className="text-lg font-semibold">Total Videos Likes</p>
            <p className="text-4xl font-bold text-white">{dashboard.totalLikes}</p>
        </div>
      </div>
    </div>
  );
};
export default StudioDashboard;
