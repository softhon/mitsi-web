import { useMemo, useEffect, useState } from 'react';
import { useSpeakingState, usePeerIds, usePeerMe } from '@/store/conf/hooks';

interface SpeakerActivity {
  peerId: string;
  lastSpeakingTime: number;
  speakingDuration: number;
}

/**
 * Hook to track and prioritize active speakers
 * Returns peer IDs sorted by speaking activity (most active first)
 *
 * @param maxSpeakers Maximum number of active speakers to return (default: 9)
 * @returns Array of peer IDs sorted by speaking activity
 */
export const useActiveSpeakers = (maxSpeakers: number = 9) => {
  const speaking = useSpeakingState();
  const peerIds = usePeerIds();
  const myPeer = usePeerMe();
  const [speakers, setSpeakers] = useState<SpeakerActivity[]>([]);

  useEffect(() => {
    const now = Date.now();

    setSpeakers(prev => {
      // Update existing speakers
      const updated = prev.map(s => ({
        ...s,
        lastSpeakingTime: speaking[s.peerId] ? now : s.lastSpeakingTime,
        speakingDuration: speaking[s.peerId]
          ? s.speakingDuration + 100 // Increment by 100ms (update interval)
          : s.speakingDuration * 0.9, // Decay by 10%
      }));

      // Add new speakers (including local peer)
      const allPeerIds = myPeer?.id ? [...peerIds, myPeer.id] : peerIds;

      allPeerIds.forEach(id => {
        if (speaking[id] && !updated.find(s => s.peerId === id)) {
          updated.push({
            peerId: id,
            lastSpeakingTime: now,
            speakingDuration: 100,
          });
        }
      });

      // Sort by speaking duration and take top N
      return updated
        .sort((a, b) => b.speakingDuration - a.speakingDuration)
        .slice(0, maxSpeakers)
        .filter(s => s.speakingDuration > 10); // Minimum threshold (100ms)
    });
  }, [speaking, peerIds, myPeer?.id, maxSpeakers]);

  return useMemo(() => speakers.map(s => s.peerId), [speakers]);
};

/**
 * Hook to check if a specific peer is an active speaker
 *
 * @param peerId Peer ID to check
 * @returns true if the peer is currently an active speaker
 */
export const useIsActiveSpeaker = (peerId: string) => {
  const activeSpeakers = useActiveSpeakers();
  return activeSpeakers.includes(peerId);
};
