import React from 'react';
import { MicOff, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ControlBar from '@/components/conference/control-bar';
import Header from '@/components/conference/header';

interface Participant {
  id: string;
  name: string;
  isCurrentUser?: boolean;
  isMuted?: boolean;
  hasVideo?: boolean;
  avatar?: string;
  isActive?: boolean;
}

const participants: Participant[] = [
  {
    id: '1',
    name: 'James',
    hasVideo: true,
    isMuted: false,
    isActive: true,
  },
  {
    id: '2',
    name: 'Karen A',
    hasVideo: true,
    isMuted: true,
  },
  {
    id: '3',
    name: 'Joy',
    hasVideo: true,
    isMuted: false,
  },
  {
    id: '4',
    name: 'Rita B',
    isCurrentUser: true,
    hasVideo: true,
    isMuted: false,
  },
  {
    id: '5',
    name: 'Karen A',
    hasVideo: false,
    isMuted: false,
    avatar: 'KA',
  },
];

interface VideoTileProps {
  participant: Participant;
  className?: string;
}

const VideoTile: React.FC<VideoTileProps> = ({ participant, className }) => {
  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden bg-gray-800 border',
        participant.isActive ? 'border-blue-500 border-2' : 'border-gray-600',
        className
      )}
    >
      {participant.hasVideo ? (
        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
          {/* Placeholder for actual video stream */}
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
            Video Stream for {participant.name}
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
          <div className="text-white font-semibold text-2xl">
            {participant.avatar ||
              participant.name
                .split(' ')
                .map(n => n[0])
                .join('')}
          </div>
        </div>
      )}

      {/* Name Label */}
      <div className="absolute bottom-3 left-3">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-sm font-medium">
          {participant.name} {participant.isCurrentUser ? '(You)' : ''}
        </div>
      </div>

      {/* Mic Status */}
      {participant.isMuted && (
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center">
            <MicOff className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      {/* Active Speaker Indicator */}
      {participant.isActive && (
        <div className="absolute top-3 left-3">
          <div className="w-8 h-8 bg-green-500/80 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

const VideoConferencingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Video Grid */}
      <div className="flex-1 p-4">
        <div className="h-full grid grid-cols-2 gap-4">
          {/* Main speaker - James (larger) */}
          <VideoTile
            participant={participants[0]}
            className="col-span-1 row-span-1"
          />

          {/* Karen A */}
          <VideoTile
            participant={participants[1]}
            className="col-span-1 row-span-1"
          />

          {/* Joy */}
          <VideoTile
            participant={participants[2]}
            className="col-span-1 row-span-1"
          />

          {/* Rita B (You) */}
          <VideoTile
            participant={participants[3]}
            className="col-span-1 row-span-1"
          />
        </div>

        {/* Side participant - Karen A (avatar) */}
        <div className="absolute top-20 right-8 w-20 h-20">
          <VideoTile participant={participants[4]} />
        </div>
      </div>

      {/* Bottom Controls */}
      <ControlBar />
    </div>
  );
};

export default VideoConferencingPage;
