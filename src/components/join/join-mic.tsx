import MediaControlButton from '../media-control-button';
import {
  useMicActions,
  useMicDeviceId,
  useMicDevices,
  useMicOn,
} from '@/store/conf/hooks';
import { MicOff, Mic as MicphoneOn } from 'lucide-react';
import { type MediaPermissionsError, requestMediaPermissions } from 'mic-check';
import { DEVICE_ERRORS } from '@/lib/constants';
import { useMedia } from '@/hooks/use-media';
import MediaDeviceDropdown from '../media-device-dropdown';

const Mic = () => {
  const { mediaService, startUserMedia } = useMedia();
  const micOn = useMicOn();
  const micDeviceId = useMicDeviceId();
  const micDevices = useMicDevices();
  const micActions = useMicActions();

  const requestMicPermission = () => {
    requestMediaPermissions({ audio: true, video: false })
      .then(async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputDevices = devices.filter(
          device => device.kind === 'audioinput'
        );
        if (!audioInputDevices.length) throw 'Device not found';
        micActions.setDeviceId(audioInputDevices[0].deviceId);
        micActions.setDevices(audioInputDevices);
      })
      .catch((err: MediaPermissionsError) => {
        const type = err?.type || 'DeviceNotFound';
        return alert(DEVICE_ERRORS[type]('microphone'));
      });
  };

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
