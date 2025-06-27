import React, { useEffect, useState } from 'react';
import api from '../../api';

const CamerasBySite = () => {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    const fetchSites = async () => {
      const res = await api.get('/sites');
      setSites(res.data);
    };
    fetchSites();
  }, []);

  useEffect(() => {
    if (selectedSite) {
      const fetchCameras = async () => {
        const res = await api.get(`/cameras/site/${selectedSite}`);
        setCameras(res.data.cameras);
      };
      fetchCameras();
    } else {
      setCameras([]);
    }
  }, [selectedSite]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">📍 View Cameras by Site</h2>

      <select
        className="w-full p-3 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedSite}
        onChange={(e) => setSelectedSite(e.target.value)}
      >
        <option value="">-- Choose Site --</option>
        {sites.map((site) => (
          <option key={site._id} value={site._id}>
            {site.name}
          </option>
        ))}
      </select>

      <div>
        <h3 className="text-xl font-medium mb-3 text-gray-700">🎥 Cameras</h3>
        {cameras.length === 0 ? (
          <p className="text-gray-500 italic">No cameras found for this site.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4">
            {cameras.map((camera) => (
              <li key={camera._id} className="p-4 bg-gray-100 rounded shadow-sm hover:shadow-md transition">
                <div className="font-semibold text-gray-800">{camera.name}</div>
                <div className="text-sm text-gray-600">{camera.location}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CamerasBySite;
