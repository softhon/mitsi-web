import { useEffect, useRef } from 'react';
import { useConnectionQuality } from '@/hooks/use-connection-quality';
import { useMedia, QualityLevel } from '@/hooks/use-media';
import { usePeerIds } from '@/store/conf/hooks';
import { useActiveSpeakers } from '@/hooks/use-active-speakers';

/**
 * Component that automatically adjusts video quality based on connection quality
 * Runs in the background and reduces quality when connection degrades
 */
const ConnectionQualityManager = () => {
  const connectionStats = useConnectionQuality();
  const { setConsumerQuality } = useMedia();
  const peerIds = usePeerIds();
  const activeSpeakers = useActiveSpeakers();
  const previousQuality = useRef(connectionStats.quality);
  const adjustmentTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (!setConsumerQuality || peerIds.length === 0) return;

    const { quality } = connectionStats;

    // Hysteresis: Only adjust if quality changed and stable for 10 seconds
    if (quality !== previousQuality.current) {
      // Clear previous timeout
      if (adjustmentTimeout.current) {
        clearTimeout(adjustmentTimeout.current);
      }

      // Wait 10 seconds before adjusting (avoid rapid changes)
      adjustmentTimeout.current = window.setTimeout(() => {
        previousQuality.current = quality;

        console.log(
          `[ConnectionQualityManager] Adjusting quality based on connection: ${quality}`
        );

        // Adjust quality based on connection
        if (quality === 'poor') {
          // Poor connection: All streams to LOW, except active speakers to MEDIUM
          peerIds.forEach(peerId => {
            const isActiveSpeaker = activeSpeakers.includes(peerId);
            const targetQuality = isActiveSpeaker
              ? QualityLevel.MEDIUM
              : QualityLevel.LOW;
            setConsumerQuality(peerId, 'camera', targetQuality);
          });
        } else if (quality === 'fair') {
          // Fair connection: Active speakers HIGH, visible MEDIUM, others LOW
          peerIds.forEach(peerId => {
            const isActiveSpeaker = activeSpeakers.includes(peerId);
            const targetQuality = isActiveSpeaker
              ? QualityLevel.HIGH
              : QualityLevel.MEDIUM;
            setConsumerQuality(peerId, 'camera', targetQuality);
          });
        } else if (quality === 'good' || quality === 'excellent') {
          // Good connection: Normal quality levels (handled by viewport quality)
          // Active speakers will get HIGH from ActiveSpeakerGrid
          // Others get MEDIUM from viewport quality hook
          console.log(
            '[ConnectionQualityManager] Connection good, using normal quality levels'
          );
        }
      }, 10000); // 10 second delay
    }

    return () => {
      if (adjustmentTimeout.current) {
        clearTimeout(adjustmentTimeout.current);
      }
    };
  }, [connectionStats, setConsumerQuality, peerIds, activeSpeakers]);

  // This component doesn't render anything
  return null;
};

export default ConnectionQualityManager;
