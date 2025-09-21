import { Video, VideoOff } from 'lucide-react';
import MediaControlButton from '../media-control-button';
import {
  useCameraActions,
  useCameraDeviceId,
  useCameraDevices,
  useCameraOn,
} from '@/store/conf/hooks';
import { type MediaPermissionsError, requestMediaPermissions } from 'mic-check';
import { useMedia } from '@/hooks/use-media';
import { DEVICE_ERRORS } from '@/lib/constants';
import MediaDeviceDropdown from '../media-device-dropdown';

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
