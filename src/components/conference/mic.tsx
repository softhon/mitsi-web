import { Mic as MicOn, MicOff } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import {
  useMicActions,
  useMicDeviceId,
  useMicDevices,
  useMicOn,
} from '@/store/conf/hooks';
import MediaDeviceDropdown from '../media-device-dropdown';
import { useMedia } from '@/hooks/use-media';

const Mic = () => {
  const { mediaService, startUserMedia, requestMicPermission } = useMedia();
  const micOn = useMicOn();
  const micDeviceId = useMicDeviceId();
  const micDevices = useMicDevices();
  const micActions = useMicActions();

  const toggleMic = async () => {
    if (!mediaService) return console.log('Media service not intialised');
    if (!micDeviceId) return requestMicPermission();

    try {
      if (!micOn) await startUserMedia('mic', micDeviceId);
      micActions.toggle();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={toggleMic}
        variant="ghost"
        size="icon"
        className={cn(
          'w-12 h-12 rounded-xl transition-all duration-200',
          micOn
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        )}
      >
        {micOn ? <MicOn className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </Button>
      {/* <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300"
      >
        <MoreVertical className="w-4 h-4" />
      </Button> */}
      <MediaDeviceDropdown
        devices={micDevices}
        selectedDeviceId={micDeviceId}
        source="mic"
      />
    </div>
  );
};

export default Mic;
