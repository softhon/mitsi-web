import { types as mediasoupTypes } from 'mediasoup-client';

export type ProducerAudioSource = 'mic' | 'screenAudio';
export type ProducerVideoSource = 'camera' | 'screen';
export type ProducerSource = ProducerAudioSource | ProducerVideoSource;
export type ReactionName =
  | 'raisingHand'
  | 'thumbsUp'
  | 'clap'
  | 'fire'
  | 'partyPopper'
  | 'heartFace'
  | 'hugFace'
  | 'joy'
  | 'cry'
  | 'thinkingFace';

export enum Access {
  Allowed = 'Allowed',
  Declined = 'Declined',
  Waiting = 'Waiting',
  Visiting = 'Visiting', // have click join button
}

export type AckCallbackData<T = { [key: string]: unknown }> = {
  status: 'success' | 'error';
  error?: Error | unknown | null;
  response?: T;
};

export enum ActionType {
  StartRecording = 'START_RECORDING',
  StopRecording = 'STOP_RECORDING',
  LeaveMeeting = 'LEAVE_MEETING',
  EndMeeting = 'END_MEETING',
  RemovePeer = 'REMOVE_PEER',
  Hide = 'HIDE',
}

export type AppData = {
  [key: string]: unknown;
};

export enum SettingsTabName {
  Audio = 'Audio',
  Video = 'Video',
  Notifications = 'Notifications',
}

export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  color?: string;
}
export interface RoomData {
  id: string;
  roomId: string;
  name: string;
}
export interface PrivateChatPeer {
  id: string;
  name: string;
  photo?: string;
  color?: string;
  unread?: number;
  lastMessage?: string;
  lastMessageTimestamp?: number;
  isPrivatePeer?: boolean;
}

export interface Chat {
  id: string;
  text: string;
  sender: PeerData;
  receiver?: PeerData;
  isFile?: boolean;
  isPrivate?: boolean;
  isPinned?: boolean;
  createdAt: number;
}

export interface PeerData {
  id: string;
  name: string;
  lowerName?: string;
  userId?: string;
  email?: string;
  color?: string;
}

export interface PeerMedia {
  id: string;
  mic?: boolean;
  camera?: boolean;
  screen?: boolean;
  screenAudio?: boolean;
  cameraPaused?: boolean;
}

export interface PeerCondition {
  id: string;
  isSpeaking?: boolean;
  isReconnectiing?: boolean;
}

export interface MessageData {
  action: string;
  args?: { [key: string]: unknown };
}

export interface ConsumerData {
  producerPeerId: string;
  producerId: string;
  transportId: string;
  producerSource: ProducerSource;
  id: string;
  kind: mediasoupTypes.MediaKind;
  rtpParameters: mediasoupTypes.RtpParameters;
  type: string; //mediasoup consumer type 'simple' | 'simulcast' | 'svc' | 'pipe';
  appData: any;
  producerPaused: boolean;
}

export interface MediaServiceConfig {
  simulcastEnabled?: boolean;
  svcEnabled?: boolean;
}

export interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  hasVideo: boolean;
  avatarUrl?: string;
}

export interface AspectRatio {
  ratio: number;
  name: string;
}

export interface Layout {
  rows: number;
  cols: number;
  width: number;
  height: number;
  aspectRatio: string;
}

export interface GridCalculatorConfig {
  aspectRatios: AspectRatio[];
  minSize: number;
  gap: number;
}

export interface VideoConferencingGridProps {
  participants: Participant[];
  onAddParticipant?: () => void;
  onRemoveParticipant?: () => void;
  showControls?: boolean;
  showChat?: boolean;
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

export interface ParticipantTileProps {
  participant: Participant;
  layout: Layout;
}

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  show: boolean;
}

export interface PaginationInfoProps {
  currentPage: number;
  participantsPerPage: number;
  totalParticipants: number;
  totalPages: number;
}
