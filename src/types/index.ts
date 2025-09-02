/* eslint-disable @typescript-eslint/no-explicit-any */
import { types as mediasoupTypes } from 'mediasoup-client';

export type PlanName = 'Free' | 'Starter' | 'Pro' | 'Business' | 'Enterprise';
export type PlanType = 'Monthly' | 'Yearly';
export type VerificationStatus = 'Pending' | 'Verified' | 'Declined';
export type AccountKind = 'Email' | 'Kingschat';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed';
export type ProducerSource =
  | 'mic'
  | 'camera'
  | 'screen'
  | 'screenAudio'
  | 'sharedVideo'
  | 'sharedAudio';
export type ProducerAudioSource = 'mic' | 'screenAudio' | 'sharedAudio';
export type ProducerVideoSource = 'camera' | 'screen' | 'sharedVideo';
export type Role = 'MODERATOR' | 'SPEAKER' | 'ATTENDEE';
export type Tag =
  | 'Host'
  | 'Co-host'
  | 'Moderator'
  | 'Speaker'
  | 'Spotlighted'
  | 'Attendee';
export type ScheduleOccurrence =
  | 'once'
  | 'daily'
  | 'weekly'
  | 'monthlyday'
  | 'monthlydate'
  | 'yearly'
  | 'custom';
export type SharedMediaType = 'Local' | 'Youtube' | 'mp4' | 'mp3';
export type SizeRatioCategory = 'v' | 'f' | 'h';
export type ScreenSize = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'xxs';
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

export type SelectedPeerAction =
  | 'FullScreenCamera'
  | 'FullScreenDisplay'
  | 'Remove';

// export enum SelectedPeerAction {
//     FullScreenCamera = "FULL_SCREEN_CAMERA",
//     FullScreenDisplay = "FULL_SCREEN_DISPLAY",
//     Remove = "REMOVE",
// }

export enum Access {
  Allowed = 'ALLOWED',
  Declined = 'DECLINED',
  Waiting = 'WAITING',
  Visiting = 'VISITING', // have click join button
}

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

export interface GridSizeRatio {
  threshold: number;
  sizeKey: ScreenSize;
}

export interface RatioCategoryGridItemOptions {
  category: SizeRatioCategory;
  // screenSize: ScreenSize,
  width: number;
  item: number;
}

export interface SizeRatioCategoryOption {
  ratio: number;
  category: SizeRatioCategory;
}

export interface ContainerSize {
  width: number;
  height: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  color?: string;
  kingschatUID?: string;
  verification: VerificationStatus;
  status?: string;
  deleted?: boolean;
  suspended?: boolean;
  address?: string;
  jobTitle?: string;
  department?: string;
  organization?: string;
  refreshToken?: string;
  accounts: Array<{
    kind: AccountKind;
    uid: string;
    password: string;
  }>;
  plan: {
    name: PlanName;
    type: PlanType;
    duration: number;
    start: number;
    end: number;
  };
}

export interface MeetingType {
  id: string;
  title: string;
  meetingId: string;
  description?: string;
  hostUser: Partial<User>;
  coHostUserEmails?: string[];
  guestUserEmails?: string[];
  passcode?: number | null;
  requestedInfo?: {
    label: string;
    required: boolean;
  };
  allowWaiting?: boolean;
  allowAnyUserStart?: boolean;
  focusMode?: boolean;
  deactivated?: boolean;
  isPrivate?: boolean;
  records?: [string];
  sessions?: [string];
}

export interface MeetingInfo {
  startTimestamp?: number;
  isRecording?: boolean;
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
  sender: Peer;
  receiver?: Peer;
  isFile?: boolean;
  isPrivate?: boolean;
  isPinned?: boolean;
  createdAt: number;
}

export interface Peer {
  id: string;
  name: string;
  lowerName?: string;
  userId?: string;
  email?: string;
  color?: string;
  kingschatId?: string;
  reconnecting?: boolean;
  roles?: Role[];
  tag?: Tag;
  photo?: string;
  spotlighted?: boolean;
  isMobileDevice?: boolean;

  mic?: boolean;
  camera?: boolean;
  screen?: boolean;
  screenAudio?: boolean;
  cameraMuted?: boolean;
  isSpeaking?: boolean;
  lastSpeechTimestamp?: number;
  hand?: {
    raised: boolean;
    timestamp?: number;
  };
  reaction?: {
    name: ReactionName;
    timestamp?: number;
  };
}

export type Waiter = Peer;

export interface Plan {
  id: string;
  name: PlanName;
  users: number;
  price: {
    monthly: number;
    yearly: number;
  };
  features: [
    {
      key: string;
      value: string;
    },
  ];
}

export interface Payment {
  id: string;
  userId: string;
  reference: string;
  espeesRef: string;
  plan: {
    name: PlanName;
    type: PlanType;
    duration: number;
    start: number;
    end: number;
  };
  price: number;
  narration: string;
  status: PaymentStatus;
  gateway: 'Espees';
}

export interface SocketConnectionOptions {
  authkey: string;
  meetingId?: string;
  userId?: string;
  passcode?: string;
}

export interface Session {
  id: string;
  meeting: Partial<MeetingType>;
  title: string;
  isOngoing: boolean;
  start: number;
  end?: number;
  attendees?: Attendee[];
  records?: string[];
}

export interface Recording {
  id: string;
  meeting: Partial<MeetingType>;
  s3key: string;
  start: number;
  isPublic: boolean;
}

export interface Attendee {
  id: string;
  name: string;
  email?: string;
  info?: string;
  joined: number;
}

export interface ScheduleEvent {
  scheduleId: string;
  meeting: Partial<MeetingType>;
  start: Date;
  end: Date;
}

export interface Schedule {
  id: string;
  meeting: Partial<MeetingType>;
  invitees: string[];
  start: Date;
  end: Date;
  timezone: string;
  occurrence: ScheduleOccurrence;
  events: [
    {
      start: Date;
      end: Date;
    },
  ];
}

export interface ConsumerOptions {
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

export interface ConsumerStateOptions {
  consumerId: string;
  producerPeerId: string;
  producerSource: ProducerSource;
  fromProducer?: boolean;
}

export interface SharedMedia {
  peerId: string;
  url: string;
  type: SharedMediaType;
  paused?: boolean;
  time?: number;
}

export interface ProducerSourceStateOptions {
  peerId: string;
  source: ProducerSource;
  state: boolean;
}

// export interface EmojiReaction {
//     id: string;
//     reaction?: {
//         name: ReactionName,
//         timestamp: number
//     }
//     peerName: string;
//     peerId: string;
//     position: `${number}%`
// }

export interface EmojiReaction {
  id: string;
  name: ReactionName;
  peerId: string;
  peerName: string;
  position: `${number}%`;
  timestamp: number;
  bottom?: `${number}%`;
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
