import React, { useEffect } from 'react';

import { useSignaling } from '@/hooks/use-signaling';
import { useRoomActions, useRoomData } from '@/store/conf/hooks';
import JoinForm from '@/components/join/join-form';
import Terms from '@/components/join/terms';
import Header from '@/components/join/join-header';
import CameraPreview from '@/components/join/join-camera-preview';
import Controls from '../../components/join/join-controls';
import { useRoom } from '@/hooks/use-room';

const JoinRoom: React.FC = () => {
  const { signalingService } = useSignaling();
  const { joinVisitors } = useRoom();
  const roomData = useRoomData();
  const roomActions = useRoomActions();

  useEffect(() => {
    roomActions.setData({
      id: 'ieieirhhrhur',
      roomId: 'ib34ceb',
      name: 'Days Catch Up',
    });
  }, [roomActions]);

  useEffect(() => {
    if (!signalingService || !roomData) return;

    joinVisitors().catch(err => console.log(err));
  }, [signalingService, roomData, joinVisitors]);

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
