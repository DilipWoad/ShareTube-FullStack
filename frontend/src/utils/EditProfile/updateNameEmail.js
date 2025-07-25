import axiosInstance from "../../api/axiosInstance";

const updateNameEmail = async (user) => {
  try {
    const res = await axiosInstance.patch(
      `/user/update-details`,
      {
        fullName: user.fullName,
        email: user.email,
      },
      { withCredentials: true }
    );
    console.log(res.data.data);
    // dispatch(addUser(res.data.data));
    // setIsEditing(false);
    return res.data.data;
  } catch (err) {
    console.error(err);
    // handleCancel();
    return err;
  }
};

export default updateNameEmail;
