import { Video, VideoOff } from 'lucide-react';
import MediaDeviceDropdown from '../media-device-dropdown';

import {
  useCameraDeviceId,
  useCameraDevices,
  useCameraOn,
} from '@/store/conf/hooks';
import { useMedia } from '@/hooks/use-media';
import MediaControlButton from '../media-control-button';

const Camera = () => {
  const { toggleCamera } = useMedia();

  const cameraOn = useCameraOn();
  const cameraDeviceId = useCameraDeviceId();
  const cameraDevices = useCameraDevices();

  return (
    <div className="flex items-center gap-2">
      <MediaControlButton isActive={cameraOn} onClick={toggleCamera}>
        {cameraOn ? (
          <Video className="w-5 h-5" />
        ) : (
          <VideoOff className="w-5 h-5" />
        )}
      </MediaControlButton>

      <MediaDeviceDropdown
        devices={cameraDevices}
        selectedDeviceId={cameraDeviceId}
        source="camera"
      />
    </div>
  );
};

export default Camera;
