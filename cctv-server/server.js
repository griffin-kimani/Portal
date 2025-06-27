require('dotenv').config();
const express    = require('express');
const http       = require('http');
const WebSocket  = require('ws');
const cors       = require('cors');
const { spawn }  = require('child_process');
const which      = require('which');
const connectDB  = require('./config/connectDB');

const auth     = require('./routes/auth');
const siteRoutes     = require('./routes/siteRoutes');
const cameraRoutes   = require('./routes/cameraRoutes');
const footageRoutes  = require('./routes/footageRoutes');
const alertRoutes    = require('./routes/alerts');

const authMiddleware = require('./middleware/authMiddleware');
const Camera         = require('./models/Camera');
const processFrame   = require('./utils/aiProcessor');

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocket.Server({ server });

connectDB();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth',     auth);
app.use('/api/sites',    authMiddleware, siteRoutes);
app.use('/api/cameras',  authMiddleware, cameraRoutes);
app.use('/api/footage',  authMiddleware, footageRoutes);
app.use('/api/alerts',   alertRoutes);


app.post('/api/process-frame', async (req, res) => {
  const { cameraId, frameData } = req.body;
  try {
    const result = await processFrame(cameraId, frameData);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error processing frame:', err);
    res.status(500).json({ error: err.message });
  }
});


const ffmpegPath = which.sync('ffmpeg', { nothrow: true });
if (!ffmpegPath) {
  console.error(' FFmpeg not found in PATH');
  process.exit(1);
}

wss.on('connection', async ws => {
  const cam = await Camera.findOne();
  if (!cam) {
    ws.send(' No camera configured');
    return ws.close();
  }

  const ffmpeg = spawn(ffmpegPath, [
    '-i', cam.rtspUrl,
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-stats', '-r', '30', '-'
  ]);

  ffmpeg.stdout.on('data', async data => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
      await processFrame(cam._id.toString(), data); // invoke AI detection
    }
  });

  ffmpeg.stderr.on('data', err => {
    console.error('FFmpeg error:', err.toString());
  });

  ffmpeg.on('close', () => ws.close());
  ws.on('close', () => ffmpeg.kill('SIGINT'));
  ws.on('error', () => ffmpeg.kill('SIGINT'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` API & WebSocket server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('\n Server shutting down...');
  server.close(() => {
    console.log(' HTTP/WebSocket server closed.');
    process.exit(0);
  });
});
