import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import type { ParticipantTileProps } from '@/types';
import { getInitials } from '@/lib/utils';

export const ParticipantTile: React.FC<ParticipantTileProps> = ({
  participant,
  layout,
}) => {
  return (
    <div
      className=" bg-gray-700 rounded-lg overflow-hidden flex flex-col relative transition-all duration-300 ease-in-out"
      style={{ width: `${layout.width}px`, height: `${layout.height}px` }}
    >
      {/* Video/Avatar Area */}
      <div className="flex-1 relative bg-gray-800 flex items-center justify-center">
        {participant.hasVideo ? (
          <div className="w-full h-full bg-gradient-to-br  flex items-center justify-center text-white text-lg font-semibold">
            {participant.avatarUrl ? (
              <img
                src={participant.avatarUrl}
                alt={participant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>Video Feed</span>
            )}
          </div>
        ) : (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #667fea 0%, #0d1db2 100%)',
            }}
          >
            {getInitials(participant.name)}
          </div>
        )}

        {/* Mic Status */}
        <div className="absolute top-2 right-2 p-1 rounded-full bg-black/50">
          {participant.isMuted ? (
            <MicOff className="w-4 h-4 text-red-400" />
          ) : (
            <Mic className="w-4 h-4 text-green-400" />
          )}
        </div>
      </div>

      {/* Name Bar */}
      <div className="bg-gray-700 px-3 py-2 text-white text-sm font-medium truncate">
        {participant.name}
      </div>
    </div>
  );
};
