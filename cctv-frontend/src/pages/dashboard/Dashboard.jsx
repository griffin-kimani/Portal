import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const wsUrl = 'ws://localhost:9999';

    const script = document.createElement('script');
    script.src = '/js/jsmpeg.min.js'; // ✅ Local path
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

      // Clean up player on unmount
      return () => player.destroy();
    };

    script.onerror = () => {
      console.error('❌ Failed to load local JSMpeg script');
    };

    document.body.appendChild(script);

    // Clean up script tag on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Live CCTV Dashboard</h1>
        <div className="rounded-lg overflow-hidden border border-gray-700 shadow-lg">
          <canvas ref={canvasRef} className="w-full h-[500px] bg-black" />
        </div>
        <div className="text-center">
          <button
            onClick={() => navigate('/logout')}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
