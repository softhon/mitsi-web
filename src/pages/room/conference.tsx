import React, { useCallback, useEffect, useState } from 'react';

import ControlBar from '@/components/conference/control-bar';
import Header from '@/components/conference/header';
import { ConferenceGrid } from '@/components/conference/grid/conference-grid';

import { usePeerActions, usePeerMe, useRoomData } from '@/store/conf/hooks';
import { useSignaling } from '@/hooks/use-signaling';
import { useMedia } from '@/hooks/use-media';
import { Actions } from '@/types/actions';
import type { PeerData, RoomData } from '@/types';

export const Conference: React.FC = () => {
  const peerMe = usePeerMe();
  const roomData = useRoomData();
  const { signalingService } = useSignaling();
  const { mediaService } = useMedia();
  const peerActions = usePeerActions();
  const [chatOn, setChatOn] = useState(false);

  const toggleChat = useCallback(() => {
    setChatOn(prev => !prev);
  }, [chatOn]);

  const joinRoom = async () => {};

  useEffect(() => {
    const setup = async () => {
      if (!peerMe || !signalingService || !mediaService) return;
      try {
        const result = await signalingService.message<{
          peers: PeerData[];
          roomData: RoomData;
        }>({
          action: Actions.JoinRoom,
          args: {
            roomId: roomData?.roomId,
            peerData: peerMe,
            rtpCapabilities: mediaService.getDeviceRtpCapabilities(),
          },
        });

        const peers = result?.peers;
        peerActions.clear();
        if (peers) {
          peerActions.addOthersData(peers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    setup();
  }, []);

  return (
    <div className=" relative h-screen bg-gray-900 flex flex-col overflow-hidden justify-between">
      {/* Header */}
      <Header />

      {/* Main Video Grid */}
      <ConferenceGrid />

      {/* Bottom Controls */}
      <ControlBar onToggleChat={toggleChat} />
    </div>
  );
};

export default Conference;
