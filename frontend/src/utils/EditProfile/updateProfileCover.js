import axios from "axios";
import { BASE_URL } from "../constant";

const updateProfileCover = async (coverImage) => {
  const coverEdit = new FormData();
  coverEdit.append("coverImage", coverImage);
  try {
    const res = await axios.patch(
      `${BASE_URL}/user/update-coverimage`,
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
