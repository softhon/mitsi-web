import { useMedia } from '@/hooks/use-media';
import { cn } from '@/lib/utils';
import { useCameraDeviceId, useCameraOn, useMicOn } from '@/store/conf/hooks';
import { Mic, MicOff, User } from 'lucide-react';
import { useEffect, useRef } from 'react';

const CameraPreview = () => {
  const { getTrack } = useMedia();
  const videoRef = useRef<HTMLVideoElement>(null);
  const micOn = useMicOn();
  const cameraOn = useCameraOn();
  const cameraDeviceId = useCameraDeviceId();

  useEffect(() => {
    if (!cameraOn || !videoRef.current) return;
    const track = getTrack('camera');
    if (!track) return;
    videoRef.current.srcObject = new MediaStream([track]);
  }, [cameraOn, cameraDeviceId, getTrack]);

  return (
    <div className="relative">
      <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl overflow-hidden border border-gray-600/50 shadow-2xl relative">
        {/* Ambient lighting effect */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-purple-500/3 animate-pulse delay-3000" />

        {cameraOn ? (
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
              micOn
                ? 'bg-green-500/20 backdrop-blur-sm'
                : 'bg-red-500/20 backdrop-blur-sm'
            )}
          >
            {/* Pulsing ring for active mic */}
            {micOn && (
              <div className="absolute inset-0 w-10 h-10 border-2 border-green-400/30 rounded-full animate-pulse" />
            )}
            {micOn ? (
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
  );
};

export default CameraPreview;
