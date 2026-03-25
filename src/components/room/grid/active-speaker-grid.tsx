import { useEffect, useMemo } from 'react';
import { useActiveSpeakers } from '@/hooks/use-active-speakers';
import { useMedia, QualityLevel } from '@/hooks/use-media';
import { MemoizedPeerTile } from './peer-tile';
import { usePeerMe } from '@/store/conf/hooks';
import MyTile from './my-tile';
import type { Layout } from '@/types';

interface ActiveSpeakerGridProps {
  maxSpeakers?: number;
}

export const ActiveSpeakerGrid = ({
  maxSpeakers = 9,
}: ActiveSpeakerGridProps) => {
  const activeSpeakers = useActiveSpeakers(maxSpeakers);
  const { setConsumerQuality } = useMedia();
  const myPeer = usePeerMe();

  // Ensure active speakers always get HIGH quality
  useEffect(() => {
    if (!setConsumerQuality) return;

    activeSpeakers.forEach(peerId => {
      // Skip local peer (we don't consume our own media)
      if (peerId === myPeer?.id) return;

      setConsumerQuality(peerId, 'camera', QualityLevel.HIGH);
    });
  }, [activeSpeakers, setConsumerQuality, myPeer?.id]);

  // Calculate layout based on number of active speakers
  const layout: Layout = useMemo(() => {
    const count = activeSpeakers.length;

    if (count <= 1) {
      // Single speaker: large tile
      return {
        width: 640,
        height: 480,
        rows: 1,
        cols: 1,
        aspectRatio: '4:3',
      };
    } else if (count <= 4) {
      // 2-4 speakers: 2x2 grid
      return {
        width: 320,
        height: 240,
        rows: 2,
        cols: 2,
        aspectRatio: '4:3',
      };
    } else {
      // 5-9 speakers: 3x3 grid
      return {
        width: 280,
        height: 210,
        rows: 3,
        cols: 3,
        aspectRatio: '4:3',
      };
    }
  }, [activeSpeakers.length]);

  if (activeSpeakers.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-3 mb-4 p-4">
      <div className="text-white/70 text-sm font-medium">Active Speakers</div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {activeSpeakers.map(peerId => {
          // Render local peer with MyTile
          if (peerId === myPeer?.id) {
            return <MyTile key={peerId} layout={layout} />;
          }

          // Render other peers with PeerTile
          return <MemoizedPeerTile key={peerId} peerId={peerId} layout={layout} />;
        })}
      </div>
    </div>
  );
};
