import config from '@/config';
import MediaService from '@/services/media-service';
import SignalingService from '@/services/signaling-service';
import { createContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    const initializeServices = async () => {
      setIsInitializing(true);
      setError(null);

      try {
        // Initialize signaling service
        const newSignalingService = SignalingService.connect(
          config.signalingServer,
          {
            authkey: config.apiKey,
          }
        );

        setSignalingService(newSignalingService);

        // Initialize media service
        const newMediaService = await MediaService.start(newSignalingService);
        setMediaService(newMediaService);
        setError(null);
      } catch (error) {
        console.error('Service initialization error:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to initialize services'
        );
      } finally {
        setIsInitializing(false);
      }
    };

    initializeServices();
  }, []);

  return (
    <ServiceContext.Provider
      value={{ mediaService, signalingService, isInitializing, error }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
