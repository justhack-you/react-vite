export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission === 'denied') {
        return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
};

export const subscribeUserToPush = async () => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
        console.error('Service Worker not supported in this browser');
        return null;
    }

    // Check if PushManager is supported
    if (!('PushManager' in window)) {
        console.error('Push notifications not supported in this browser');
        return null;
    }

    let registration;
    try {
        // First, you need to register your service worker
        registration = await navigator.serviceWorker.register('/sw.js'); // Update with your service worker path
        await navigator.serviceWorker.ready;
    } catch (err) {
        console.error('Service Worker registration failed:', err);
        return null;
    }

    try {
        // Check current subscription first
        let subscription = await registration.pushManager.getSubscription();

        // If already subscribed, return the existing subscription
        if (subscription) {
            console.log('User is already subscribed to push notifications');
            return subscription;
        }

        // Subscribe with proper VAPID key
        const vapidPublicKey = 'BPrEu_W1yaeALl9pxtj6inBBKvgWP8b018SeTLqE8ThOf9nPHTfPr0C3CpMdae9dD-nMzUqshstmknDtr8C112o';

        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });

        console.log('New subscription created:', subscription);
        return subscription;

    } catch (err) {
        console.error('Failed to subscribe to push:', err);

        // More specific error handling
        if (err.name === 'NotAllowedError') {
            console.error('User denied permission for push notifications');
        } else if (err.name === 'AbortError') {
            console.error('Subscription process was aborted');
        }

        return null;
    }
};

function urlBase64ToUint8Array(base64String) {
    // Ensure the base64 string is properly formatted
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}