import { useState, useEffect, useCallback } from 'react';
import { useMedia } from './use-media';
import { usePeerIds } from '@/store/conf/hooks';

export type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor';

export interface ConnectionStats {
  quality: ConnectionQuality;
  packetLoss: number;
  jitter: number;
  rtt: number;
  bandwidth: number;
  timestamp: number;
}

interface WebRTCStats {
  packetsLost: number;
  packetsReceived: number;
  jitter: number;
  roundTripTime?: number;
  bytesReceived: number;
}

/**
 * Calculates connection quality based on WebRTC statistics
 */
const calculateQuality = (
  packetLoss: number,
  jitter: number,
  rtt: number
): ConnectionQuality => {
  // Excellent: < 1% loss, < 30ms jitter, < 100ms RTT
  if (packetLoss < 1 && jitter < 30 && rtt < 100) {
    return 'excellent';
  }
  // Good: < 3% loss, < 50ms jitter, < 200ms RTT
  if (packetLoss < 3 && jitter < 50 && rtt < 200) {
    return 'good';
  }
  // Fair: < 5% loss, < 100ms jitter, < 300ms RTT
  if (packetLoss < 5 && jitter < 100 && rtt < 300) {
    return 'fair';
  }
  // Poor: anything worse
  return 'poor';
};

/**
 * Hook to monitor connection quality based on WebRTC statistics
 * Samples statistics every 5 seconds and calculates quality metrics
 */
export const useConnectionQuality = () => {
  const { mediaService } = useMedia();
  const peerIds = usePeerIds();
  const [stats, setStats] = useState<ConnectionStats>({
    quality: 'good',
    packetLoss: 0,
    jitter: 0,
    rtt: 0,
    bandwidth: 0,
    timestamp: Date.now(),
  });

  const updateStats = useCallback(async () => {
    if (!mediaService || peerIds.length === 0) return;

    try {
      const allStats: WebRTCStats[] = [];
      let totalBytesReceived = 0;

      // Sample stats from first 5 peers (representative sample)
      const samplePeers = peerIds.slice(0, 5);

      for (const peerId of samplePeers) {
        const consumerStats = await mediaService.getConsumerStats(
          peerId,
          'camera'
        );

        if (consumerStats) {
          // Parse WebRTC stats
          const statsArray = Array.from(consumerStats.values());

          for (const stat of statsArray) {
            if (stat.type === 'inbound-rtp') {
              allStats.push({
                packetsLost: stat.packetsLost || 0,
                packetsReceived: stat.packetsReceived || 0,
                jitter: (stat.jitter || 0) * 1000, // Convert to ms
                roundTripTime: stat.roundTripTime,
                bytesReceived: stat.bytesReceived || 0,
              });
              totalBytesReceived += stat.bytesReceived || 0;
            }
          }
        }
      }

      if (allStats.length === 0) return;

      // Calculate averages
      const totalPacketsLost = allStats.reduce(
        (sum, s) => sum + s.packetsLost,
        0
      );
      const totalPacketsReceived = allStats.reduce(
        (sum, s) => sum + s.packetsReceived,
        0
      );
      const avgJitter =
        allStats.reduce((sum, s) => sum + s.jitter, 0) / allStats.length;
      const avgRtt =
        allStats.reduce((sum, s) => sum + (s.roundTripTime || 0), 0) /
        allStats.length;

      const packetLoss =
        totalPacketsReceived > 0
          ? (totalPacketsLost / (totalPacketsLost + totalPacketsReceived)) * 100
          : 0;

      const bandwidth = totalBytesReceived / 1024 / 1024; // MB

      const quality = calculateQuality(packetLoss, avgJitter, avgRtt * 1000);

      setStats({
        quality,
        packetLoss,
        jitter: avgJitter,
        rtt: avgRtt * 1000,
        bandwidth,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('[ConnectionQuality] Failed to get stats:', error);
    }
  }, [mediaService, peerIds]);

  // Update stats every 5 seconds
  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, [updateStats]);

  return stats;
};

/**
 * Hook to check if connection quality is below a threshold
 */
export const useIsConnectionPoor = () => {
  const stats = useConnectionQuality();
  return stats.quality === 'poor' || stats.quality === 'fair';
};
