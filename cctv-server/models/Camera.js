const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  addedBy: { type: String, required: true },
  rtspUrl: {
    type: String,
    required: true,
    match: /^rtsp:\/\/.+/ 
  }
}, { timestamps: true });

module.exports = mongoose.model('Camera', cameraSchema);
