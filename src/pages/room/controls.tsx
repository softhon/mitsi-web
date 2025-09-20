import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  useCameraActions,
  useCameraOn,
  useMicActions,
  useMicOn,
} from '@/store/conf/hooks';
import {
  Mic,
  MicOff,
  MoreVertical,
  Settings,
  Video,
  VideoOff,
} from 'lucide-react';
import React from 'react';

interface MediaControlButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const MediaControlButton: React.FC<MediaControlButtonProps> = ({
  isActive,
  onClick,
  children,
  className,
}) => (
  <Button
    onClick={onClick}
    variant="ghost"
    size="icon"
    className={cn(
      'w-12 h-12 rounded-xl transition-all duration-200',
      isActive
        ? 'bg-white/10 hover:bg-white/20 text-white'
        : 'bg-red-500/90 hover:bg-red-500 text-white',
      className
    )}
  >
    {children}
  </Button>
);

const Controls = () => {
  const micOn = useMicOn();
  const cameraOn = useCameraOn();
  const micActions = useMicActions();
  const cameraActions = useCameraActions();

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Microphone Control */}
      <div className="flex items-center gap-2">
        <MediaControlButton
          isActive={micOn}
          onClick={() => micActions.toggle()}
        >
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </MediaControlButton>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Camera Control */}
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

      {/* Screen Share (Disabled) */}
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-gray-500 cursor-not-allowed"
        disabled
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
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
