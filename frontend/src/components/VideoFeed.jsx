import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addVideo } from "../slices/videoSlice";

const VideoFeed = ()=>{
    const dispatch = useDispatch();
    const getAllVideo=async()=>{
        const res= await axios.get(BASE_URL+'/video',{
            withCredentials:true
        })
        console.log(res.data);
        dispatch(addVideo(res.data.data))
    }

    useEffect(()=>{
        getAllVideo();
    },[])
    return(
        <div>
            All Videos will be Here
        </div>
    )
}

export default VideoFeed;