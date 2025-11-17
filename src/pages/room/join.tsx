import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSignaling } from '@/hooks/use-signaling';
import { useRoomActions, useRoomData } from '@/store/conf/hooks';
import JoinForm from '@/components/room/join/join-form';
import Header from '@/components/room/join/join-header';
import CameraPreview from '@/components/room/join/join-camera-preview';
import Controls from '../../components/room/join/join-controls';
import { useRoom } from '@/hooks/use-room';
import DynamicBg from '@/components/dynamic-bg';
// import Terms from '@/components/room/join/join-terms';

const JoinRoom: React.FC = () => {
  const { signalingService } = useSignaling();
  const { joinVisitors } = useRoom();
  const roomData = useRoomData();
  const roomActions = useRoomActions();
  const pathname = useParams();

  useEffect(() => {
    const roomId = pathname['roomId'];
    roomActions.setData({
      roomId: roomId!,
      name: `room-${roomId}`,
    });
  }, [roomActions, pathname]);

  useEffect(() => {
    if (!signalingService || !roomData) return;

    joinVisitors().catch(err => toast.error(err));
  }, [signalingService, roomData, joinVisitors]);

  if (!roomData || !signalingService) return null;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center p-4">
      <DynamicBg />

      <div className="relative z-10 w-full max-w-2xl mx-auto space-y-8">
        <Header />

        <CameraPreview />

        <Controls />

        <JoinForm />

        {/* <Terms /> */}
      </div>
    </div>
  );
};

export default JoinRoom;
