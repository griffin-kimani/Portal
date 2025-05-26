self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  const title = data.title || 'CCTV Alert';
  const options = {
    body: data.body || 'Suspicious activity detected!',
    icon: '/alert-icon.png',
    badge: '/badge.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
