import { useSelector } from "react-redux";
import LibraryCardComponent from "./LibraryCardComponent";
import axios from "axios"
import { BASE_URL } from "../utils/constant"
import { useEffect, useState } from "react";

const UserLibrary = () => {
    const user = useSelector((store) => store.user);
    const [history,setHistory] = useState(null);
    const [like,setLike] = useState(null);
    const [playlist,setPlaylist] = useState(null);

    const getHistory = async()=>{
        try {
            const res= await axios.get(BASE_URL+`/user/history`,{withCredentials:true})
            console.log(res.data.data.watchHistory)
            const userHistoryVideos = await res.data.data.watchHistory
            setHistory(userHistoryVideos);
        } catch (error) {
            console.log(error)
        }
    }
  
  
  const likeVideos=async()=>{
    try {
        let likeArray = [];
        const res = await axios.get(BASE_URL+`/like/videos`,{withCredentials:true})
        console.log(res.data.data)
        const userLike = await res.data.data;
        console.log(userLike)
        for(let i=0;i<userLike.length;i++){
            likeArray.push(userLike[i].videoDetail);
        }
        setLike(likeArray.reverse());
    } catch (error) {
        console.log(error);
    }
  }

  const getPlaylist=async(userId)=>{
    try {
        const res = await axios.get(BASE_URL+`/playlist/user/${userId.trim()}`,{withCredentials:true})
        console.log(res.data.data);
        setPlaylist(res.data.data);
    } catch (error) {
        console.log(error);
    }
  }
  
  useEffect(()=>{
    getHistory();
    likeVideos();
    getPlaylist(user?._id);
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
           { history && <LibraryCardComponent history={history} label={"History"}/>}
        </div>
        <div>
           { like && <LibraryCardComponent history={like} label={"Like Videos"}/>}
        </div>
        <div>
           { playlist && <LibraryCardComponent history={playlist} label={"Playlists"}/>}
        </div>
      </div>
    </div>
  );
};

export default UserLibrary;
