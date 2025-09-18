import type { AckCallbackData, MessageData } from '@/types';
import { Actions } from '@/types/actions';
import socketIOClient, { Socket } from 'socket.io-client';

export interface SocketConnectionOptions {
  authkey: string;
  roomId?: string;
  userId?: string;
  passcode?: string;
}

export enum ConnectionState {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
  Reconnecting = 'reconnecting',
  Error = 'error',
}

class SignalingService {
  private connection: Socket;
  private connectionState: ConnectionState = ConnectionState.Disconnected;

  constructor(connection: Socket) {
    this.connection = connection;
    this.setupEventHandlers();
  }

  static connect(
    url: string,
    options: SocketConnectionOptions
  ): SignalingService {
    const connection = socketIOClient(url, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      query: {
        meetingId: options.roomId,
        passcode: options.passcode,
        userId: options.userId,
      },
      auth: {
        key: options.authkey,
      },
    });
    return new SignalingService(connection);
  }

  getConnection(): Socket {
    return this.connection;
  }
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }
  isConnected(): boolean {
    return this.connectionState === ConnectionState.Connected;
  }

  message<T = { [key: string]: unknown }>(
    message: MessageData
  ): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.connection.emit(
        Actions.Message,
        message,
        (res: AckCallbackData<T>) => {
          console.log('AckCallbackData', res);
          if (res.status === 'error') {
            reject(res?.error || 'Unknown error');
          } else {
            console.log(message.action, res.response);
            resolve(res.response);
          }
        }
      );
    });
  }

  private setupEventHandlers(): void {
    this.connection.on('connect', () => {
      this.connectionState = ConnectionState.Connected;
    });

    this.connection.on('disconnect', reason => {
      console.log('Socket disconnected:', reason);
      this.connectionState = ConnectionState.Disconnected;
    });

    this.connection.on('connect_error', error => {
      console.error('Socket connection failed:', error);
      this.connectionState = ConnectionState.Error;
    });

    this.connection.on('reconnecting', attemptNumber => {
      console.log(`Reconnecting attempt ${attemptNumber}`);
      this.connectionState = ConnectionState.Reconnecting;
    });

    this.connection.on('reconnect', attemptNumber => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
      this.connectionState = ConnectionState.Connected;
    });

    this.connection.on('reconnect_failed', () => {
      console.error('Reconnection failed');
      this.connectionState = ConnectionState.Error;
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
