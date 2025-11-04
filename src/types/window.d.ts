// src/types/window.d.ts
declare global {
  interface Window {
    APP_CONFIG?: {
      SIGNALING_SERVER: string;
      API_SERVER: string;
      API_KEY: string;
      [key: string]: string;
    };
  }
}

export {};
