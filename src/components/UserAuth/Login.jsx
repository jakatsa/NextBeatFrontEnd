import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

export const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      loginUser(email, password);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl ring-2 ring-pink-300">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Beat the Login
        </h1>
        <p className="text-center text-gray-500 mb-4">
          Step into the rhythm of your account.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-xl text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xl text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="text-center">
            <button
              className="w-full py-2 px-4 bg-pink-600 text-white rounded-full text-lg font-semibold hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
              type="submit"
            >
              Log In
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don’t have an account?{" "}
            <Link
              className="text-pink-600 hover:text-pink-700 font-semibold"
              to="/Register"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
