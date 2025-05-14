const express3 = require('express');
const { body } = require('express-validator');
const Stream = require('node-rtsp-stream');
const authMiddleware3 = require('../middleware/authMiddleware');

const router3 = express3.Router();
const streams = {};


router3.post(
  '/start',
  authMiddleware3,
  [body('cameraId', 'Camera ID is required').notEmpty(), body('rtspUrl', 'RTSP URL is required').matches(/^rtsp:\/\/.+/)],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { cameraId, rtspUrl } = req.body;
      if (streams[cameraId]) {
        return res.status(400).json({ message: 'Stream already running' });
      }
      const port = 9990 + Object.keys(streams).length;
      const stream = new Stream({ name: cameraId, streamUrl: rtspUrl, wsPort: port, ffmpegOptions: { '-stats': '', '-r': 30 } });
      streams[cameraId] = { stream, port };
      res.json({ message: `Stream started`, wsPort: port });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router3.post(
  '/stop',
  authMiddleware3,
  [body('cameraId', 'Camera ID is required').notEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { cameraId } = req.body;
      if (!streams[cameraId]) {
        return res.status(404).json({ message: 'Stream not found' });
      }
      streams[cameraId].stream.stop();
      delete streams[cameraId];
      res.json({ message: `Stream for '${cameraId}' stopped` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router3;
