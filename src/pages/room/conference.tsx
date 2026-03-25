import React from 'react';

import ControlBar from '@/components/room/control-bar';
import Header from '@/components/room/header';
import PeerAudioList from '@/components/room/peer-audio-list';
import Display from '@/components/room/display';
import DynamicBg from '@/components/dynamic-bg';
import ReactionDisplay from '@/components/room/reaction-display';
import ConnectionQualityManager from '@/components/room/connection-quality-manager';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useBackground } from '@/hooks/use-background';
import PerformanceMonitor from '@/components/room/debug/performance-monitor';

export const Conference: React.FC = () => {
  useKeyboardShortcuts();
  useBackground();
  return (
    <div className=" relative h-full w-screen overflow-hidden ">
      <div className="fixed h-full w-full flex flex-col justify-between">
        <DynamicBg />
        {/* Header */}
        <Header />

        <Display />
        {/* Bottom Controls */}
        <ControlBar />
        <PeerAudioList />
        <ReactionDisplay />

        {/* Background Services */}
        <ConnectionQualityManager />
        <PerformanceMonitor />
      </div>
    </div>
  );
};

export default Conference;
