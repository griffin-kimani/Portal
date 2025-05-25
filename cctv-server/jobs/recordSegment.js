const path = require('path');
const { spawn } = require('child_process');
const Camera = require('../models/Camera');
const Footage = require('../models/Footage');

const recordSegment = (camera) => {
  const now = new Date();
  const dir = path.join(__dirname, '..', 'clips', camera._id.toString());
  const filename = `${now.toISOString().replace(/[:.]/g, '-')}.mp4`;
  const outPath  = path.join(dir, filename);

  require('fs').mkdirSync(dir, { recursive: true });

  const ffmpeg = spawn('ffmpeg', [
    '-i', camera.rtspUrl,
    '-t', '300',
    '-c', 'copy',
    outPath
  ]);

  ffmpeg.on('close', async () => {
    await Footage.create({
      cameraId: camera._id,
      siteId: camera.siteId,
      filename,
      path: outPath,
      startTime: now,
      endTime: new Date()
    });
  });
};

module.exports = recordSegment;
