import React, { useEffect } from 'react';

import { useSignaling } from '@/hooks/use-signaling';
import { useRoomActions, useRoomData } from '@/store/conf/hooks';
import JoinForm from '@/components/room/join/join-form';
import Terms from '@/components/room/join/join-terms';
import Header from '@/components/room/join/join-header';
import CameraPreview from '@/components/room/join/join-camera-preview';
import Controls from '../../components/room/join/join-controls';
import { useRoom } from '@/hooks/use-room';
import DynamicBg from '@/components/dynamic-bg';
import { useParams } from 'react-router-dom';

const JoinRoom: React.FC = () => {
  const { signalingService } = useSignaling();
  const { joinVisitors } = useRoom();
  const roomData = useRoomData();
  const roomActions = useRoomActions();
  const pathname = useParams();

  useEffect(() => {
    const roomId = pathname['roomId'];
    roomActions.setData({
      // id: crypto.randomUUID(),
      roomId: roomId!,
      name: `room-${roomId}`,
    });
  }, [roomActions, pathname]);

  useEffect(() => {
    if (!signalingService || !roomData) return;

    joinVisitors().catch(err => console.log(err));
  }, [signalingService, roomData, joinVisitors]);

  if (!roomData || !signalingService) return null;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center p-4">
      {/* Background Pattern */}
      <DynamicBg />

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
