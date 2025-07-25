import axiosInstance from "../api/axiosInstance.js";

const userAuthStatus = async () => {
  try {
    const res = await axiosInstance.get("/status");
    return res.data.isAuthenticated;
  } catch (error) {
    return false;
  }
};
export { userAuthStatus };
