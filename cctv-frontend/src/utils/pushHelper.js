const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export async function registerPushSubscription(userToken) {
  if (!('serviceWorker' in navigator)) return console.warn('SW not supported');

  const registration = await navigator.serviceWorker.register('/service-worker.js');

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
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
  console.log('✅ Push subscription registered');
}

// Convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+').replace(/_/g, '/');

  const raw = atob(base64);
  return new Uint8Array([...raw].map(char => char.charCodeAt(0)));
}
