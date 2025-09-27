import { usePeerOthersList, useRoomData } from '@/store/conf/hooks';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const roomData = useRoomData();
  const peerOthersList = usePeerOthersList();

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

              {/* Orbiting particles */}
              <div className="absolute -top-1 left-1/2 w-1 h-1 bg-blue-200/80 rounded-full animate-pulse delay-300" />
              <div className="absolute top-1/2 -right-1 w-0.5 h-0.5 bg-blue-300/60 rounded-full animate-pulse delay-700" />
              <div className="absolute -bottom-1 left-1/2 w-1 h-1 bg-blue-200/80 rounded-full animate-pulse delay-1100" />
              <div className="absolute top-1/2 -left-1 w-0.5 h-0.5 bg-blue-300/60 rounded-full animate-pulse delay-1500" />
            </div>
          </div>

          {/* Floating accent dots around spinner */}
          <div className="absolute -top-8 left-1/2 w-1 h-1 bg-blue-300/50 rounded-full animate-pulse delay-2000" />
          <div className="absolute top-1/2 -right-8 w-1.5 h-1.5 bg-purple-300/40 rounded-full animate-pulse delay-2300" />
          <div className="absolute -bottom-8 left-1/2 w-1 h-1 bg-cyan-300/60 rounded-full animate-pulse delay-1800" />
          <div className="absolute top-1/2 -left-8 w-1.5 h-1.5 bg-indigo-300/35 rounded-full animate-pulse delay-2500" />
        </div>
      </div>

      <div className="space-y-2 relative">
        <h1 className="text-4xl font-semibold text-white relative">
          {roomData?.name}
          {/* Subtle glow particles around title */}
          <div className="absolute -top-2 left-8 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse delay-1200" />
          <div className="absolute -bottom-1 right-12 w-0.5 h-0.5 bg-purple-300/50 rounded-full animate-pulse delay-1600" />
        </h1>
        <div className="text-gray-400 text-lg relative">
          Setup your audio and video before joining
          {/* More subtle particles around subtitle */}
          <div className="absolute top-1/2 -left-4 w-0.5 h-0.5 bg-gray-300/30 rounded-full animate-pulse delay-2100" />
          <div className="absolute top-1/2 -right-4 w-0.5 h-0.5 bg-gray-400/25 rounded-full animate-pulse delay-2800" />
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

          {/* Tiny accent dots on badge */}
          <div className="absolute -top-1 left-2 w-0.5 h-0.5 bg-green-400/60 rounded-full animate-pulse delay-1400" />
          <div className="absolute -bottom-1 right-2 w-0.5 h-0.5 bg-blue-400/50 rounded-full animate-pulse delay-1900" />
        </Badge>

        {/* Floating elements around badge */}
        <div className="absolute -top-3 left-1/4 w-1 h-1 bg-gray-400/30 rounded-full animate-pulse delay-2400" />
        <div className="absolute -bottom-3 right-1/4 w-1 h-1 bg-gray-300/35 rounded-full animate-pulse delay-2700" />
      </div>
    </div>
  );
};

export default Header;
