import type { Layout, PeerData } from '@/types';
import React from 'react';
import { PeerTile } from './peer-tile';
import { usePeerMe } from '@/store/conf/hooks';
import MyTile from './my-tile';

interface GridContainerProps {
  peerData: PeerData[];
  layout: Layout | null;
}

export const GridContainer: React.FC<GridContainerProps> = ({
  peerData,
  layout,
}) => {
  const myPeer = usePeerMe();
  if (!myPeer) {
    return (
      <div
        className={`w-full h-full bg-gray-900/95 flex flex-wrap items-center justify-center gap-3 p-4 overflow-hidden `}
      >
        <div className="text-gray-400 text-center">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-lg">No participants in the conference</p>
        </div>
      </div>
    );
  }

  if (!layout) {
    return (
      <div
        className={`w-full h-full bg-gray-900/95 flex flex-wrap items-center justify-center gap-3 p-4 overflow-hidden `}
      >
        <div className="text-gray-400 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p>Unable to fit participants in current container size</p>
          <p className="text-sm mt-2">
            Try reducing the number of participants or increase the window size
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full bg-gray-900/95 flex flex-wrap items-center justify-center content-center gap-3 p-4 overflow-hidden `}
    >
      {peerData.map(data => (
        <PeerTile key={data.id} peerData={data} layout={layout} />
      ))}
      <MyTile layout={layout} />
    </div>
  );
};
