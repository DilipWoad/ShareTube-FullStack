import { Outlet, useNavigate } from "react-router";
import Header from "./Header";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../slices/userSlice";
import { BASE_URL } from "../utils/constant";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = useSelector((store)=>store.user)

  const userInfo = async () => {
    try {
      const response = await axios.get(BASE_URL+"/user/userinfo",{withCredentials:true});
      console.log(response);
      dispatch(addUser(response.data.data))
    } catch (error) {
      navigate('/login')
      console.log(error)
    }
  };

  useEffect(()=>{
    !userDetails && userInfo();
  },[])
  return (
    <div>
      <Header />
      <Outlet />
      {/* <div>
      <iframe
        src="https://res.cloudinary.com/dvb5edx52/video/upload/q37xojpkomn2urjyvtik.mp4"
        width="640"
        height="360"
        
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
      ></iframe>
      </div> */}
      
    </div>
  );
};

export default Body;
