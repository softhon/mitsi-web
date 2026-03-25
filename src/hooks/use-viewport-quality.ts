import { useEffect, useRef } from 'react';
import { QualityLevel } from '@/services/quality-manager';
import type { ProducerSource } from '@/types';

interface UseViewportQualityProps {
  peerId: string;
  source: ProducerSource;
  setConsumerQuality?: (
    peerId: string,
    source: ProducerSource,
    quality: QualityLevel
  ) => void;
  isVisible: boolean;
  isActiveSpeaker?: boolean;
}

export const useViewportQuality = ({
  peerId,
  source,
  setConsumerQuality,
  isVisible,
  isActiveSpeaker,
}: UseViewportQualityProps) => {
  const previousVisibility = useRef(isVisible);
  const previousSpeaker = useRef(isActiveSpeaker);

  useEffect(() => {
    if (!setConsumerQuality) return;

    // Only apply to video sources
    if (source !== 'camera' && source !== 'screen') return;

    let quality: QualityLevel;

    if (!isVisible) {
      // Off-screen: audio only for camera, low for screen
      quality =
        source === 'camera' ? QualityLevel.AUDIO_ONLY : QualityLevel.LOW;
    } else if (isActiveSpeaker) {
      // Active speaker: always high quality
      quality = QualityLevel.HIGH;
    } else {
      // Visible but not speaking: medium quality
      quality = QualityLevel.MEDIUM;
    }

    // Only update if visibility or speaker status changed
    if (
      isVisible !== previousVisibility.current ||
      isActiveSpeaker !== previousSpeaker.current
    ) {
      setConsumerQuality(peerId, source, quality);
      previousVisibility.current = isVisible;
      previousSpeaker.current = isActiveSpeaker;
    }
  }, [isVisible, isActiveSpeaker, peerId, source, setConsumerQuality]);
};
