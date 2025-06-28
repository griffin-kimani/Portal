const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

const permission = await Notification.requestPermission();
if (permission !== 'granted') {
  throw new Error('Permission not granted for Notification');
}


export async function registerPushSubscription(userToken) {
  if (!('serviceWorker' in navigator)) {
    console.warn('❌ Service workers not supported in this browser');
    return;
  }

  if (!publicVapidKey) {
    console.error(' VAPID public key is undefined. Check .env and restart the dev server.');
    return;
  }

  console.log('Loaded VAPID key:', publicVapidKey);

  let applicationServerKey;
  try {
    applicationServerKey = urlBase64ToUint8Array(publicVapidKey);
    console.log(' Decoded VAPID key length:', applicationServerKey.length);
  } catch (err) {
    console.error(' Failed to decode VAPID key:', err);
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log(' Service worker registered');

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    });

    const res = await fetch('http://localhost:5000/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify(subscription)
    });

    if (!res.ok) throw new Error('Failed to register subscription');
    console.log(' Push subscription registered with server');
  } catch (err) {
    console.error(' Push subscription error:', err);
  }
}


function urlBase64ToUint8Array(base64String) {
  if (!base64String || typeof base64String !== 'string') {
    throw new TypeError('VAPID key must be a non-empty string');
  }

  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+').replace(/_/g, '/');

  const raw = atob(base64);
  return new Uint8Array([...raw].map(char => char.charCodeAt(0)));
}
