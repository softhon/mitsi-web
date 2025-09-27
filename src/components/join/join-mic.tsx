import MediaControlButton from '../media-control-button';
import {
  useMicActions,
  useMicDeviceId,
  useMicDevices,
  useMicOn,
} from '@/store/conf/hooks';
import { MicOff, Mic as MicphoneOn } from 'lucide-react';
import { useMedia } from '@/hooks/use-media';
import MediaDeviceDropdown from '../media-device-dropdown';

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
    <div className="flex items-center gap-2">
      <MediaControlButton isActive={micOn} onClick={toggleMic}>
        {micOn ? (
          <MicphoneOn className="w-5 h-5" />
        ) : (
          <MicOff className="w-5 h-5" />
        )}
      </MediaControlButton>
      <MediaDeviceDropdown
        devices={micDevices}
        selectedDeviceId={micDeviceId}
        source="mic"
      />
    </div>
  );
};

export default Mic;
