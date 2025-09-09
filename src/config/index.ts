const env = import.meta.env;

const config = {
  signalingServer: env.VITE_REACT_APP_SIGNALING_SERVER,
  apiServer: env.VITE_REACT_APP_API_SERVER,
  apiKey: env.VITE_REACT_APP_API_KEY,
  media: {
    simulcastEnabled: true,
    svcEnabled: false,
  },
};

export default config;
