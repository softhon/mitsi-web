import type { GridCalculatorConfig, Participant } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export const createParticipant = (name: string): Participant => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    isMuted: Math.random() > 0.5,
    hasVideo: Math.random() > 0.5,
  };
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
