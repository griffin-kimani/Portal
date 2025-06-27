import React, { useState, useEffect } from 'react';
import api from '../../api';

function FootageArchive({ cameraId }) {
  const [clips, setClips] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.get('/footage', { params: { cameraId } });
      setClips(res.data);
    }
    load();
  }, [cameraId]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">📼 Footage Archive</h2>

      <ul className="space-y-3">
        {clips.map((clip) => (
          <li key={clip._id}>
            <button
              className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-blue-100 rounded border text-blue-700 font-medium transition"
              onClick={() => setSelected(clip)}
            >
              {new Date(clip.startTime).toLocaleString()} –{' '}
              {new Date(clip.endTime).toLocaleTimeString()}
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3">
            Playing: {new Date(selected.startTime).toLocaleString()}
          </h3>
          <video
            controls
            className="w-full max-w-2xl rounded border shadow"
            src={`http://localhost:5000/api/footage/${selected._id}/stream`}
          />
        </div>
      )}
    </div>
  );
}

export default FootageArchive;
