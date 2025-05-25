import React, { useState, useEffect } from 'react';
import api from '../../api';


const AddCamera = () => {
  const [sites, setSites] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rtspUrl: '',
    siteId: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSites = async () => {
      const res = await api.get('/sites');
      setSites(res.data);
    };
    fetchSites();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/cameras/add', formData);
      setMessage(res.data.message);
      setFormData({ name: '', location: '', rtspUrl: '', siteId: '' });
    } catch (err) {
      setMessage('Error adding camera');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">➕ Add New Camera</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Camera Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="RTSP URL"
          value={formData.rtspUrl}
          onChange={(e) => setFormData({ ...formData, rtspUrl: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <select
          value={formData.siteId}
          onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">-- Select Site --</option>
          {sites.map((site) => (
            <option key={site._id} value={site._id}>
              {site.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Camera
        </button>
      </form>

      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
};

export default AddCamera;
