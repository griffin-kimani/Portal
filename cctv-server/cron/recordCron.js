require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const connectDB = require('./config/connectDB');
const Camera = require('./models/Camera');
const Footage = require('./models/Footage');

// Ensure clips directory exists
const baseDir = path.join(__dirname, 'clips');
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);

// Record a 5-min clip from a given camera
const recordSegment = (camera) => {
  const now = new Date();
  const folder = path.join(baseDir, camera._id.toString());

  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

  const filename = `${now.toISOString()}.mp4`;
  const outPath = path.join(folder, filename);

  const ffmpeg = spawn('ffmpeg', [
    '-i', camera.rtspUrl,
    '-t', '300',          // 5 minutes
    '-c', 'copy',         // no re-encode
    outPath
  ]);

  ffmpeg.on('close', async () => {
    try {
      await Footage.create({
        cameraId:  camera._id,
        siteId:    camera.siteId,
        filename:  filename,
        path:      outPath,
        startTime: now,
        endTime:   new Date()
      });
      console.log(`✅ Saved: ${filename}`);
    } catch (err) {
      console.error('❌ DB save failed:', err.message);
    }
  });

  ffmpeg.stderr.on('data', (data) => {
    console.log(`📹 ${camera.name} ffmpeg stderr: ${data}`);
  });

  ffmpeg.on('error', (err) => {
    console.error(`❌ Failed to start FFmpeg for ${camera.name}:`, err.message);
  });
};

const startRecording = async () => {
  try {
    await connectDB();
    const cameras = await Camera.find();

    if (cameras.length === 0) {
      console.log('⚠️ No cameras found in database.');
      return;
    }

    for (const camera of cameras) {
      recordSegment(camera);
    }
  } catch (err) {
    console.error('❌ Error during recording:', err.message);
  }
};

startRecording();
