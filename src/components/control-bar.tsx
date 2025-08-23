import { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MoreVertical,
  Monitor,
  Hand,
  Smile,
  MessageSquare,
  Users,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ControlBar = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const handleLeaveCall = () => {
    console.log('Leaving call...');
  };

  return (
    <div className="p-4 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          {/* Microphone */}
          <div className="flex items-center gap-1">
            <Button
              onClick={() => setIsMicOn(!isMicOn)}
              variant="ghost"
              size="icon"
              className={cn(
                'w-12 h-12 rounded-xl transition-all duration-200',
                isMicOn
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              )}
            >
              {isMicOn ? (
                <Mic className="w-5 h-5" />
              ) : (
                <MicOff className="w-5 h-5" />
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

          {/* Camera */}
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

          {/* Screen Share */}
          <Button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            variant="ghost"
            size="icon"
            className={cn(
              'w-12 h-12 rounded-xl transition-all duration-200',
              isScreenSharing
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            )}
          >
            <Monitor className="w-5 h-5" />
          </Button>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsHandRaised(!isHandRaised)}
            variant="ghost"
            size="icon"
            className={cn(
              'w-12 h-12 rounded-xl transition-all duration-200',
              isHandRaised
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            )}
          >
            <Hand className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-xl bg-gray-700 hover:bg-gray-600 text-white"
          >
            <Smile className="w-5 h-5" />
          </Button>

          {/* Leave Call */}
          <Button
            onClick={handleLeaveCall}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white ml-4"
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowChat(!showChat)}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-xl bg-gray-700 hover:bg-gray-600 text-white relative"
          >
            <MessageSquare className="w-5 h-5" />
            {/* Chat notification */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>

          <Button
            onClick={() => setShowParticipants(!showParticipants)}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-xl bg-gray-700 hover:bg-gray-600 text-white relative"
          >
            <Users className="w-5 h-5" />
            <Badge
              variant="secondary"
              className="absolute -top-2 -right-2 w-6 h-6 text-xs bg-gray-600 text-white border-gray-500"
            >
              5
            </Badge>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-xl bg-gray-700 hover:bg-gray-600 text-white"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
