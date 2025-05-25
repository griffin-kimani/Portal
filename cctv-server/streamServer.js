const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/connectDB');
const Camera = require('./models/Camera');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

connectDB(); 

const CAMERA_URL = 'rtsp://your-camera-ip-or-dvr-url/live';
const ffmpegPath = 'ffmpeg';
const isFFmpegAvailable = fs.existsSync(ffmpegPath);

wss.on('connection', async (ws) => {
  console.log('New client connected');

  if (!isFFmpegAvailable) {
    ws.send('❌ FFmpeg not found. Please install or check the path.');
    ws.close();
    console.error('FFmpeg binary not found:', ffmpegPath);
    return;
  }

  try {
    const newCamera = new Camera({
      name: 'Front Gate',
      location: 'Nairobi HQ',
      addedBy: 'admin@example.com',
      rtspUrl: CAMERA_URL,
      siteId: '665000000000000000000000' 
    });

    await newCamera.save();
    console.log(' Camera saved to DB');
  } catch (err) {
    console.error('Error saving camera to DB:', err.message);
  }

  const ffmpeg = spawn(ffmpegPath, [
    '-i', CAMERA_URL,
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-stats',
    '-r', '30',
    '-'
  ]);

  ffmpeg.stdout.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });

  ffmpeg.stderr.on('data', (data) => {
    console.log(`FFmpeg stderr: ${data}`);
  });

  ffmpeg.on('error', (err) => {
    console.error('Failed to start FFmpeg:', err.message);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(' FFmpeg failed to start');
      ws.close();
    }
  });

  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg exited with code ${code}`);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send('🔌 FFmpeg stream ended');
      ws.close();
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (!ffmpeg.killed) {
      ffmpeg.kill('SIGINT');
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    if (!ffmpeg.killed) {
      ffmpeg.kill('SIGINT');
    }
  });
});

server.listen(9999, () => {
  console.log('✅ WebSocket stream server running at ws://localhost:9999/');
});
