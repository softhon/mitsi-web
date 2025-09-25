import React, { useEffect } from 'react';

import { getPeerId } from '@/lib/utils';
import { useSignaling } from '@/hooks/use-signaling';
import { Actions } from '@/types/actions';
import { type PeerData } from '@/types';
import {
  usePeerActions,
  useRoomActions,
  useRoomData,
} from '@/store/conf/hooks';
import JoinForm from '@/components/join/join-form';
import Terms from '@/components/join/terms';
import Header from '@/components/join/join-header';
import CameraPreview from '@/components/join/join-camera-preview';
import Controls from '../../components/join/join-controls';

const JoinRoom: React.FC = () => {
  const { signalingService } = useSignaling();
  const roomData = useRoomData();
  const roomActions = useRoomActions();
  const peerActions = usePeerActions();

  useEffect(() => {
    roomActions.setData({
      id: 'ieieirhhrhur',
      roomId: 'ib34ceb',
      name: 'Days Catch Up',
    });
  }, [roomActions]);

  useEffect(() => {
    if (!signalingService || !roomData) return;
    const JoinVisitor = async () => {
      try {
        peerActions.clear();
        const res = await signalingService.sendMessage<{ peers: PeerData[] }>({
          action: Actions.JoinVisitors,
          args: {
            roomId: roomData.roomId,
            peerId: getPeerId(),
          },
        });
        console.log(Actions.JoinVisitors, res);
        for (const peer of res?.peers || []) {
          peerActions.addData(peer);
        }
      } catch (error) {
        console.log(error);
      }
    };

    JoinVisitor();
  }, [signalingService, roomData, peerActions]);

  if (!roomData || !signalingService) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.1)_0%,transparent_50%)]" />

      <div className="relative z-10 w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <Header />

        {/* Video Preview */}
        <CameraPreview />

        {/* Media Controls */}
        <Controls />
        {/* Name Input and Join Button */}
        <JoinForm />
        {/* Additional Info */}
        <Terms />
      </div>

      {/* Background Decorative Elements */}
      {/* <Decoration /> */}
    </div>
  );
};

export default JoinRoom;
