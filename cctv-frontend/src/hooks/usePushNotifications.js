import { registerPushSubscription } from '../utils/pushHelper';

export async function handlePushSetup(token) {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    await registerPushSubscription(token);
  } else {
    console.warn('❌ Notification permission denied');
  }
}
