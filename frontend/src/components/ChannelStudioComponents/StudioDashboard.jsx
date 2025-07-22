import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addDashboard } from "../../slices/studioSlice";
import LoadingScreen from "../../utils/LoadingScreen";

const StudioDashboard = () => {
  const dispatch = useDispatch();
  const dashboard = useSelector((store)=>store.studio.dashboard)
   const [loading,setLoading] = useState(false);

  const getChannelStats = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${BASE_URL}/dashboard`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      dispatch(addDashboard(res.data.data))
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getChannelStats();
  }, []);
 
  if (loading) return <LoadingScreen/>;

  return (
    <div className="bg-gray-900 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 mx-2">
  {[
    { label: "Total Subscriber Count", value: dashboard.totalSubscriber },
    { label: "Total Number of Videos", value: dashboard.totalNoOfVideos },
    { label: "Total Videos Views", value: dashboard.totalViews },
    { label: "Total Videos Likes", value: dashboard.totalLikes },
  ].map((item, index) => (
    <div
      key={index}
      className="bg-gradient-to-br from-gray-500 to-gray-400 h-36 flex items-center justify-center rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-200"
    >
      <div className="text-center px-2">
        <p className="text-base sm:text-lg font-semibold text-black mb-2">{item.label}</p>
        <p className="text-3xl sm:text-4xl font-bold text-white">{item.value}</p>
      </div>
    </div>
  ))}
</div>
  );
};
export default StudioDashboard;
