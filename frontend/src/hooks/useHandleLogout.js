import axiosInstance from "../api/axiosInstance.js";

export const useHandleLogout = async () => {
  try {
    await axiosInstance.post(
      "/user/logout",
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
