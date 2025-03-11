import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";

const SignupComponent = () => {
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullName: "",
  });

  const handleAvatarFile = (e) => {
    if (e.target.files) {
      setAvatar(e.target.files[0]);
    }
  };
  const handleCoverImageFile = (e) => {
    if (e.target.files) {
      setCoverImage(e.target.files[0]);
    } else {
      setCoverImage(null);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupUser = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("avatar", avatar);
    data.append("coverImage", coverImage);
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("username", formData.username);

    axios
      .post("http://localhost:8000/api/v1/user/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (res) {
        console.log(res);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-red-400">
      <div className="bg-white w-full max-w-md rounded-lg p-8 shadow-lg">
        <label className="text-2xl font-semibold ">Sign up</label>
        <form className="mt-6" onSubmit={handleSignupUser}>
          <div className="flex  space-x-2">
            <div className="w-1/2">
              <label className="block text-gray-600">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                onChange={handleChange}
                className=" bg-slate-100 w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-600">Username</label>
              <input
                type="text"
                placeholder="Username"
                name="username"
                required
                onChange={handleChange}
                className=" bg-slate-100 w-full  px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              required
              onChange={handleChange}
              className=" bg-slate-100 w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mt-3">
            <label className="block text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              required
              name="password"
              onChange={handleChange}
              className=" bg-slate-100 w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="my-6 flex">
            <div className="w-1/2">
              <label className="block text-gray-600">Avatar Image</label>
              <input
                type="file"
                required
                className="text-sm  py-1 rounded-lg flex flex-wrap"
                onChange={handleAvatarFile}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-600">Cover Image</label>
              <input
                type="file"
                className="text-sm  py-1 rounded-lg flex flex-wrap"
                onChange={handleCoverImageFile}
              />
            </div>
          </div>
          <button
            type="submit"
            className="py-2 bg-blue-500 mt-6 w-full rounded-lg text-lg text-white hover:bg-blue-600 transition"
          >
            Signup
          </button>
        </form>
        <p className="text-center mt-3 text-sm">
          Already have an account?{" "}
          <Link to={"/login"} className="hover:underline hover:cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupComponent;
