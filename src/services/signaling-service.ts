import type { AckCallbackData, MessageData } from '@/types';
import { Actions } from '@/types/actions';
import socketIOClient, { Socket } from 'socket.io-client';

export interface SocketConnectionOptions {
  authkey: string;
  roomId?: string;
  userId?: string;
  passcode?: string;
}

class SignalingService {
  public connection: Socket;

  constructor(url: string, options: SocketConnectionOptions) {
    this.connection = socketIOClient(url, {
      transports: ['websocket'],
      query: {
        meetingId: options.roomId,
        passcode: options.passcode,
        userId: options.userId,
      },
      auth: {
        key: options.authkey,
      },
    });

    // Add connection error handling
    this.connection.on('connect_error', error => {
      console.error('Socket connection failed:', error);
    });

    this.connection.io.on('reconnect_failed', () => {
      this.disconnect();
      window.location.reload();
    });
  }

  message<T = { [key: string]: unknown }>(message: MessageData): Promise<T> {
    return new Promise((resolve, reject) => {
      this.connection.emit(
        Actions.Message,
        message,
        (res: AckCallbackData<T>) => {
          if (res.status === 'error') {
            reject(res?.error || 'Unknown error');
          } else if (res.response !== undefined) {
            resolve(res.response);
          } else {
            // Handle unexpected response format
            reject('Invalid response format');
          }
        }
      );
    });
  }

  // Add cleanup method
  disconnect(): void {
    if (this.connection) {
      this.connection.disconnect();
    }
  }
}

export default SignalingService;
