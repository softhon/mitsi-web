import type { Layout, Participant } from '@/types';
import React from 'react';
import { ParticipantTile } from './participant-tile';

interface GridContainerProps {
  participants: Participant[];
  layout: Layout | null;
}

export const GridContainer: React.FC<GridContainerProps> = ({
  participants,
  layout,
}) => {
  if (participants.length === 0) {
    return (
      <div
        className={`w-full h-full bg-gray-900/95 flex flex-wrap items-center justify-center gap-3 p-4 overflow-hidden `}
      >
        <div className="text-gray-400 text-center">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-lg">No participants in the conference</p>
        </div>
      </div>
    );
  }

  if (!layout) {
    return (
      <div
        className={`w-full h-full bg-gray-900/95 flex flex-wrap items-center justify-center gap-3 p-4 overflow-hidden `}
      >
        <div className="text-gray-400 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p>Unable to fit participants in current container size</p>
          <p className="text-sm mt-2">
            Try reducing the number of participants or increase the window size
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full bg-gray-900/95 flex flex-wrap items-center justify-center content-center gap-3 p-4 overflow-hidden `}
    >
      {participants.map(participant => (
        <ParticipantTile
          key={participant.id}
          participant={participant}
          layout={layout}
        />
      ))}
    </div>
  );
};
