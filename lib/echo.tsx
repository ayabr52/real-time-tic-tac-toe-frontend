import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

window.Pusher = Pusher;

const echoInstance = new Echo<any>({
  broadcaster: 'reverb',
  key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
  wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
  wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
  wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 443,
  forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],
});

export default echoInstance;