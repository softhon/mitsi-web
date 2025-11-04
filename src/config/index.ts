const env = import.meta.env;
const isDevMode = env.DEV;

const getConfigValue = (key: string, fallback?: string): string => {
  return (
    env[`VITE_REACT_APP_${key}`] || window.APP_CONFIG?.[key] || fallback || ''
  );
};

const config = {
  signalingServer: getConfigValue('SIGNALING_SERVER'),
  apiServer: getConfigValue('API_SERVER'),
  apiKey: getConfigValue('API_KEY'),
  isDevMode,
  media: {
    simulcastEnabled: true,
    svcEnabled: false,
  },
};

export default config;
