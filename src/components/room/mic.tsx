import { Mic as MicOn, MicOff } from 'lucide-react';

import { useMicDeviceId, useMicDevices, useMicOn } from '@/store/conf/hooks';
import MediaDeviceDropdown from './media-device-dropdown';
import { useMedia } from '@/hooks/use-media';
import MediaControlButton from './media-control-button';

const Mic = () => {
  const { toggleMic } = useMedia();
  const micOn = useMicOn();
  const micDeviceId = useMicDeviceId();
  const micDevices = useMicDevices();

  return (
    <div className="flex items-center gap-2">
      <MediaControlButton isActive={micOn} onClick={toggleMic}>
        {micOn ? <MicOn className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
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
