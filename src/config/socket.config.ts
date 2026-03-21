import { env } from './env';

export const socketConfig = {
    url: env.socketUrl,
    options: {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        transports: ['polling', 'websocket'],
    },
};
