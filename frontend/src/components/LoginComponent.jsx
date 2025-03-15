import { useState } from "react";
import { useNavigate,Link } from "react-router";
import { useDispatch } from "react-redux";
import { addUser } from "../slices/userSlice";
import { useUserLogin } from "../hooks/useUserLogin";

const LoginComponent = () => {
  const [email, setEmail] = useState("dilip@g.com");
  const [password, setPassword] = useState("12345678");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginUser=async(e)=>{
    e.preventDefault()
    const userInfo = await useUserLogin(email,password);
    dispatch(addUser(userInfo.data.user))
    navigate('/')
  }

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-red-400">
      <div className="bg-white w-full max-w-sm rounded-lg p-8 shadow-lg">
        <label className="text-2xl font-semibold ">Login</label>
        <form className="mt-6" onSubmit={handleLoginUser}>
          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className=" bg-slate-100 w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mt-5">
            <label className="block text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" bg-slate-100 w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="py-2 bg-blue-500 mt-10 w-full rounded-lg text-lg text-white hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to={"/signup"} className="hover:underline hover:cursor-pointer">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
