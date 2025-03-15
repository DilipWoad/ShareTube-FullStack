import axios from "axios";
import { BASE_URL } from "../utils/constant";

export const useUserLogin=async(email,password)=>{
    try {
        const res = await axios.post(BASE_URL+'/user/login',{
            email,
            password
        },{withCredentials:true})
    
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}