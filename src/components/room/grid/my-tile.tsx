import React, { useEffect, useRef, useState } from 'react';
import { Hand, Mic, MicOff } from 'lucide-react';
import type { Layout } from '@/types';
import { cn, getInitials, getPeerId, isMobileDevice } from '@/lib/utils';
import {
  useCameraDeviceId,
  useCameraOn,
  useHandRaised,
  useMicOn,
  usePeerConditionsById,
  usePeerMe,
  useBackgroundTrackVersion,
} from '@/store/conf/hooks';
import { useMedia } from '@/hooks/use-media';
import { getActiveOutputTrack } from '@/services/background-service';

interface PeerTileProps {
  layout: Layout;
}
const MyTile: React.FC<PeerTileProps> = ({ layout }) => {
  const { getTrack } = useMedia();
  const videoRef = useRef<HTMLVideoElement>(null);
  const micOn = useMicOn();
  const [audioLevel, setAudioLevel] = useState(0);
  const cameraOn = useCameraOn();
  const handRaised = useHandRaised();
  const cameraDeviceId = useCameraDeviceId();
  const backgroundTrackVersion = useBackgroundTrackVersion();
  const peerMe = usePeerMe();
  const peerMeCondition = usePeerConditionsById(peerMe?.id || getPeerId());
  const isAMobileDevice = isMobileDevice();

  useEffect(() => {
    if (!cameraOn || !videoRef.current) return;
    const track = getActiveOutputTrack() ?? getTrack('camera');
    if (!track) return;
    videoRef.current.srcObject = new MediaStream([track]);
    videoRef.current.play().catch(() => {});
  }, [cameraOn, cameraDeviceId, getTrack, backgroundTrackVersion]);

  useEffect(() => {
    if (!micOn) {
      setAudioLevel(0);
      return;
    }
    const track = getTrack('mic');
    if (!track) return;
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    const data = new Uint8Array(analyser.frequencyBinCount);
    ctx.createMediaStreamSource(new MediaStream([track])).connect(analyser);
    let rafId: number;
    const tick = () => {
      analyser.getByteFrequencyData(data);
      setAudioLevel(data.reduce((s, v) => s + v, 0) / data.length / 255);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      ctx.close();
      setAudioLevel(0);
    };
  }, [micOn, getTrack]);

  if (!peerMe) return null;
  return (
    <div
      className={cn(
        ` bg-linear-to-br from-white/5 to-white/2 border  border-white/10 backdrop-blur-xl 
        rounded-lg overflow-hidden relative flex items-center transition-all duration-300 ease-in-out`,
        peerMeCondition?.isSpeaking && ' border-blue-500'
      )}
      style={{ width: `${layout.width}px`, height: `${layout.height}px` }}
    >
      {/* Video/Avatar Area */}
      {cameraOn ? (
        <video
          ref={videoRef}
          className={cn('h-full w-full', !isAMobileDevice && ' object-cover')}
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
        />
      ) : (
        <div className="w-24 h-24 bg-linear-to-br from-white/15 to-white/1 rounded-full flex items-center justify-center shadow-lg mx-auto">
          {getInitials(peerMe.name)}
        </div>
      )}

      {/* Mic Status */}
      <div
        className={cn(
          'absolute top-2 right-2 z-10 p-1.5 rounded-full ',
          micOn
            ? 'bg-green-500/20 backdrop-blur-sm'
            : 'bg-red-500/20 backdrop-blur-sm'
        )}
      >
        {micOn ? (
          <Mic className="w-4 h-4 text-green-400" />
        ) : (
          <MicOff className="w-4 h-4 text-red-400" />
        )}
      </div>

      {/* Name Bar */}
      <div className="absolute flex gap-x-2 items-center  bottom-0 z-10 px-3 py-2 text-white text-sm font-medium  ">
        {handRaised && <Hand size={18} />}
        <span className="truncate">{peerMe.name}</span>
      </div>

      {/* Audio level bar */}
      {audioLevel > 0.02 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 z-20 bg-black/20">
          <div
            className="h-full bg-green-400 transition-all duration-75"
            style={{ width: `${Math.min(audioLevel * 100 * 3, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default MyTile;
