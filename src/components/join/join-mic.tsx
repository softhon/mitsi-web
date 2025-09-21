import MediaControlButton from '../media-control-button';
import { useMicActions, useMicDeviceId, useMicOn } from '@/store/conf/hooks';
import { MicOff, Mic as MicphoneOn, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { type MediaPermissionsError, requestMediaPermissions } from 'mic-check';
import { DEVICE_ERRORS } from '@/lib/constants';
import { useMedia } from '@/hooks/use-media';

const Mic = () => {
  const { mediaService, startUserMedia } = useMedia();
  const micOn = useMicOn();
  const micDeviceId = useMicDeviceId();
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
      if (!micOn) startUserMedia('mic', micDeviceId);
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
