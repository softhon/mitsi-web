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

const JoinRoom: React.FC = () => {
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
              Get Started
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
              You are the first to join
              {/* Tiny accent dots on badge */}
              <div className="absolute -top-1 left-2 w-0.5 h-0.5 bg-green-400/60 rounded-full animate-pulse delay-1400" />
              <div className="absolute -bottom-1 right-2 w-0.5 h-0.5 bg-blue-400/50 rounded-full animate-pulse delay-1900" />
            </Badge>

            {/* Floating elements around badge */}
            <div className="absolute -top-3 left-1/4 w-1 h-1 bg-gray-400/30 rounded-full animate-pulse delay-2400" />
            <div className="absolute -bottom-3 right-1/4 w-1 h-1 bg-gray-300/35 rounded-full animate-pulse delay-2700" />
          </div>
        </div>

        {/* Video Preview */}
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl overflow-hidden border border-gray-600/50 shadow-2xl relative">
            {/* Ambient lighting effect */}
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-purple-500/3 animate-pulse delay-3000" />

            {isCameraOn ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover relative z-10"
                autoPlay
                muted
                playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative z-10">
                {/* Enhanced avatar container with animated background */}
                <div className="relative">
                  {/* Animated glow rings */}
                  <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-600/20 rounded-full animate-pulse delay-1000 blur-md" />
                  <div className="absolute inset-2 w-20 h-20 bg-gradient-to-tr from-blue-500/30 to-purple-600/30 rounded-full animate-pulse delay-1500 blur-sm" />

                  {/* Main avatar */}
                  <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-white" />

                    {/* Floating particles around avatar */}
                    <div className="absolute -top-2 -left-2 w-2 h-2 bg-blue-300/60 rounded-full animate-pulse delay-500" />
                    <div className="absolute -bottom-1 -right-2 w-1.5 h-1.5 bg-purple-300/50 rounded-full animate-pulse delay-800" />
                    <div className="absolute top-1/2 -left-3 w-1 h-1 bg-cyan-300/70 rounded-full animate-pulse delay-1200" />
                    <div className="absolute top-2 -right-3 w-1.5 h-1.5 bg-indigo-300/40 rounded-full animate-pulse delay-200" />
                  </div>
                </div>
              </div>
            )}

            {/* Mic Status Indicator with enhanced animation */}
            <div className="absolute top-4 right-4">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all relative',
                  isMicOn
                    ? 'bg-green-500/20 backdrop-blur-sm'
                    : 'bg-red-500/20 backdrop-blur-sm'
                )}
              >
                {/* Pulsing ring for active mic */}
                {isMicOn && (
                  <div className="absolute inset-0 w-10 h-10 border-2 border-green-400/30 rounded-full animate-pulse" />
                )}
                {isMicOn ? (
                  <Mic className="w-5 h-5 text-green-400 relative z-10" />
                ) : (
                  <MicOff className="w-5 h-5 text-red-400 relative z-10" />
                )}
              </div>
            </div>

            {/* Corner accent animations */}
            <div className="absolute top-3 left-3 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse delay-600" />
            <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-purple-300/30 rounded-full animate-pulse delay-1100" />
            <div className="absolute bottom-3 right-16 w-1 h-1 bg-cyan-400/50 rounded-full animate-pulse delay-1700" />
          </div>

          {/* Floating elements around video container */}
          <div className="absolute -top-2 left-1/4 w-1 h-1 bg-blue-400/60 rounded-full animate-pulse delay-400" />
          <div className="absolute -bottom-2 right-1/4 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-pulse delay-1300" />
          <div className="absolute top-1/2 -left-2 w-1 h-1 bg-indigo-300/50 rounded-full animate-pulse delay-900" />
          <div className="absolute top-1/2 -right-2 w-1.5 h-1.5 bg-teal-400/35 rounded-full animate-pulse delay-1800" />
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

      {/* Enhanced Background Decorative Elements */}
      {/* Top section decorations */}
      <div className="absolute top-20 left-8 w-3 h-3 bg-blue-400/40 rounded-full animate-pulse" />
      <div className="absolute top-32 left-20 w-1.5 h-1.5 bg-purple-300/30 rounded-full animate-pulse delay-700" />
      <div className="absolute top-16 right-16 w-2 h-2 bg-cyan-400/35 rounded-full animate-pulse delay-300" />
      <div className="absolute top-40 right-32 w-1 h-1 bg-blue-200/50 rounded-full animate-pulse delay-1200" />

      {/* Middle section decorations */}
      <div className="absolute top-1/2 left-12 w-2.5 h-2.5 bg-indigo-400/25 rounded-full animate-pulse delay-500" />
      <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-violet-300/40 rounded-full animate-pulse delay-900" />
      <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-blue-300/45 rounded-full animate-pulse delay-1500" />
      <div className="absolute top-1/2 right-12 w-2 h-2 bg-teal-400/30 rounded-full animate-pulse delay-200" />

      {/* Bottom section decorations */}
      <div className="absolute bottom-1/4 left-10 w-3 h-3 bg-purple-400/35 rounded-full animate-pulse delay-1000" />
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blue-200/40 rounded-full animate-pulse delay-1800" />
      <div className="absolute bottom-1/4 right-10 w-2.5 h-2.5 bg-cyan-300/25 rounded-full animate-pulse delay-600" />
      <div className="absolute bottom-32 right-20 w-1.5 h-1.5 bg-indigo-300/35 rounded-full animate-pulse delay-400" />

      {/* Corner decorations */}
      <div className="absolute top-1/4 left-1/2 w-1 h-1 bg-blue-400/30 rounded-full animate-pulse delay-1100" />
      <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-purple-300/25 rounded-full animate-pulse delay-800" />
      <div className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-teal-300/40 rounded-full animate-pulse delay-1400" />
      <div className="absolute bottom-1/3 right-1/5 w-1 h-1 bg-violet-400/35 rounded-full animate-pulse delay-100" />

      {/* Floating rings */}
      <div className="absolute top-1/3 left-1/4 w-8 h-8 border border-blue-400/20 rounded-full animate-pulse delay-2000" />
      <div className="absolute bottom-1/3 right-1/4 w-6 h-6 border border-purple-400/15 rounded-full animate-pulse delay-1600" />
      <div className="absolute top-2/3 left-1/6 w-4 h-4 border border-cyan-400/25 rounded-full animate-pulse delay-2200" />

      {/* Additional scattered dots */}
      <div className="absolute top-1/5 left-1/3 w-0.5 h-0.5 bg-blue-300/60 rounded-full animate-pulse delay-300" />
      <div className="absolute top-4/5 left-2/3 w-0.5 h-0.5 bg-purple-200/50 rounded-full animate-pulse delay-1700" />
      <div className="absolute top-1/6 right-1/3 w-1 h-1 bg-indigo-200/40 rounded-full animate-pulse delay-2400" />
      <div className="absolute bottom-1/6 left-1/2 w-0.5 h-0.5 bg-cyan-300/55 rounded-full animate-pulse delay-900" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-1/5 w-12 h-12 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full animate-pulse delay-1300 blur-sm" />
      <div className="absolute bottom-1/4 left-1/5 w-16 h-16 bg-gradient-to-tr from-purple-500/8 to-cyan-500/4 rounded-full animate-pulse delay-1900 blur-md" />
      <div className="absolute top-1/2 left-1/8 w-10 h-10 bg-gradient-to-bl from-indigo-500/12 to-teal-500/6 rounded-full animate-pulse delay-2600 blur-sm" />
    </div>
  );
};

export default JoinRoom;
