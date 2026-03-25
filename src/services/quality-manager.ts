import type { ProducerSource } from '@/types';
import type MediaService from './media-service';

export enum QualityLevel {
  LOW = 0, // 480x270 @ 15fps, 150kbps
  MEDIUM = 1, // 960x540 @ 24fps, 600kbps
  HIGH = 2, // 1920x1080 @ 30fps, 1.8Mbps
  AUDIO_ONLY = -1,
}

interface ConsumerQuality {
  peerId: string;
  source: ProducerSource;
  currentLevel: QualityLevel;
  targetLevel: QualityLevel;
}

export class QualityManager {
  private mediaService: MediaService;
  private consumerQualities: Map<string, ConsumerQuality>;
  private statsInterval: number | null = null;

  constructor(mediaService: MediaService) {
    this.mediaService = mediaService;
    this.consumerQualities = new Map();
  }

  // Key for map: peerId:source
  private getKey(peerId: string, source: ProducerSource): string {
    return `${peerId}:${source}`;
  }

  async setConsumerQuality(
    peerId: string,
    source: ProducerSource,
    quality: QualityLevel
  ) {
    const key = this.getKey(peerId, source);

    // Store quality state
    const current = this.consumerQualities.get(key);
    this.consumerQualities.set(key, {
      peerId,
      source,
      currentLevel: current?.currentLevel ?? quality,
      targetLevel: quality,
    });

    // Apply to consumer
    if (quality === QualityLevel.AUDIO_ONLY && source === 'camera') {
      // Pause video consumer for audio-only
      await this.mediaService.pauseConsumer(peerId, source);
    } else {
      // Resume if paused
      const consumer = this.mediaService.getConsumer(peerId, source);
      if (consumer?.paused) {
        await this.mediaService.resumeConsumer(peerId, source);
      }

      // Set preferred layers
      await this.mediaService.setConsumerPreferredLayers(
        peerId,
        source,
        quality,
        quality
      );
    }
  }

  getConsumerQuality(
    peerId: string,
    source: ProducerSource
  ): QualityLevel | null {
    const key = this.getKey(peerId, source);
    return this.consumerQualities.get(key)?.targetLevel ?? null;
  }

  // Start monitoring consumer stats (optional, for debugging)
  startStatsMonitoring(intervalMs: number = 5000) {
    if (this.statsInterval) return;

    this.statsInterval = window.setInterval(() => {
      this.consumerQualities.forEach(async ({ peerId, source }) => {
        const stats = await this.mediaService.getConsumerStats(peerId, source);
        const layers = this.mediaService.getConsumerLayers(peerId, source);

        // Log for debugging (can be removed in production)
        if (stats && layers) {
          console.log(`[QualityManager] ${peerId}:${source}`, {
            preferred: layers.preferredSpatialLayer,
            current: layers.currentSpatialLayer,
          });
        }
      });
    }, intervalMs);
  }

  stopStatsMonitoring() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
  }

  clear() {
    this.stopStatsMonitoring();
    this.consumerQualities.clear();
  }
}
