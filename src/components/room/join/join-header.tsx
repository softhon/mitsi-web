import { usePeerOthersValues, useRoomData } from '@/store/conf/hooks';
import { Info, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Header = () => {
  const roomData = useRoomData();
  const peerOthersList = usePeerOthersValues();

  return (
    <div className="text-center space-y-4">
      {/* Enhanced Loading Spinner Icon */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Outer pulsing ring */}
          <div className="absolute -inset-4 w-20 h-20 border border-blue-500/10 rounded-full animate-pulse delay-1000" />
          <div className="absolute -inset-2 w-16 h-16 border border-blue-500/20 rounded-full animate-pulse delay-500" />

          {/* Main spinner container */}
          <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 relative">
            <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-lg">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 relative">
        <div className="flex justify-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white">
            {roomData?.roomId}
          </h1>
          <Tooltip>
            <TooltipTrigger>
              <sup>
                <Info size={18} />
              </sup>
            </TooltipTrigger>
            <TooltipContent>
              <p>Meeting Id, Click to copy invitation</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="text-gray-400 md:text-lg relative">
          Setup your audio and video before joining
        </div>
      </div>

      {/* Enhanced Status Badge */}
      <div className="relative">
        <Badge
          variant="outline"
          className="bg-gray-800/50 text-gray-300 border-gray-600 relative"
        >
          {peerOthersList.length
            ? `${peerOthersList.length} people have joined`
            : 'You are the first to join'}
        </Badge>
      </div>
    </div>
  );
};

export default Header;
