export enum Actions {
  Message = 'message',
  Connected = 'connected',
  Disconnect = 'disconnect',
  JoinRoom = 'join_room',
  JoinVisitors = 'join_visitors',
  JoinWaiters = 'join_waiters',
  GetRoomData = 'get_room_data',

  GetRouterRtpCapabilities = 'get_router_rtp_capabilities',
  CreateWebrtcTransports = 'create_webrtc_transports',
  ConnectWebrtcTransports = 'connect_webrtc_transports',
  CreateConsumersOfAllProducers = 'create_consumers_of_all_producers',
  CreateProducer = 'create_producer',
  CloseProducer = 'close_producer',
  PauseProducer = 'pause_producer',
  ResumeProducer = 'resume_producer',
  ResumeConsumer = 'resume_consumer',
  PauseConsumer = 'pause_consumer',
  RestartIce = 'restart_ice',

  CreatePeer = 'create_peer',

  Mute = 'mute',
  OffCamera = 'off_camera',
  StopScreen = 'stop_screen',
  RaiseHand = 'raise_hand',
  LowerHands = 'lower_hands',
  SendChat = 'send_chat',
  SendReaction = 'send_reaction',
  GetWaiters = 'get_waiters',
  AdmitWaiters = 'admit_waiters',
  DeclineWaiters = 'decline_waiters',
  Record = 'Record',

  RemovePeer = 'remove_peer',
  AddRole = 'add_role',
  RemoveRole = 'remove_role',

  EndMeeting = 'end_meeting',

  Heartbeat = 'heartbeat',
  HeartbeatAck = 'heartbeat_ack',
  Ping = 'ping',
  Pong = 'pong',

  // Server management
  ServerShutdown = 'server_shutdown',
  ServerRestart = 'server_restart',

  // Error handling
  Error = 'error',
  ConnectionError = 'connection_error',

  Close = 'close',
}
