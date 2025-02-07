import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 p-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-xl ring-2 ring-teal-300">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Join the Beat
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Create your account and drop into the rhythm.
        </p>

        <form className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-xl text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xl text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xl text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="text-center">
            <button className="w-full py-2 px-4 bg-teal-600 text-white rounded-full text-lg font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400">
              Register
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              className="text-teal-600 hover:text-teal-700 font-semibold"
              to="/Login"
            >
              {" "}
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
