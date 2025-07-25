import axiosInstance from "../../api/axiosInstance.js";

const updateProfileCover = async (coverImage) => {
  const coverEdit = new FormData();
  coverEdit.append("coverImage", coverImage);
  try {
    const res = await axiosInstance.patch(
      `/user/update-coverimage`,
      coverEdit,
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

export default updateProfileCover;
