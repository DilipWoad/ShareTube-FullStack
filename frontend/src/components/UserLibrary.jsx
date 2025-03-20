import { useSelector } from "react-redux";
import LibraryCardComponent from "./LibraryCardComponent";
import axios from "axios"
import { BASE_URL } from "../utils/constant"
import { useEffect, useState } from "react";

const UserLibrary = () => {
    const [history,setHistory] = useState(null);
    const getHistory = async()=>{
        const res= await axios.get(BASE_URL+`/user/history`,{withCredentials:true})
        console.log(res.data.data.watchHistory)
        const userHistoryVideos = await res.data.data.watchHistory
        setHistory(userHistoryVideos);
    }
  const user = useSelector((store) => store.user);

  useEffect(()=>{
    getHistory();
  },[])
  if(!history) return <div>Loading...</div>
  return (
    <div className=" flex w-full bg-purple-400 justify-center">
      <div className=" min-w-[1000px] bg-lime-200 ">
        <div className="flex bg-yellow-500 p-2 space-x-3">
          <div className="w-28 h-28 rounded-full overflow-hidden">
            <img className="" src={user?.avatar} alt="user-avatar" />
          </div>
          <div className="bg-sky-400">
            <p className="text-4xl font-bold">{user?.fullName}</p>
            <p className="text-lg my-2">@{user?.username}</p>
          </div>
        </div>
        <div>
           { history && <LibraryCardComponent history={history}/>}
        </div>
      </div>
    </div>
  );
};

export default UserLibrary;
