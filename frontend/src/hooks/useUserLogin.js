import axiosInstance from "../api/axiosInstance.js";

export const useUserLogin = async (email, password) => {
  try {
    const res = await axiosInstance.post(
      `/user/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
