import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Smart CCTV Portal</h1>
      <p className="mb-6 text-lg text-center max-w-xl">
        Monitor your cameras in real-time, manage access securely, and get instant alerts with our AI-powered system.
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-indigo-800 px-6 py-2 rounded-lg hover:bg-indigo-900 transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
