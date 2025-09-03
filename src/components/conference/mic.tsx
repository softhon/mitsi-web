import { Mic as MicOn, MicOff, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useMicActions, useMicOn } from '@/store/conf/hooks';

const Mic = () => {
  const micOn = useMicOn();
  const micToggle = useMicActions().toggle;
  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={micToggle}
        variant="ghost"
        size="icon"
        className={cn(
          'w-12 h-12 rounded-xl transition-all duration-200',
          micOn
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        )}
      >
        {micOn ? <MicOn className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
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

export default Mic;
