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
    <div className="p-4">
      <h2 className="text-xl mb-4">📼 Footage Archive</h2>

      <ul className="space-y-2">
        {clips.map(clip => (
          <li key={clip._id}>
            <button
              className="text-blue-600"
              onClick={() => setSelected(clip)}
            >
              {new Date(clip.startTime).toLocaleString()} – {new Date(clip.endTime).toLocaleTimeString()}
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="mt-6">
          <h3 className="font-semibold">
            Playing: {new Date(selected.startTime).toLocaleString()}
          </h3>
          <video
            controls
            width="640"
            src={`http://localhost:5000/api/footage/${selected._id}/stream`}
          />
        </div>
      )}
    </div>
  );
}

export default FootageArchive;
