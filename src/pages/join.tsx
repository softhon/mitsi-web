import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  MoreVertical,
  User,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

const JoinMeetingPage: React.FC = () => {
  const [name, setName] = useState('');
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate camera stream
  useEffect(() => {
    if (isCameraOn && videoRef.current) {
      // In a real app, you'd get user media here
      // navigator.mediaDevices.getUserMedia({ video: true })
    }
  }, [isCameraOn]);

  const handleJoinMeeting = () => {
    if (!name.trim()) return;

    setIsJoining(true);
    // Simulate join process
    setTimeout(() => {
      console.log('Joining meeting with:', { name, isMicOn, isCameraOn });
      setIsJoining(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleJoinMeeting();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.1)_0%,transparent_50%)]" />

      <div className="relative z-10 w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          {/* Loading Spinner Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500/30">
                <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-semibold text-white">Get Started</h1>
            <p className="text-gray-400 text-lg">
              Setup your audio and video before joining
            </p>
          </div>

          {/* Status Badge */}
          <Badge
            variant="outline"
            className="bg-gray-800/50 text-gray-300 border-gray-600"
          >
            You are the first to join
          </Badge>
        </div>

        {/* Video Preview */}
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl overflow-hidden border border-gray-600/50 shadow-2xl">
            {isCameraOn ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
            )}

            {/* Mic Status Indicator */}
            <div className="absolute top-4 right-4">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors',
                  isMicOn
                    ? 'bg-green-500/20 backdrop-blur-sm'
                    : 'bg-red-500/20 backdrop-blur-sm'
                )}
              >
                {isMicOn ? (
                  <Mic className="w-5 h-5 text-green-400" />
                ) : (
                  <MicOff className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Media Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Microphone Control */}
          <div className="flex items-center gap-2">
            <MediaControlButton
              isActive={isMicOn}
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? (
                <Mic className="w-5 h-5" />
              ) : (
                <MicOff className="w-5 h-5" />
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

          {/* Camera Control */}
          <div className="flex items-center gap-2">
            <MediaControlButton
              isActive={isCameraOn}
              onClick={() => setIsCameraOn(!isCameraOn)}
            >
              {isCameraOn ? (
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

        {/* Name Input and Join Button */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <Button
            onClick={handleJoinMeeting}
            disabled={!name.trim() || isJoining}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isJoining ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              'Join Now'
            )}
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            By joining, you agree to our{' '}
            <button className="text-blue-400 hover:text-blue-300 underline transition-colors">
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-blue-400 hover:text-blue-300 underline transition-colors">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-3 h-3 bg-purple-400/20 rounded-full animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse delay-500" />
    </div>
  );
};

export default JoinMeetingPage;
