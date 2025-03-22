import { useDispatch, useSelector } from "react-redux";
import LibraryCardComponent from "./LibraryCardComponent";
import axios from "axios"
import { BASE_URL } from "../utils/constant"
import { useEffect, useState } from "react";
import { addUserHistory, addUserLikedVideos, addUserPlaylist } from "../slices/librarySlice";

const UserLibrary = () => {
    const user = useSelector((store) => store.user);
    const library = useSelector((store)=>store.library);

    const dispatch = useDispatch();
    const userId = user?._id;
    
    const history = library.history;
    const like = library.likeVideos;
    const playlist = library.playlist

    const getHistory = async()=>{
        try {
            const res= await axios.get(BASE_URL+`/user/history`,{withCredentials:true})
            console.log(res.data.data.watchHistory)
            const userHistoryVideos = await res.data.data.watchHistory
            dispatch(addUserHistory(userHistoryVideos));
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
        dispatch(addUserLikedVideos(likeArray.reverse()))
    } catch (error) {
        console.log(error);
    }
  }

  const getPlaylist=async()=>{
    try {
        const res = await axios.get(BASE_URL+`/playlist/user/${userId}`,{withCredentials:true})
        console.log(res.data.data);
        dispatch(addUserPlaylist(res.data.data))
    } catch (error) {
        console.log(error);
    }
  }
  
  useEffect(()=>{
    getHistory();
    likeVideos();
    getPlaylist();
  },[dispatch])
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
           { history && <LibraryCardComponent library={history} label={"History"}/>}
        </div>
        <div>
           { like && <LibraryCardComponent library={like} label={"Like Videos"}/>}
        </div>
        <div>
           { playlist && <LibraryCardComponent library={playlist} label={"Playlists"}/>}
        </div>
      </div>
    </div>
  );
};

export default UserLibrary;
