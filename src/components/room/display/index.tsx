import Sidebar from '../sidebar';
import MainGrid from './main-grid';
import ScreenView from './screen-view';
import PinGrid from './pin-grid';
import { usePeerSelectedId, useScreenOn, usePeerScreens } from '@/store/conf/hooks';

const Display = () => {
  const selectedId = usePeerSelectedId();
  const screenOn = useScreenOn();
  const peerScreens = usePeerScreens();
  const hasScreenShare = screenOn || peerScreens.length > 0;
  const showPinGrid = !!selectedId && !hasScreenShare;

  return (
    <div
      className={`${'fixed inset-0  pt-4 pb-18 px-3 h-full w-full  overflow-hidden '}`}
    >
      <div className="relative h-full w-full flex flex-col lg:flex-row justify-between ">
        <ScreenView />
        {showPinGrid ? <PinGrid /> : <MainGrid />}
        <Sidebar />
      </div>
    </div>
  );
};

export default Display;
