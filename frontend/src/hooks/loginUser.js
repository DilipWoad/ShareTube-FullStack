import axios from "axios";
import { BASE_URL } from "../utils/constant.js";

export const loginUser = async (formInput) => {
  const err = {emailError:"",passwordError:""};
  //use Axios only for login
  try {
    const res = await axios.post(`${BASE_URL}/user/login`, formInput, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Login failed";
    msg.includes('email') ? err.emailError = msg : err.passwordError=msg ;
    return err;
  }
};
