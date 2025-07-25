import axiosInstance from "../api/axiosInstance.js";

export const useUserSignUp = async (avatar, coverImage, formData) => {
  const data = new FormData();
  data.append("avatar", avatar);
  data.append("coverImage", coverImage);
  data.append("fullName", formData.fullName);
  data.append("email", formData.email);
  data.append("password", formData.password);
  data.append("username", formData.username);

  try {
    const res = await axiosInstance.post("/user/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};
