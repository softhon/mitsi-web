import RoomProvider from '@/providers/room-provider';
import JoinRoom from './join';
import { ServiceProvider } from '@/context/service-context';

const Room = () => {
  return (
    <ServiceProvider>
      <RoomProvider>
        <JoinRoom />
      </RoomProvider>
    </ServiceProvider>
  );
};

export default Room;
