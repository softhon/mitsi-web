import React from 'react';

import ControlBar from '@/components/room/control-bar';
import Header from '@/components/room/header';
// import { ConferenceGrid } from '@/components/room/grid/conference-grid';
import PeerAudioList from '@/components/room/peer-audio-list';
import Display from '@/components/room/display';
import DynamicBg from '@/components/dynamic-bg';

export const Conference: React.FC = () => {
  return (
    <div className=" fixed h-screen w-full flex flex-col overflow-hidden justify-between">
      <DynamicBg />
      {/* Header */}
      <Header />

      <Display />
      {/* Bottom Controls */}
      <ControlBar />
      <PeerAudioList />
    </div>
  );
};

export default Conference;
