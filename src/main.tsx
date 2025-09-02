import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app';
import VideoConferencingDemo from './pages/conference';
import JoinMeetingPage from './pages/join';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VideoConferencingDemo />
    {/* <App /> */}
    {/* <JoinMeetingPage /> */}
  </StrictMode>
);
