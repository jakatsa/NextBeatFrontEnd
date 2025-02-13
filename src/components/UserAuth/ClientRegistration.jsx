import React, { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext"; // adjust the path as needed

export const ClientRegistration = () => {
  const { registerUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    user_name: "",
    password: "",
    password2: "",
  });

  const { name, email, user_name, password, password2 } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // For clients, we pass null for bio, bank_details, and contacts
    registerUser(
      null,
      null,
      null,
      name,
      email,
      "client",
      user_name,
      password,
      password2
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white bg-opacity-20 backdrop-blur-sm rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Client Registration
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-white font-medium">
              Name:
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              className="mt-1 p-2 rounded bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-white font-medium">
              Email:
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="mt-1 p-2 rounded bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="user_name" className="text-white font-medium">
              Username:
            </label>
            <input
              id="user_name"
              type="text"
              name="user_name"
              value={user_name}
              onChange={onChange}
              required
              className="mt-1 p-2 rounded bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-white font-medium">
              Password:
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="mt-1 p-2 rounded bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password2" className="text-white font-medium">
              Confirm Password:
            </label>
            <input
              id="password2"
              type="password"
              name="password2"
              value={password2}
              onChange={onChange}
              required
              className="mt-1 p-2 rounded bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded transition duration-300"
          >
            Register as Client
          </button>
        </form>
      </div>
    </div>
  );
};
