import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import JSMpeg from 'jsmpeg'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const wsUrl = 'ws://localhost:9999'; 
    const canvas = canvasRef.current;

    if (canvas) {
      new JSMpeg.Player(wsUrl, { canvas });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Dashboard</h1>
      <p className="text-lg text-center mb-6">Welcome back, admin! Here's what's happening with your CCTV system:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h2 className="text-xl font-semibold mb-2">Live Camera Feeds</h2>
          <canvas ref={canvasRef} width="640" height="360" className="mx-auto border rounded" />
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Activity Summary</h2>
          <p className="text-gray-600">Recent events, motion alerts, or logs can be listed here.</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
