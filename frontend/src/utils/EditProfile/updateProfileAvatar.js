import axiosInstance from "../../api/axiosInstance";

const updateProfileAvatar = async (profilePic) => {
  const profilePicEdit = new FormData();
  profilePicEdit.append("avatar", profilePic);

  try {
    const res = await axiosInstance.patch(
      `/user/update-avatar`,
      profilePicEdit,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default updateProfileAvatar;
