import React, { useState } from 'react';
import api from '../../api';

const AddCamera = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rtspUrl: '',
    siteName: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/cameras/add', formData);
      setMessage(res.data.message || 'Camera added successfully');
      setFormData({ name: '', location: '', rtspUrl: '', siteName: '' });
    } catch (err) {
      setMessage('Error adding camera');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md mt-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">➕ Add New Camera</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Camera Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          placeholder="RTSP URL"
          value={formData.rtspUrl}
          onChange={(e) => setFormData({ ...formData, rtspUrl: e.target.value })}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          placeholder="Enter Site Name"
          value={formData.siteName}
          onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
          required
          className="w-full p-3 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Add Camera
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-600 font-medium">{message}</p>}
    </div>
  );
};

export default AddCamera;
