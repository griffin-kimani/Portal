const express = require('express');
const Stream = require('node-rtsp-stream');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const streams = {}; // Keep track of active streams

router.post('/start', authMiddleware, (req, res) => {
  const { cameraId, rtspUrl } = req.body;
  const port = 9990 + Object.keys(streams).length;

  if (!rtspUrl) return res.status(400).json({ message: 'RTSP URL is required' });
  if (streams[cameraId]) return res.status(400).json({ message: 'Stream already running' });

  const stream = new Stream({
    name: cameraId,
    streamUrl: rtspUrl,
    wsPort: port,
    ffmpegOptions: {
      '-stats': '',
      '-r': 30
    }
  });

  streams[cameraId] = { stream, port };
  return res.json({ message: `Stream started on ws://localhost:${port}`, wsPort: port });
});

router.post('/stop', authMiddleware, (req, res) => {
  const { cameraId } = req.body;
  if (streams[cameraId]) {
    streams[cameraId].stream.stop();
    delete streams[cameraId];
    return res.json({ message: `Stream for ${cameraId} stopped` });
  }
  res.status(404).json({ message: 'Stream not found' });
});

module.exports = router;