import { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { MoreVertical, Video, VideoOff } from 'lucide-react';

const Camera = () => {
  const [isCameraOn, setIsCameraOn] = useState(true);

  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={() => setIsCameraOn(!isCameraOn)}
        variant="ghost"
        size="icon"
        className={cn(
          'w-12 h-12 rounded-xl transition-all duration-200',
          isCameraOn
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        )}
      >
        {isCameraOn ? (
          <Video className="w-5 h-5" />
        ) : (
          <VideoOff className="w-5 h-5" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Camera;
