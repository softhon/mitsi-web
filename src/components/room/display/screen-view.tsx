import { cn } from '@/lib/utils';
import { usePeerScreens, useScreenOn } from '@/store/conf/hooks';
import MyScreen from '../grid/my-screen';
import PeerScreen from '../grid/peer-screen';

const ScreenView = () => {
  const peerScreens = usePeerScreens();
  const screenOn = useScreenOn();

  return (
    <div
      className={cn(
        'lg:ml-2 bg-black rounded-2xl ',
        peerScreens.length || screenOn ? 'w-5/6' : 'w-0'
      )}
    >
      {screenOn ? <MyScreen /> : <PeerScreen />}
    </div>
  );
};

export default ScreenView;
