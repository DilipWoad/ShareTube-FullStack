import axios from "axios";
import { BASE_URL } from "../utils/constant";

export const useHandleLogout = async () => {
  try {
    await axios.post(
      BASE_URL + "/user/logout",
      {},
      {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};
