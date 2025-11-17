import { useMedia } from '@/hooks/use-media';
import { cn, isMobileDevice } from '@/lib/utils';
import { useCameraDeviceId, useCameraOn, useMicOn } from '@/store/conf/hooks';
import { Mic, MicOff, User } from 'lucide-react';
import { useEffect, useRef } from 'react';

const CameraPreview = () => {
  const { getTrack } = useMedia();
  const videoRef = useRef<HTMLVideoElement>(null);
  const micOn = useMicOn();
  const cameraOn = useCameraOn();
  const cameraDeviceId = useCameraDeviceId();
  const isAMobileDevice = isMobileDevice();

  useEffect(() => {
    if (!cameraOn || !videoRef.current) return;
    const track = getTrack('camera');
    if (!track) return;
    videoRef.current.srcObject = new MediaStream([track]);
  }, [cameraOn, cameraDeviceId, getTrack]);

  return (
    <div className="relative">
      <div className="aspect-video bg-linear-to-br from-white/5 to-white/2 rounded-2xl overflow-hidden border border-gray-600/50 shadow-2xl relative">
        {/* Ambient lighting effect */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-purple-500/3 animate-pulse delay-3000" />

        {cameraOn ? (
          <video
            ref={videoRef}
            className={cn(
              'w-full h-full relative z-10',
              !isAMobileDevice && 'object-cover'
            )}
            autoPlay
            muted
            playsInline
            webkit-playsinline="true"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative z-10">
            <div className="relative">
              <div className="relative w-20 h-20 bg-linear-to-br from-white/15 to-white/1 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Mic Status Indicator with enhanced animation */}
        <div className="absolute top-4 right-4 z-20">
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
      </div>
    </div>
  );
};

export default CameraPreview;
