import { useEffect, useRef } from 'react';
import { Hand, Mic, MicOff, PinOff } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import {
  usePeerOthersById,
  usePeerMediasById,
  usePeerConditionsById,
  usePeerSelectedId,
  usePeerActions,
  usePeerPosition,
  useIsSpeaking,
} from '@/store/conf/hooks';
import { useMedia } from '@/hooks/use-media';
import { PeerTile } from '../grid/peer-tile';
import MyTile from '../grid/my-tile';

const STRIP_TILE = { width: 160, height: 120 };

const PinnedLarge = ({ peerId }: { peerId: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerData = usePeerOthersById(peerId);
  const media = usePeerMediasById(peerId);
  const peerCondition = usePeerConditionsById(peerId);
  const isSpeaking = useIsSpeaking(peerId);
  const peerActions = usePeerActions();
  const { getConsumer } = useMedia();

  useEffect(() => {
    if (!media?.camera || !videoRef.current) return;
    const consumer = getConsumer(peerId, 'camera');
    if (!consumer) return;
    videoRef.current.srcObject = new MediaStream([consumer.track]);
  }, [media?.camera, getConsumer, peerId]);

  if (!peerData) return null;

  return (
    <div
      className={cn(
        'relative flex-1 min-h-0 bg-linear-to-br from-white/5 to-white/2 border border-white/10 backdrop-blur-xl rounded-xl overflow-hidden flex items-center justify-center',
        isSpeaking && 'border-blue-500'
      )}
    >
      {media?.camera ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          playsInline
        />
      ) : (
        <div className="w-28 h-28 bg-linear-to-br from-white/15 to-white/1 rounded-full flex items-center justify-center shadow-lg">
          {getInitials(peerData.name)}
        </div>
      )}

      <div className={cn(
        'absolute top-3 right-3 z-10 p-1.5 rounded-full',
        media?.mic ? 'bg-green-500/20' : 'bg-red-500/20'
      )}>
        {media?.mic
          ? <Mic className="w-4 h-4 text-green-400" />
          : <MicOff className="w-4 h-4 text-red-400" />
        }
      </div>

      <button
        onClick={() => peerActions.setSelectedId(null)}
        title="Unpin"
        className="absolute top-3 left-3 z-10 p-1.5 rounded-md bg-black/50 hover:bg-black/70 text-yellow-400 transition-colors"
      >
        <PinOff size={14} />
      </button>

      <div className="absolute bottom-0 left-0 right-0 z-10 px-3 py-2 text-white text-sm font-medium flex items-center gap-2">
        {peerCondition?.hand?.raised && <Hand size={16} />}
        <span className="truncate">{peerData.name}</span>
      </div>
    </div>
  );
};

const PinGrid = () => {
  const selectedId = usePeerSelectedId();
  const peerPositions = usePeerPosition();

  if (!selectedId) return null;

  const otherIds = peerPositions.map(p => p.id).filter(id => id !== selectedId);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <PinnedLarge peerId={selectedId} />
      {otherIds.length > 0 && (
        <div className="flex gap-2 overflow-x-auto shrink-0 pb-1">
          {otherIds.map(id => (
            <PeerTile key={id} peerId={id} layout={STRIP_TILE} />
          ))}
          <MyTile layout={STRIP_TILE} />
        </div>
      )}
    </div>
  );
};

export default PinGrid;
