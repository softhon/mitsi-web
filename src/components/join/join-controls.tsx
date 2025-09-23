import { Button } from '@/components/ui/button';
import { Monitor, Settings } from 'lucide-react';
import { useEffect } from 'react';
import Mic from './join-mic';
import Camera from './join-camera';
import { useMedia } from '@/hooks/use-media';

const Controls = () => {
  const { requestCameraAndMicPermissions } = useMedia();
  useEffect(() => {
    requestCameraAndMicPermissions();
  }, [requestCameraAndMicPermissions]);

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
