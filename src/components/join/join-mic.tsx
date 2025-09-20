import MediaControlButton from '../media-control-button';
import { useMicActions, useMicOn } from '@/store/conf/hooks';
import { MicOff, Mic as MicphoneOn, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';

const Mic = () => {
  const micOn = useMicOn();
  const micActions = useMicActions();
  return (
    <div className="flex items-center gap-2">
      <MediaControlButton isActive={micOn} onClick={() => micActions.toggle()}>
        {micOn ? (
          <MicphoneOn className="w-5 h-5" />
        ) : (
          <MicOff className="w-5 h-5" />
        )}
      </MediaControlButton>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Mic;
