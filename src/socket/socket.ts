import { socketConfig } from '../config/socket.config';
import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;

    connect(accessToken: string) {
        const auth = { token: `Bearer ${accessToken}` };

        if (!this.socket) {
            this.socket = io(socketConfig.url, {
                ...socketConfig.options,
                auth,
            });
        } else {
            this.socket.auth = auth;
        }

        if (!this.socket.connected) {
            this.socket.connect();
        }

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        return this.socket;
    }

    emit(event: string, data: any) {
        this.socket?.emit(event, data);
    }

    on(event: string, callback: (data: any) => void) {
        this.socket?.on(event, callback);
    }

    off(event: string, callback?: (data: any) => void) {
        this.socket?.off(event, callback);
    }
}

export const socketService = new SocketService();
export default socketService;
