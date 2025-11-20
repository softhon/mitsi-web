import { types as mediasoupTypes } from 'mediasoup-client';

import type {
  GridCalculatorConfig,
  Participant,
  ProducerSource,
} from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import config from '@/config';
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEFAULT_GRID_CONFIG: GridCalculatorConfig = {
  aspectRatios: [
    { ratio: 1 / 1, name: '1:1' },
    { ratio: 4 / 3, name: '4:3' },
    // { ratio: 3 / 4, name: '3:4' },
    { ratio: 5 / 4, name: '5:4' },
    { ratio: 16 / 9, name: '16:9' },
    { ratio: 16 / 10, name: '16:10' },
  ],
  minSize: 150,
  gap: 12,
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const createParticipant = (name: string): Participant => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    isMuted: Math.random() > 0.5,
    hasVideo: Math.random() > 0.5,
  };
};

export const setPeerId = (peerId: string) => {
  if (config.isDevMode) {
    sessionStorage.setItem('peerId', peerId);
    return;
  }
  localStorage.setItem('peerId', peerId);
};

export const getPeerId = () => {
  let peerId = config.isDevMode
    ? sessionStorage.getItem('peerId')
    : localStorage.getItem('peerId');
  if (!peerId) {
    const newPeerId = uuidv4();
    setPeerId(newPeerId);
    peerId = newPeerId;
  }
  return peerId;
};

export const participantsName = [
  'Alice Johnson',
  'Bob Smith',
  'Carol Davis',
  'David Wilson',
  'Eva Martinez',
  'Frank Brown',
  'Grace Lee',
  'Henry Taylor',
  'Ivy Chen',
  'Jack Anderson',
  'Kate Miller',
  'Liam Garcia',

  // Added 50 more
  'Mia Robinson',
  'Noah Thompson',
  'Olivia White',
  'Paul Harris',
  'Quinn Adams',
  'Ruby Clark',
  'Samuel Lewis',
  'Tina Walker',
  'Uma Scott',
  'Victor Young',
  'Wendy King',
  'Xander Wright',
  'Yara Lopez',
  'Zane Hall',
  'Amelia Allen',
  'Benjamin Hill',
  'Chloe Green',
  'Daniel Baker',
  'Ella Nelson',
  'Felix Carter',
  'Gabriella Mitchell',
  'Hugo Perez',
  'Isabella Roberts',
  'Jonas Turner',
  'Kylie Phillips',
  'Lucas Campbell',
  'Mason Rivera',
  'Nina Parker',
  'Oscar Evans',
  'Penelope Edwards',
  'Quentin Collins',
  'Ryan Stewart',
  'Sophia Sanchez',
  'Thomas Morris',
  'Ursula Rogers',
  'Vanessa Cook',
  'William Reed',
  'Ximena Morgan',
  'Yusuf Bell',
  'Zoey Cooper',
  'Aaron Flores',
  'Bianca Bailey',
  'Caleb Hughes',
  'Diana Kelly',
  'Ethan Howard',
  'Fiona Ward',
  'George Cox',
  'Harper Richardson',
  'Isla Torres',
  'Jayden Price',
  'Khloe Bennett',
  'Logan Gray',
];

export const generateSampleParticipants = (
  count: number = 6
): Participant[] => {
  return Array.from({ length: count }, (_, i) =>
    createParticipant(participantsName[i] || `User ${i + 1}`)
  );
};

export const getSimulcastEncoding = (source: ProducerSource) => {
  // Simulcast encodings for camera, sharedVideo and screen sharing
  const encodings: mediasoupTypes.RtpEncodingParameters[] =
    source === 'screen'
      ? [
          {
            rid: 'r0',
            maxBitrate: 200000,
            scaleResolutionDownBy: 8.0, // ~240x135 for 1080p, ~180x90 for 720p
            maxFramerate: 10,
            priority: 'low', // Explicitly use literal type
            networkPriority: 'low',
          },
          {
            rid: 'r1',
            maxBitrate: 600000,
            scaleResolutionDownBy: 2.0, // ~960x540 for 1080p, ~640x360 for 720p
            maxFramerate: 20,
            priority: 'medium',
            networkPriority: 'medium',
          },
          {
            rid: 'r2',
            maxBitrate: 2000000,
            scaleResolutionDownBy: 1.0, // 1920x1080 or 1280x720
            maxFramerate: 30,
            priority: 'high',
            networkPriority: 'high',
          },
        ]
      : [
          {
            rid: 'r0',
            maxBitrate: 150000,
            scaleResolutionDownBy: 4.0, // ~480x270 for 1080p, ~360x180 for 720p
            maxFramerate: 15,
            priority: 'low',
            networkPriority: 'low',
          },
          {
            rid: 'r1',
            maxBitrate: 600000,
            scaleResolutionDownBy: 2.0, // ~960x540 for 1080p, ~640x360 for 720p
            maxFramerate: 24,
            priority: 'medium',
            networkPriority: 'medium',
          },
          {
            rid: 'r2',
            maxBitrate: 1800000,
            scaleResolutionDownBy: 1.0, // 1920x1080 or 1280x720
            maxFramerate: 30,
            priority: 'high',
            networkPriority: 'high',
          },
        ];

  return encodings;
};

export const videoConstraints = (deviceId: string) => ({
  video: {
    deviceId: deviceId ? { exact: deviceId } : undefined,
    height: {
      ideal: 480,
      max: 720,
      min: 240,
    },
    width: {
      ideal: 854,
      max: 1280,
      min: 320,
    },
    frameRate: {
      ideal: 24,
      max: 30,
      min: 15,
    },
  },
});

export const audioContraints = (deviceId: string) => ({
  audio: {
    deviceId: deviceId ? { exact: deviceId } : undefined,
    echoCancellation: { ideal: true },
    noiseSuppression: { ideal: true },
  },
});

export const convertTimestampTo12HourTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const period = hour >= 12 ? 'PM' : 'AM';

  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  const paddedHours = formattedHour < 10 ? '0' + formattedHour : formattedHour;
  const paddedMinute = minute < 10 ? '0' + minute : minute;

  return paddedHours + ':' + paddedMinute + ' ' + period;
};
