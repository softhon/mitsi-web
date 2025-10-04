import RoomProvider from '@/providers/room-provider';
import JoinRoom from './join';
import { ServiceProvider } from '@/context/service-context';
import { useRoomAccess } from '@/store/conf/hooks';
import { Access } from '@/types';
import Conference from './conference';

const Room = () => {
  const roomAccess = useRoomAccess();
  return (
    <ServiceProvider>
      <RoomProvider>
        {roomAccess === Access.Allowed ? <Conference /> : <JoinRoom />}
      </RoomProvider>
    </ServiceProvider>
  );
};

export default Room;
