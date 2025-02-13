import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-pink-500 flex flex-col items-center justify-center p-4">
      {/* Page Title */}
      <h1 className="text-5xl font-extrabold text-white mb-10 animate-pulse">
        Join the Beat Vibe
      </h1>

      {/* Registration Options Container */}
      <div className="w-full max-w-md space-y-6">
        {/* Buy Beats Option */}
        <Link to="/ClientRegistration">
          <div className="p-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl hover:bg-opacity-30 transition duration-300">
            <h2 className="text-3xl font-bold text-white text-center">
              Buy Beats
            </h2>
            <p className="mt-2 text-white text-center">
              Find the perfect beat to bring your music to life.
            </p>
          </div>
        </Link>
        <div>OR</div>
        {/* Sell Beats Option */}
        <Link to="/ProducerRegistration">
          <div className="p-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl hover:bg-opacity-30 transition duration-300">
            <h2 className="text-3xl font-bold text-white text-center">
              Sell Beats
            </h2>
            <p className="mt-2 text-white text-center">
              Share your creations and connect with artists worldwide.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Register;
