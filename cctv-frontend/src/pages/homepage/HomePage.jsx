import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn'); 
    if (isLoggedIn === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to TechSynergy CCTV Portal</h1>
      <p className="mb-6">Secure your property with real-time video monitoring.</p>

      <div className="flex justify-center gap-4">
        <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded">
          Go to Dashboard
        </Link>

        <Link to="/login" className="bg-gray-800 text-white px-4 py-2 rounded">
          Login
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
