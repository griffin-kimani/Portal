const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Adjust this to your actual camera stream URL
const CAMERA_URL = 'rtsp://your-camera-ip-or-dvr-url/live';
const ffmpegPath = path.join(__dirname, 'ffmpeg', 'bin', 'ffmpeg.exe');

wss.on('connection', (ws) => {
  console.log('New client connected');

  const ffmpeg = spawn(ffmpegPath, [
    '-i', CAMERA_URL,
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-stats',
    '-r', '30',
    '-'
  ]);

  ffmpeg.stdout.on('data', (data) => {
    ws.send(data);
  });

  ffmpeg.stderr.on('data', (data) => {
    // Optional: Log FFmpeg logs for debugging
    console.log(`FFmpeg stderr: ${data}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    ffmpeg.kill('SIGINT');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    ffmpeg.kill('SIGINT');
  });
});

server.listen(9999, () => {
  console.log('✅ WebSocket stream server running at ws://localhost:9999/');
});
