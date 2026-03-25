import { QualityLevel } from '@/hooks/use-media';

/**
 * Bandwidth requirements per quality level (in Mbps)
 * Based on simulcast configuration from utils.ts
 */
const QUALITY_BANDWIDTH = {
  [QualityLevel.LOW]: 0.15, // 150 Kbps
  [QualityLevel.MEDIUM]: 0.6, // 600 Kbps
  [QualityLevel.HIGH]: 1.8, // 1.8 Mbps
  [QualityLevel.AUDIO_ONLY]: 0.032, // 32 Kbps for audio
};

export interface BandwidthEstimate {
  download: number; // Mbps
  upload: number; // Mbps
  breakdown: {
    activeSpeakers: number;
    visibleParticipants: number;
    offScreenParticipants: number;
    ownVideo: number;
    ownAudio: number;
  };
  recommendation: string;
}

interface EstimateParams {
  totalParticipants: number;
  activeSpeakers?: number;
  visibleParticipants?: number;
  layoutMode?: 'grid' | 'speaker';
  cameraOn?: boolean;
  micOn?: boolean;
}

/**
 * Estimates bandwidth usage based on participant count and quality settings
 */
export const estimateBandwidth = ({
  totalParticipants,
  activeSpeakers = 9,
  visibleParticipants = 25,
  layoutMode = 'grid',
  cameraOn = true,
  micOn = true,
}: EstimateParams): BandwidthEstimate => {
  const otherParticipants = totalParticipants - 1; // Exclude self

  let downloadBandwidth = 0;
  const breakdown = {
    activeSpeakers: 0,
    visibleParticipants: 0,
    offScreenParticipants: 0,
    ownVideo: 0,
    ownAudio: 0,
  };

  if (layoutMode === 'speaker') {
    // Speaker view: 9 active speakers at HIGH, visible at MEDIUM, rest AUDIO_ONLY
    const highQualityCount = Math.min(activeSpeakers, otherParticipants);
    const mediumQualityCount = Math.min(
      Math.max(visibleParticipants - highQualityCount, 0),
      otherParticipants - highQualityCount
    );
    const audioOnlyCount = Math.max(
      otherParticipants - highQualityCount - mediumQualityCount,
      0
    );

    breakdown.activeSpeakers = highQualityCount * QUALITY_BANDWIDTH[QualityLevel.HIGH];
    breakdown.visibleParticipants =
      mediumQualityCount * QUALITY_BANDWIDTH[QualityLevel.MEDIUM];
    breakdown.offScreenParticipants =
      audioOnlyCount * QUALITY_BANDWIDTH[QualityLevel.AUDIO_ONLY];

    downloadBandwidth =
      breakdown.activeSpeakers +
      breakdown.visibleParticipants +
      breakdown.offScreenParticipants;
  } else {
    // Grid view: All visible at MEDIUM
    const visibleCount = Math.min(visibleParticipants, otherParticipants);
    const offScreenCount = Math.max(otherParticipants - visibleCount, 0);

    breakdown.visibleParticipants =
      visibleCount * QUALITY_BANDWIDTH[QualityLevel.MEDIUM];
    breakdown.offScreenParticipants =
      offScreenCount * QUALITY_BANDWIDTH[QualityLevel.AUDIO_ONLY];

    downloadBandwidth =
      breakdown.visibleParticipants + breakdown.offScreenParticipants;
  }

  // Upload bandwidth (own video + audio)
  breakdown.ownVideo = cameraOn ? QUALITY_BANDWIDTH[QualityLevel.HIGH] : 0;
  breakdown.ownAudio = micOn ? QUALITY_BANDWIDTH[QualityLevel.AUDIO_ONLY] : 0;
  const uploadBandwidth = breakdown.ownVideo + breakdown.ownAudio;

  // Generate recommendation
  let recommendation = '';
  const totalBandwidth = downloadBandwidth + uploadBandwidth;

  if (totalBandwidth > 50) {
    recommendation =
      'Very high bandwidth usage. Consider using speaker view or reducing video quality.';
  } else if (totalBandwidth > 30) {
    recommendation =
      'High bandwidth usage. Recommend using speaker view for better performance.';
  } else if (totalBandwidth > 15) {
    recommendation = 'Moderate bandwidth usage. Should work well on most connections.';
  } else {
    recommendation = 'Low bandwidth usage. Excellent for all connection types.';
  }

  return {
    download: Number(downloadBandwidth.toFixed(2)),
    upload: Number(uploadBandwidth.toFixed(2)),
    breakdown,
    recommendation,
  };
};

/**
 * Calculates maximum supported participants for a given bandwidth limit
 */
export const calculateMaxParticipants = (
  bandwidthLimitMbps: number,
  layoutMode: 'grid' | 'speaker' = 'speaker'
): number => {
  const uploadBandwidth = QUALITY_BANDWIDTH[QualityLevel.HIGH] +
    QUALITY_BANDWIDTH[QualityLevel.AUDIO_ONLY];
  const availableDownload = bandwidthLimitMbps - uploadBandwidth;

  if (layoutMode === 'speaker') {
    // Speaker view: 9 HIGH + rest MEDIUM
    const nineSpeakersBandwidth = 9 * QUALITY_BANDWIDTH[QualityLevel.HIGH];
    const remainingBandwidth = availableDownload - nineSpeakersBandwidth;

    if (remainingBandwidth < 0) {
      // Can't even support 9 speakers at high quality
      return Math.floor(availableDownload / QUALITY_BANDWIDTH[QualityLevel.HIGH]);
    }

    // Calculate how many more at MEDIUM
    const additionalParticipants = Math.floor(
      remainingBandwidth / QUALITY_BANDWIDTH[QualityLevel.MEDIUM]
    );

    return 9 + additionalParticipants;
  } else {
    // Grid view: All at MEDIUM
    return Math.floor(availableDownload / QUALITY_BANDWIDTH[QualityLevel.MEDIUM]);
  }
};

/**
 * Gets bandwidth recommendation for optimal quality settings
 */
export const getQualityRecommendation = (
  availableBandwidthMbps: number,
  participantCount: number
): {
  recommendedLayout: 'grid' | 'speaker';
  recommendedQuality: QualityLevel;
  message: string;
} => {
  if (availableBandwidthMbps < 5) {
    return {
      recommendedLayout: 'speaker',
      recommendedQuality: QualityLevel.LOW,
      message:
        'Limited bandwidth detected. Using speaker view with low quality is recommended.',
    };
  }

  if (availableBandwidthMbps < 15) {
    return {
      recommendedLayout: 'speaker',
      recommendedQuality: QualityLevel.MEDIUM,
      message:
        'Moderate bandwidth. Speaker view with medium quality recommended for optimal experience.',
    };
  }

  if (participantCount > 50) {
    return {
      recommendedLayout: 'speaker',
      recommendedQuality: QualityLevel.HIGH,
      message:
        'Large meeting detected. Speaker view recommended to prioritize active speakers.',
    };
  }

  return {
    recommendedLayout: 'grid',
    recommendedQuality: QualityLevel.HIGH,
    message: 'Excellent bandwidth. Grid view with high quality available.',
  };
};
