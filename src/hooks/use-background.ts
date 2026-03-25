import { useEffect, useRef } from 'react';
import { useSettingsBackgroundMode, useSettingsBackgroundImage, useCameraOn, useSettingsActions } from '@/store/conf/hooks';
import { getBackgroundService, setActiveOutputTrack } from '@/services/background-service';
import { useMedia } from './use-media';

/**
 * Applies virtual background / blur to the camera track whenever the mode changes.
 * Must be mounted inside the conference so mediaService is available.
 */
export const useBackground = () => {
  const mode = useSettingsBackgroundMode();
  const bgImage = useSettingsBackgroundImage();
  const cameraOn = useCameraOn();
  const { getTrack, mediaService } = useMedia();
  const { bumpBackgroundTrackVersion } = useSettingsActions();

  // Whether the background pipeline is currently running
  const activeRef = useRef(false);
  // The original raw camera track before we swapped it out — needed to restore on deactivation
  const rawTrackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    if (!mediaService) return;

    const svc = getBackgroundService();

    // Camera turned off — stop the pipeline so it doesn't run against a dead track
    if (!cameraOn) {
      if (activeRef.current) {
        svc.stop();
        activeRef.current = false;
        rawTrackRef.current = null;
        setActiveOutputTrack(null);
        bumpBackgroundTrackVersion();
      }
      return;
    }

    // Mode cleared — restore the raw camera track on the producer
    if (mode === 'none') {
      if (activeRef.current) {
        svc.stop();
        activeRef.current = false;
        setActiveOutputTrack(null);
        bumpBackgroundTrackVersion();
        if (rawTrackRef.current) {
          mediaService.replaceProducerTrack(rawTrackRef.current, 'camera').catch(() => {});
          rawTrackRef.current = null;
        }
      }
      return;
    }

    // Get the live raw camera track.
    // Note: after the pipeline is running, MediaService's stored camera track is the canvas
    // output track — so we use rawTrackRef when the pipeline is already active.
    const rawTrack = activeRef.current ? rawTrackRef.current : getTrack('camera');
    if (!rawTrack) return;

    if (!activeRef.current) {
      // First activation — snapshot the raw track before we replace it on the producer
      rawTrackRef.current = rawTrack;
      svc
        .start(rawTrack, mode, bgImage ?? undefined)
        .then(processedTrack => {
          activeRef.current = true;
          setActiveOutputTrack(processedTrack);
          bumpBackgroundTrackVersion();
          return mediaService.replaceProducerTrack(processedTrack, 'camera', false);
        })
        .catch(err => console.error('[background-service] failed to start:', err));
    } else {
      // Pipeline already running — update mode/image without restarting
      svc.setMode(mode, bgImage ?? undefined);
    }
  }, [mode, bgImage, cameraOn, mediaService, getTrack]);
};
