import type Pusher from 'pusher-js';

declare global {
    interface PusherStatic {
        instances: Pusher[];
        ready: () => void;
        logToConsole: boolean;
    }

    interface Window {
        Pusher: typeof Pusher;
        JSPM: any;
    }
}