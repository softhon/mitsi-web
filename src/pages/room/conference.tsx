import React from 'react';

import ControlBar from '@/components/room/control-bar';
import Header from '@/components/room/header';
import { ConferenceGrid } from '@/components/room/grid/conference-grid';
import PeerAudioList from '@/components/room/peer-audio-list';

export const Conference: React.FC = () => {
  return (
    <div className=" relative h-screen bg-gray-900 flex flex-col overflow-hidden justify-between">
      {/* Header */}
      <Header />

      {/* Main Video Grid */}
      <ConferenceGrid />

      {/* Bottom Controls */}
      <ControlBar onToggleChat={() => {}} />
      <PeerAudioList />
    </div>
  );
};

export default Conference;
