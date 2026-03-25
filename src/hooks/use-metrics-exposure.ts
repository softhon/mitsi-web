import { useEffect } from 'react';
import { useConfStore } from '@/store/conf';
import { useMedia } from './use-media';

/**
 * Exposes Mitsi metrics to window for load testing
 * Only enabled when window.mitsiConfig.exposeMetrics === true
 */
export const useMetricsExposure = () => {
  const { mediaService } = useMedia();

  useEffect(() => {
    const config = (window as any).mitsiConfig;
    if (!config?.exposeMetrics) return;

    // Expose store instance
    (window as any).__mitsiStore__ = useConfStore;

    // Expose media service
    (window as any).__mitsiMediaService__ = mediaService;

    // Expose join status
    const checkJoinStatus = () => {
      const state = useConfStore.getState();
      const isJoined = state.peers.me !== null;
      (window as any).mitsiJoined = isJoined;

      if (!isJoined) {
        setTimeout(checkJoinStatus, 100);
      }
    };
    checkJoinStatus();

    // Expose performance metrics from performance monitor
    const updateMetrics = () => {
      const state = useConfStore.getState();
      (window as any).__mitsiPerformanceMetrics__ = {
        peersCount: Object.keys(state.peers.others).length,
        activeSpeakers: state.speaking?.speaking
          ? Object.keys(state.speaking.speaking).filter(id => state.speaking.speaking[id]).length
          : 0,
        memory:
          (performance as any).memory?.usedJSHeapSize / (1024 * 1024) || 0,
      };
    };

    const interval = setInterval(updateMetrics, 1000);

    return () => {
      clearInterval(interval);
      delete (window as any).__mitsiStore__;
      delete (window as any).__mitsiMediaService__;
      delete (window as any).__mitsiPerformanceMetrics__;
    };
  }, [mediaService]);
};
