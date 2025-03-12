import axios from "axios"
import { BASE_URL } from "./constant"

const userAuthStatus=async()=>{
    try {
        const res = await axios.get(BASE_URL+'/status');
        return res.data.isAuthenticated;
    } catch (error) {
        return false
    }
}
export {userAuthStatus};