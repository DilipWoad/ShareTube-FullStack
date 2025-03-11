import { useState } from "react";
import { Link } from "react-router";

const SignupComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-red-400">
      <div className="bg-white w-full max-w-sm rounded-lg p-8 shadow-lg">
        <p className="text-2xl font-semibold ">Singup</p>
        <form className="mt-6">
          <div className="flex  space-x-2">
            <div className="w-1/2">
              <label className="block text-gray-600">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={fullname}
                required
                onChange={(e) => setFullname(e.target.value)}
                className=" bg-slate-100 w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-600">Username</label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
                className=" bg-slate-100 w-full  px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <div className="mt-3">
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
          <div className="mt-3">
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
          <div className="mt-4 space-y-2">
            <div className="w-1/2">
              <label className="block text-gray-600">Avatar Image</label>
              <input
                type="file"
                required
                className="text-sm  py-1 rounded-lg"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-600">Cover Image</label>
              <input type="file" className="text-sm  py-1 rounded-lg" />
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
