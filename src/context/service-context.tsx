/**
 * Meeting Service Provider
 * Provides access to signaling service and media service
 * Handles events to join and participant in meeting
 * Steps
 * 1. initialise signalling
 * 2. listen to events required at join meeting page
 * 3. User attempt to join meeting
 * 4. Start mediaserver
 * 5. Listen to events to participate in meeting
 */

import config from '@/config';
import MediaService from '@/services/media-service';
import SignalingService from '@/services/signaling-service';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface ServiceContextType {
  mediaService: MediaService | null;
  signalingService: SignalingService | null;
  isInitializing: boolean;
  error: string | null;
}

export const ServiceContext = createContext<ServiceContextType>({
  mediaService: null,
  signalingService: null,
  isInitializing: true,
  error: null,
  // servicesStarted: false
  // startMediaService: async () => { }
});

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const [mediaService, setMediaService] = useState<MediaService | null>(null);
  const [signalingService, setSignalingService] =
    useState<SignalingService | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use refs to track cleanup
  const cleanupRef = useRef<(() => void) | null>(null);
  const isCleaningUpRef = useRef(false);

  const cleanup = useCallback(() => {
    if (isCleaningUpRef.current) return;
    isCleaningUpRef.current = true;

    try {
      // Cleanup media service
      if (mediaService) {
        mediaService.closeAllTransports();
        mediaService.closeAllProducers();
        mediaService.closeAllConsumers();
      }

      // Cleanup signaling service
      if (signalingService) {
        signalingService.connection.off('reconnect_failed');
        signalingService.connection.off('connect_error');
        signalingService.disconnect();
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    } finally {
      isCleaningUpRef.current = false;
    }
  }, [mediaService, signalingService]);

  const initializeServices = useCallback(async () => {
    if (isCleaningUpRef.current) return;

    setIsInitializing(true);
    setError(null);

    try {
      // Initialize signaling service
      const newSignalingService = new SignalingService(config.signalingServer, {
        authkey: config.apiKey,
      });

      setSignalingService(newSignalingService);

      // Initialize media service
      const newMediaService = await MediaService.start(newSignalingService);
      setMediaService(newMediaService);

      setError(null);
    } catch (error) {
      console.error('Service initialization error:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to initialize services'
      );
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    initializeServices();

    // Store cleanup function
    cleanupRef.current = cleanup;

    return () => {
      cleanupRef.current?.();
    };
  }, [initializeServices, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <ServiceContext.Provider
      value={{ mediaService, signalingService, isInitializing, error }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
