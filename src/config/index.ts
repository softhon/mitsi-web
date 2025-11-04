const env = import.meta.env;
const isDevMode = env.DEV;

const getConfigValue = (key: string, fallback?: string): string => {
  // if (isDevMode) {
  //   return env[`VITE_REACT_APP_${key}`] || fallback || '';
  // }
  console.log('window.APP_CONFIG => ', window.APP_CONFIG);

  return (
    env[`VITE_REACT_APP_${key}`] || window.APP_CONFIG?.[key] || fallback || ''
  );
  // return window.APP_CONFIG?.[key] || fallback || '';
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
