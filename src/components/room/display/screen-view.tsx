import { cn } from '@/lib/utils';
import { usePeerScreens } from '@/store/conf/hooks';

const ScreenView = () => {
  const peerScreens = usePeerScreens();

  return (
    <div
      className={cn(
        ' bg-black w-0  rounded-2xl ',
        peerScreens.length && 'w-5/6'
      )}
    ></div>
  );
};

export default ScreenView;
