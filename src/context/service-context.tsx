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

import MediaService from '@/services/media-service';
import SignalingService from '@/services/signaling-service';
import { API_KEY, SIGNALING_SERVER } from '@/lib/api';
import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface ServiceContextType {
  mediaService: MediaService | null;
  signalingService: SignalingService | null;
  // servicesStarted: boolean;
  // startMediaService: () => Promise<void>;
}

export const ServiceContext = createContext<ServiceContextType>({
  mediaService: null,
  signalingService: null,
  // servicesStarted: false
  // startMediaService: async () => { }
});

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const [mediaService, setMediaService] = useState<MediaService | null>(null);
  const [signalingService, setSignalingService] =
    useState<SignalingService | null>(null);

  useEffect(() => {
    // 1. initialise signalling start media service
    const initSignaling = async () => {
      try {
        const signalingService = new SignalingService(SIGNALING_SERVER, {
          authkey: API_KEY,
        });

        setSignalingService(signalingService);

        const newMediaservice = await MediaService.start(signalingService);

        setMediaService(newMediaservice);
      } catch (error) {
        console.error(error);
      }
    };
    initSignaling();

    return () => {
      if (signalingService) {
        signalingService.connection.off('reconnect_failed');
        signalingService.connection.off('connect_error');
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (mediaService) {
        mediaService.closeAllTransports();
        mediaService.closeAllProducers();
        mediaService.closeAllConsumers();
      }
    };
  }, []);

  return (
    <ServiceContext.Provider value={{ mediaService, signalingService }}>
      {children}
    </ServiceContext.Provider>
  );
};
