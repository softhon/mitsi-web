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

  emit(eventType: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.emit(
        'message',
        { eventType, data },
        (error: any, response: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        }
      );
    });
  }
}

export default SignalingService;
