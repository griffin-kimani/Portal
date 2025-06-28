import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-purple-800 text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">
          Welcome to <span className="text-yellow-300">Smart CCTV Portal</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          Monitor live footage, manage your smart cameras, and receive real-time alerts with our secure AI-powered platform.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-yellow-400 text-indigo-900 font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-yellow-300 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <img
          src="/cctv-illustration.svg"
          alt="CCTV Illustration"
          className="w-72 md:w-96 drop-shadow-xl animate-fade-in-up"
        />
      </div>
    </div>
  );
};

export default HomePage;
