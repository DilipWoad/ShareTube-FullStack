import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useUserSignUp } from "../../hooks/useUserSignUp";
import { validateSignupForm } from "../../utils/FormValidation/validateSignupForm";
import { CLOSE_EYE, OPEN_EYE } from "../../utils/constant";
import LoadingScreen from "../../utils/LoadingScreen"
const SignupComponent = () => {
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [signupError, setSignupError] = useState({});
  const [eyeOpen, setEyeOpen] = useState(false);

  const [loading,setLoading] = useState(false)

  const errorFormat = { emailFormat: "", passwordFormat: "" };
  const [validFormatError, setValidFormatError] = useState(errorFormat);
  const navigate = useNavigate();

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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignupUser = async (e) => {
    // setValidFormatError(errorFormat);
    setLoading(true);
    e.preventDefault();
    const { isValidEmail, isValidPassword } = validateSignupForm(formData);

    if (isValidEmail && isValidPassword) {
      const signupInfo = await useUserSignUp(avatar, coverImage, formData);
      if (signupInfo.data) {
        setSignupError({});
        navigate("/login");
      } else {
        setSignupError(signupInfo);
      }
    } else {
      if (!isValidEmail) {
        setValidFormatError({
          ...validFormatError,
          emailFormat: "Invalid Email Formate!!",
        });
      }
      if (!isValidPassword) {
        if (formData.password.length < 8) {
          setValidFormatError({
            ...validFormatError,
            passwordFormat: "Password length should be atleast 8.",
          });
        }
        setValidFormatError({
          ...validFormatError,
          passwordFormat:
            "Password should contain 1 Special,1 Uppercase and 1 Lowercase.",
        });
      }
      // console.log(
      //   "Make sure enter email is correct or Password Must contain 8 letter,special char and upper-lower case"
      // );
      setLoading(false)
    }
  };

  return (
    <div className="flex items-center justify-center w-screen px-2 ">
      {loading && <LoadingScreen/>}
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
              <p className="text-red-500 text-sm text-wrap">
                {signupError.usernameError}
              </p>
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
            <p className="text-red-500 text-sm text-wrap">
              {signupError.emailError}
            </p>
          </div>
          <div className="mt-3 relative">
            <label className="block text-gray-600">Password</label>
            <input
              type={eyeOpen ? "text" : "password"}
              placeholder="Enter Password"
              required
              name="password"
              onChange={handleChange}
              className=" bg-slate-100 w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div
              onClick={() => setEyeOpen(!eyeOpen)}
              className="absolute bottom-2 right-2 hover:cursor-pointer "
            >
              <img
                className="w-5 "
                src={eyeOpen ? OPEN_EYE : CLOSE_EYE}
                alt="see-password-icon"
              />
            </div>
          </div>
          <p className="text-red-500 text-sm text-wrap">
            {validFormatError.passwordFormat}
          </p>
          <div className="my-6 sm:flex space-y-4 sm:space-y-0">
            <div className="w-1/2 space-y-2 sm:space-y-0">
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
