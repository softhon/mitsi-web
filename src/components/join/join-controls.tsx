import { Button } from '@/components/ui/button';
import { useCameraActions, useMicActions } from '@/store/conf/hooks';
import { Monitor, Settings } from 'lucide-react';
import { useEffect } from 'react';
import { requestMediaPermissions, type MediaPermissionsError } from 'mic-check';
import Mic from './join-mic';
import Camera from './join-camera';

const Controls = () => {
  const micActions = useMicActions();
  const cameraActions = useCameraActions();

  useEffect(() => {
    const getDevices = async () => {
      requestMediaPermissions()
        .catch((err: MediaPermissionsError) => {
          console.log(err);
        })
        .finally(async () => {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioInputDevices = devices.filter(
              device => device.kind === 'audioinput'
            );
            const videoInputDevices = devices.filter(
              device => device.kind === 'videoinput'
            );
            // const audioOutputDevices = devices.filter(
            //   device => device.kind === 'audiooutput'
            // );

            // soundActions.setDeviceId(
            //   audioOutputDevices.length ? audioOutputDevices[0].deviceId : null
            // );
            cameraActions.setDeviceId(
              videoInputDevices.length ? videoInputDevices[0].deviceId : null
            );
            micActions.setDeviceId(
              audioInputDevices.length ? audioInputDevices[0].deviceId : null
            );

            // soundActions.setDevices(audioOutputDevices);
            cameraActions.setDevices(videoInputDevices);
            micActions.setDevices(audioInputDevices);
          } catch (error) {
            console.log(error);
          }
        });
    };
    getDevices();
  }, []);

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Microphone Control */}
      <Mic />
      {/* Camera Control */}
      <Camera />
      {/* Screen Share (Disabled) */}
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-gray-500 cursor-not-allowed"
        disabled
      >
        <Monitor />
      </Button>

      {/* Settings */}
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400"
      >
        <Settings className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Controls;
