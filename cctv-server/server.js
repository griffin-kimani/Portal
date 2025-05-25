require('dotenv').config();
const express    = require('express');
const http       = require('http');
const WebSocket  = require('ws');
const cors       = require('cors');
const { spawn }  = require('child_process');
const which      = require('which');
const connectDB  = require('./config/connectDB');

const authRoutes     = require('./routes/authRoutes');
const siteRoutes     = require('./routes/siteRoutes');
const cameraRoutes   = require('./routes/cameraRoutes');
const footageRoutes  = require('./routes/footageRoutes');

const authMiddleware = require('./middleware/authMiddleware');
const Camera         = require('./models/Camera');

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocket.Server({ server });


connectDB();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


app.use('/api/auth',    authRoutes);
app.use('/api/sites',   authMiddleware, siteRoutes);
app.use('/api/cameras', authMiddleware, cameraRoutes);
app.use('/api/footage', authMiddleware, footageRoutes);


const ffmpegPath = which.sync('ffmpeg', { nothrow: true });

if (!ffmpegPath) {
  console.error('❌ FFmpeg not found in PATH');
  process.exit(1);
}


wss.on('connection', async ws => {
  const cam = await Camera.findOne();
  if (!cam) {
    ws.send('❌ No camera configured');
    return ws.close();
  }

  const ffmpeg = spawn(ffmpegPath, [
    '-i', cam.rtspUrl,
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-stats', '-r', '30', '-'
  ]);

  ffmpeg.stdout.on('data', data => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
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
  console.log(`🚀 API & WebSocket server running on port ${PORT}`);
});


process.on('SIGINT', () => {
  console.log('\n🛑 Server shutting down...');
  server.close(() => {
    console.log('🔌 HTTP/WebSocket server closed.');
    process.exit(0);
  });
});
