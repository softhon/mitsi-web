import { MoreVertical, Video, VideoOff } from 'lucide-react';
import MediaControlButton from '../media-control-button';
import { useCameraActions, useCameraOn } from '@/store/conf/hooks';
import { Button } from '../ui/button';

const Camera = () => {
  const cameraOn = useCameraOn();

  const cameraActions = useCameraActions();
  return (
    <div className="flex items-center gap-2">
      <MediaControlButton
        isActive={cameraOn}
        onClick={() => cameraActions.toggle()}
      >
        {cameraOn ? (
          <Video className="w-5 h-5" />
        ) : (
          <VideoOff className="w-5 h-5" />
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

export default Camera;
