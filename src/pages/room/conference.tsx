import React, { useCallback, useEffect, useState } from 'react';

import ControlBar from '@/components/conference/control-bar';
import Header from '@/components/conference/header';
import { VideoConferencingGrid } from '@/components/conference/grid/video-conferencing-grid';
import type { Participant } from '@/types';
import {
  createParticipant,
  generateSampleParticipants,
  participantsName,
} from '@/lib/utils';
import { usePeerMe, useRoomData } from '@/store/conf/hooks';
import { useSignaling } from '@/hooks/use-signaling';
import { useMedia } from '@/hooks/use-media';
import { Actions } from '@/types/actions';

export const Conference: React.FC = () => {
  const peerMe = usePeerMe();
  const roomData = useRoomData();
  const { signalingService } = useSignaling();
  const { mediaService } = useMedia();

  const [participants, setParticipants] = useState<Participant[]>(
    generateSampleParticipants(1)
  );

  const [chatOn, setChatOn] = useState(false);

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

  const toggleChat = useCallback(() => {
    setChatOn(prev => !prev);
  }, [chatOn]);

  const joinRoom = async () => {};

  useEffect(() => {
    const setup = async () => {
      if (!peerMe || !signalingService || !mediaService) return;
      try {
        const result = await signalingService.message({
          action: Actions.JoinRoom,
          args: {
            roomId: roomData?.roomId,
            peerData: peerMe,
            rtpCapabilities: mediaService.getDeviceRtpCapabilities(),
          },
        });

        console.log(Actions.JoinRoom, result);
      } catch (error) {
        console.log(error);
      }
    };
    setup();
  }, []);

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
        showChat={chatOn}
      />

      {/* Bottom Controls */}
      <ControlBar onToggleChat={toggleChat} />
    </div>
  );
};

export default Conference;
