import React from 'react';

import ControlBar from '@/components/conference/control-bar';
import Header from '@/components/conference/header';
import { ConferenceGrid } from '@/components/conference/grid/conference-grid';

export const Conference: React.FC = () => {
  return (
    <div className=" relative h-screen bg-gray-900 flex flex-col overflow-hidden justify-between">
      {/* Header */}
      <Header />

      {/* Main Video Grid */}
      <ConferenceGrid />

      {/* Bottom Controls */}
      <ControlBar onToggleChat={() => {}} />
    </div>
  );
};

export default Conference;
