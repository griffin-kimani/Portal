const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  cameraId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Camera', required: true },
  message:     { type: String, required: true },
  type:        { type: String, enum: ['object', 'face', 'motion'], required: true },
  timestamp:   { type: Date, default: Date.now },
  frameImage:  { type: String }, 
  metadata:    { type: Object },
});

module.exports = mongoose.model('Alert', alertSchema);
