const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  location: { type: String, required: true },
  addedBy:  { type: String, required: true },
  rtspUrl: {
    type: String,
    required: true,
    match: /^rtsp:\/\/.+/
  },
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Camera', cameraSchema);
