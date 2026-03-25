import RoomProvider from '@/providers/room-provider';
import JoinRoom from './join';
import { ServiceProvider } from '@/context/service-context';
import { useRoomAccess } from '@/store/conf/hooks';
import { Access } from '@/types';
import Conference from './conference';
import WaitingRoom from '@/components/room/waiting-room';
import { Helmet } from 'react-helmet';
import SettingsModal from '@/components/modals/settings-modal';
import CautionModal from '@/components/modals/caution-modal';
import FullScreenModal from '@/components/modals/fullscreen-modal';
import { useMetricsExposure } from '@/hooks/use-metrics-exposure';

const Room = () => {
  const roomAccess = useRoomAccess();
  useMetricsExposure(); // Expose metrics for load testing
  const description = `You're invited to join meeting on Mitsi - conferencing platform to connect and collaborate`;

  const renderContent = () => {
    if (roomAccess === Access.Allowed) return <Conference />;
    if (roomAccess === Access.Waiting || roomAccess === Access.Declined)
      return <WaitingRoom />;
    return <JoinRoom />;
  };

  return (
    <>
      <Helmet>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
      </Helmet>
      <ServiceProvider>
        <RoomProvider>
          {renderContent()}
          <SettingsModal />
          <CautionModal />
          <FullScreenModal />
        </RoomProvider>
      </ServiceProvider>
    </>
  );
};

export default Room;
