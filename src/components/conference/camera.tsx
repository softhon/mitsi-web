import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Video, VideoOff } from 'lucide-react';
import MediaDeviceDropdown from '../media-device-dropdown';
import { requestMediaPermissions, type MediaPermissionsError } from 'mic-check';
import { DEVICE_ERRORS } from '@/lib/constants';
import {
  useCameraActions,
  useCameraDeviceId,
  useCameraDevices,
  useCameraOn,
} from '@/store/conf/hooks';
import { useMedia } from '@/hooks/use-media';

const Camera = () => {
  const { mediaService, startUserMedia, stopUserMedia } = useMedia();

  const cameraOn = useCameraOn();
  const cameraDeviceId = useCameraDeviceId();
  const cameraDevices = useCameraDevices();
  const cameraActions = useCameraActions();

  const requestCameraPermission = () => {
    requestMediaPermissions({ audio: false, video: true })
      .then(async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputDevices = devices.filter(
          device => device.kind === 'audioinput'
        );
        if (!audioInputDevices.length) throw 'Device not found';
        cameraActions.setDeviceId(audioInputDevices[0].deviceId);
        cameraActions.setDevices(audioInputDevices);
      })
      .catch((err: MediaPermissionsError) => {
        const type = err?.type || 'DeviceNotFound';
        return alert(DEVICE_ERRORS[type]('camera'));
      });
  };

  const toggleCamera = async () => {
    if (!mediaService) return console.log('Media service not intialised');
    if (!cameraDeviceId) return requestCameraPermission();
    try {
      if (cameraOn) await stopUserMedia('camera');
      else await startUserMedia('camera', cameraDeviceId);
      cameraActions.toggle();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={toggleCamera}
        variant="ghost"
        size="icon"
        className={cn(
          'w-12 h-12 rounded-xl transition-all duration-200',
          cameraOn
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        )}
      >
        {cameraOn ? (
          <Video className="w-5 h-5" />
        ) : (
          <VideoOff className="w-5 h-5" />
        )}
      </Button>
      {/* <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300"
      >
        <MoreVertical className="w-4 h-4" />
      </Button> */}
      <MediaDeviceDropdown
        devices={cameraDevices}
        selectedDeviceId={cameraDeviceId}
        source="camera"
      />
    </div>
  );
};

export default Camera;
