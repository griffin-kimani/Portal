const cron = require('node-cron');
const connectDB = require('../config/connectDB');
const Camera = require('../models/Camera');
const recordSegment = require('./recordSegment');

connectDB();

cron.schedule('*/5 * * * *', async () => {
  console.log('[📹] Starting 5-minute recording cycle...');
  const cameras = await Camera.find({});
  cameras.forEach(camera => recordSegment(camera));
});
