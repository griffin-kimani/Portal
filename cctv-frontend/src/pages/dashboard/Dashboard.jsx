import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const wsUrl = 'ws://localhost:9999';

    const script = document.createElement('script');
    script.src = '/js/jsmpeg.min.js';
    script.async = true;

    script.onload = () => {
      if (!window.JSMpeg) {
        console.error('❌ JSMpeg failed to load');
        return;
      }

      const player = new window.JSMpeg.Player(wsUrl, {
        canvas: canvasRef.current,
        autoplay: true,
        audio: false,
      });

      return () => player.destroy();
    };

    script.onerror = () => {
      console.error('❌ Failed to load local JSMpeg script');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Live CCTV Dashboard
        </h1>
        <div className="rounded overflow-hidden border border-gray-300 shadow">
          <canvas ref={canvasRef} className="w-full h-[500px] bg-black" />
        </div>
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/logout')}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
