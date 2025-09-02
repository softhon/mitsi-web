import React, { useCallback, useState } from 'react';

import ControlBar from '@/components/conference/control-bar';
import Header from '@/components/conference/header';
import { VideoConferencingGrid } from '@/components/conference/grid/video-conferencing-grid';
import type { Participant } from '@/types';
import {
  createParticipant,
  generateSampleParticipants,
  participantsName,
} from '@/lib/utils';

export const VideoConferencingDemo: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>(
    generateSampleParticipants(1)
  );

  const handleAddParticipant = useCallback(() => {
    const newParticipant =
      participants.length - 1 > participantsName.length
        ? createParticipant(`User ${participants.length + 1}`)
        : createParticipant(participantsName[participants.length]);
    setParticipants(prev => [...prev, newParticipant]);
  }, [participants.length]);

  const handleRemoveParticipant = useCallback(() => {
    if (participants.length > 0) {
      setParticipants(prev => prev.slice(0, -1));
    }
  }, [participants.length]);

  return (
    <div className=" relative h-screen bg-gray-900 flex flex-col overflow-hidden justify-between">
      {/* Header */}
      <Header
        onAddParticipant={handleAddParticipant}
        onRemoveParticipant={handleRemoveParticipant}
      />

      {/* Main Video Grid */}
      <VideoConferencingGrid
        participants={participants}
        onAddParticipant={handleAddParticipant}
        onRemoveParticipant={handleRemoveParticipant}
        showControls={true}
      />

      {/* Bottom Controls */}
      <ControlBar />
    </div>
  );
};

export default VideoConferencingDemo;
