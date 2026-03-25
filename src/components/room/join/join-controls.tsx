import { Button } from '@/components/ui/button';
import { Monitor, Settings } from 'lucide-react';
import { useEffect } from 'react';
import { useMedia } from '@/hooks/use-media';
import Mic from '../mic';
import Camera from '../camera';
import { useSettingsActions } from '@/store/conf/hooks';
import { toast } from 'sonner';

const Controls = () => {
  const { requestCameraAndMicPermissions } = useMedia();
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const [cam, mic] = await Promise.all([
          navigator.permissions.query({ name: 'camera' as PermissionName }),
          navigator.permissions.query({ name: 'microphone' as PermissionName }),
        ]);
        if (cam.state === 'denied' || mic.state === 'denied') {
          const which = cam.state === 'denied' && mic.state === 'denied'
            ? 'camera and microphone'
            : cam.state === 'denied' ? 'camera' : 'microphone';
          toast.error(`${which.charAt(0).toUpperCase() + which.slice(1)} access blocked`, {
            description: `Allow access to your ${which} in your browser's site settings, then reload.`,
            duration: 10000,
          });
          return;
        }
      } catch {
        // permissions API not supported — fall through to getUserMedia
      }
      requestCameraAndMicPermissions();
    };
    checkPermissions();
  }, [requestCameraAndMicPermissions]);

  const settingsAction = useSettingsActions();

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
        onClick={settingsAction.toggle}
        variant="ghost"
        size="icon"
        className=" cursor-pointer w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400"
      >
        <Settings className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Controls;
