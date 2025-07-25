import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAvatarImg,
  updateCoverImg,
  updateUser,
} from "../../slices/userSlice";
import updateNameEmail from "../../utils/EditProfile/updateNameEmail";
import updateProfileAvatar from "../../utils/EditProfile/updateProfileAvatar";
import updateProfileCover from "../../utils/EditProfile/updateProfileCover";
import LoadingScreen from "../../utils/LoadingScreen";

const EditProfile = () => {
  const userInfo = useSelector((store) => store.user);
  const [user, setUser] = useState(userInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  console.log(user);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  const handleCancel = () => {
    setUser(userInfo);
    setIsEditing(!isEditing);
    handleCancelProfilePic();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = async () => {
    // try {
    //   const res = await axiosInstance.patch(
    //     `/user/update-details`,
    //     {
    //       fullName: user.fullName,
    //       email: user.email,
    //     },
    //     { withCredentials: true }
    //   );
    //   console.log(res.data.data);
    //   dispatch(addUser(res.data.data));
    //   setIsEditing(false);
    // } catch (err) {
    //   console.error(err);
    //   handleCancel();
    // }
    setLoading(true);
    try {
      const userRes = await updateNameEmail(user);
      if (profilePic) {
        const profileRes = await updateProfileAvatar(profilePic);
        dispatch(updateAvatarImg(profileRes.data));
      }
      if (coverImage) {
        const coverRes = await updateProfileCover(coverImage);
        dispatch(updateCoverImg(coverRes.data));
      }

      // setUser((prev) => ({ ...prev, avatar: profileRes.data,coverImage: coverRes.data }));
      setIsEditing(false);
      dispatch(updateUser(user));
    } catch (error) {
      console.log(error);
      handleCancel();
    }
    setLoading(false);
  };

  const handleProfileChange = async (e) => {
    console.log(e.target.files);
    if (e.target.files) {
      setProfilePic(e.target.files[0]);
    }
    // dispatch(updateAvatar(vtr));
  };

  const handleCoverChange = (e) => {
    console.log(e.target.files);
    if (e.target.files) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleCancelProfilePic = () => {
    setProfilePic(null);

    document.getElementById("avatar").value = null;
  };

  const handleCancelCoverImg = () => {
    setCoverImage(null);
    document.getElementById("coverImg").value = null;
  };

  return (
    // <div className="bg-red-400 flex justify-center h-full w-full">
    //   <div>
    //     {/* <div>
    //       <img className="w-60" src={user.coverImage} />
    //     </div>
    //     <div>
    //       <img className="w-20" src={user.avatar} />
    //     </div> */}
    //     <div>
    //       <div>Full Name : {user.fullName}</div>
    //       <div>Username : {user.username} </div>
    //       <div>Email : {user.email}</div>
    //     </div>
    //     <div className="space-x-4">
    //       {!editing && (
    //         <button
    //           onClick={() => setEditing(true)}
    //           className=" bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm border border-gray-300 transition-colors duration-200"
    //         >
    //           Edit Profile
    //         </button>
    //       )}
    //       {editing && (
    //         <button
    //           className="bg-red-500 text-sm text-white py-2 px-5 rounded-lg font-medium hover:bg-red-600"
    //           onClick={() => setEditing(false)}
    //         >
    //           Cancel
    //         </button>
    //       )}
    //       <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-200">
    //         Save
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div>
      {loading && <LoadingScreen />}
      <section className="max-w-xl sm:mx-auto mt-10 bg-white sm:p-6 rounded-2xl shadow-md border border-gray-200 p-4 m-2 ">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Profile
        </h1>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 rounded-md border shadow-sm focus:outline-none transition ${
                isEditing
                  ? "bg-white border-blue-500 focus:ring-2 focus:ring-blue-200"
                  : "bg-gray-100 border-gray-300 cursor-not-allowed"
              }`}
            />
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={user.username}
              disabled
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 rounded-md border shadow-sm focus:outline-none transition ${
                isEditing
                  ? "bg-white border-blue-500 focus:ring-2 focus:ring-blue-200"
                  : "bg-gray-100 border-gray-300 cursor-not-allowed"
              }`}
            />
          </div>
          <div className="">
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Avatar Image
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="avatar"
                name="avatar"
                onChange={handleProfileChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded-md border shadow-sm focus:outline-none transition ${
                  isEditing
                    ? "bg-white border-blue-500 focus:ring-2 focus:ring-blue-200"
                    : "bg-gray-100 border-gray-300 cursor-not-allowed"
                }`}
              />
              {profilePic && (
                <div
                  onClick={handleCancelProfilePic}
                  className="hover:cursor-pointer hover:bg-gray-300 w-8 h-8 rounded-full 
          justify-center items-center flex"
                >
                  ✖
                </div>
              )}
            </div>
          </div>

          <div className="">
            <label
              htmlFor="coverImg"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cover Image
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="coverImg"
                name="coverImg"
                onChange={handleCoverChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 rounded-md border shadow-sm focus:outline-none transition ${
                  isEditing
                    ? "bg-white border-blue-500 focus:ring-2 focus:ring-blue-200"
                    : "bg-gray-100 border-gray-300 cursor-not-allowed"
                }`}
              />
              {coverImage && (
                <div
                  onClick={handleCancelCoverImg}
                  className="hover:cursor-pointer hover:bg-gray-300 w-8 h-8 rounded-full 
          justify-center items-center flex"
                >
                  ✖
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEditToggle}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-md border border-gray-300 shadow-sm transition"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-white hover:bg-gray-50 text-gray-600 font-medium px-4 py-2 rounded-md border border-gray-300 shadow-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow-md transition"
                >
                  Save
                </button>
              </>
            )}
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditProfile;
