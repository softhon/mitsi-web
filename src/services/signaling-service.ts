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
  }

  message<T = { [key: string]: unknown }>(message: MessageData): Promise<T> {
    return new Promise((resolve, reject) => {
      this.connection.emit(
        Actions.Message,
        message,
        (res: AckCallbackData<T>) => {
          if (res.status === 'error') {
            reject(res.error);
          } else if (res.response) {
            resolve(res.response);
          }
        }
      );
    });
  }
}

export default SignalingService;
