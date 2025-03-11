import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginUser=(e)=>{
    e.preventDefault()
    axios.post('http://localhost:8000/api/v1/user/login',{
      email,
      password
    }).then(function (res){
      console.log(res)
    }).catch(function(err){
      console.log(err);
    })
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
