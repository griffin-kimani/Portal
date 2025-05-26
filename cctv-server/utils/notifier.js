const webpush = require('web-push');
const PushSubscription = require('../models/PushSubscription');

webpush.setVapidDetails(
  'mailto:admin@yourdomain.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function sendPushNotification(alert) {
  const payload = JSON.stringify({
    title: 'CCTV Alert',
    body: `${alert.type.toUpperCase()}: ${alert.message}`,
    data: alert
  });

  const subs = await PushSubscription.find();

  for (const sub of subs) {
    try {
      await webpush.sendNotification(sub, payload);
    } catch (err) {
      console.warn('🔕 Failed push:', err.message);
    }
  }
}

module.exports = { sendPushNotification };