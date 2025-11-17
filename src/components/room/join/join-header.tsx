import { usePeerOthersValues, useRoomData } from '@/store/conf/hooks';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Assets } from '@/assets';
import { useCopyToClipboard } from '@/hooks/use-copy';
import { BASE_URL } from '@/lib/constants';

const Header = () => {
  const roomData = useRoomData();
  const peerOthersList = usePeerOthersValues();
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="text-center space-y-4">
      {/* Enhanced Loading Spinner Icon */}

      <img src={Assets.logo} className="w-14 h-14 mx-auto" alt="Logo" />

      <div className="space-y-2 relative">
        {roomData?.roomId && (
          <div className="flex justify-center">
            <h1
              onClick={() => copy(`${BASE_URL}/${roomData.roomId}`)}
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white cursor-pointer"
            >
              {roomData.roomId}
            </h1>
            <Tooltip>
              <TooltipTrigger>
                <sup className=" cursor-pointer">
                  {copied ? (
                    <Badge className=" bg-green-700/30 text-white">
                      Copied
                    </Badge>
                  ) : (
                    <Info size={18} />
                  )}
                </sup>
              </TooltipTrigger>
              <TooltipContent>
                <p>Meeting Invite, Click to copy</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
        {/* <div className="text-gray-400 md:text-lg relative">
          Setup your audio and video before joining
        </div> */}
      </div>

      {/* Enhanced Status Badge */}
      <div className="relative">
        <Badge
          variant="outline"
          className="bg-gray-800/50 text-gray-300 border-gray-600 relative"
        >
          {peerOthersList.length
            ? `${peerOthersList.length} people have joined`
            : 'You will be the first to join'}
        </Badge>
      </div>
    </div>
  );
};

export default Header;
