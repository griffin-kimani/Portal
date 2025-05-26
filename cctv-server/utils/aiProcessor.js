const Alert = require('../models/Alert');
const { sendPushNotification } = require('./notifier');

module.exports = async function processFrame(cameraId, frameBufferOrBase64) {
  try {
    const detections = await mockDetect(frameBufferOrBase64);

    for (const detection of detections) {
      const alert = new Alert({
        cameraId,
        message: detection.message,
        type: detection.type,
        metadata: detection.metadata,
        frameImage: frameBufferOrBase64.toString('base64')
      });
      await alert.save();
      await sendPushNotification(alert);
      console.log(`🚨 ${detection.type.toUpperCase()} Alert:`, alert.message);
    }

    return { alerts: detections.length };
  } catch (err) {
    console.error('AI processing error:', err);
    throw err;
  }
};

// Mock object detection/face recognition logic
async function mockDetect(frame) {
  const chance = Math.random();
  const results = [];

  if (chance < 0.05) {
    results.push({
      type: 'face',
      message: 'Unknown face detected.',
      metadata: { confidence: 0.88, faceId: null }
    });
  } else if (chance < 0.15) {
    results.push({
      type: 'object',
      message: 'Suspicious object detected.',
      metadata: { label: 'knife', confidence: 0.91 }
    });
  }

  return results;
}
