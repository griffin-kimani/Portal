const mongoose = require('mongoose');

const footageSchema = new mongoose.Schema({
  cameraId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camera',
    required: true
  },
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    required: true
  },
  filename: {
    type: String,
    required: true,
    trim: true
  },
  path: {
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  durationSeconds: {
    type: Number,
    default: function () {
      return Math.round((this.endTime - this.startTime) / 1000);
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Footage', footageSchema);
