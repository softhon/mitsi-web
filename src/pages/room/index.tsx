import RoomProvider from '@/providers/room-provider';
import JoinRoom from './join';
import { ServiceProvider } from '@/context/service-context';
import { useRoomAccess } from '@/store/conf/hooks';
import { Access } from '@/types';
import Conference from './conference';
import { Helmet } from 'react-helmet';

const Room = () => {
  const roomAccess = useRoomAccess();
  const description =
    'You are invited to meeting on Mitsi conferencing platform to connect and collaborate ';

  return (
    <>
      <Helmet>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
      </Helmet>
      <ServiceProvider>
        <RoomProvider>
          {roomAccess === Access.Allowed ? <Conference /> : <JoinRoom />}
        </RoomProvider>
      </ServiceProvider>
    </>
  );
};

export default Room;
