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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📍 Select Site to View Cameras</h2>

      <select
        className="p-2 border rounded mb-4"
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
        <h3 className="text-lg font-semibold mb-2">🎥 Cameras:</h3>
        {cameras.length === 0 ? (
          <p>No cameras found for this site.</p>
        ) : (
          <ul className="space-y-2">
            {cameras.map((camera) => (
              <li key={camera._id} className="p-2 border rounded bg-gray-50">
                <strong>{camera.name}</strong> - {camera.location}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CamerasBySite;
