import { useGridCalculator } from '@/hooks/use-grid-calculator';
import { DEFAULT_GRID_CONFIG } from '@/lib/utils';
import { usePeerOthersValues } from '@/store/conf/hooks';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { PeerTile } from '../grid/peer-tile';
import MyTile from '../grid/my-tile';
import type { Dimensions } from '@/types';

const PeerGrid = () => {
  const { calculateOptimalLayout } = useGridCalculator(DEFAULT_GRID_CONFIG);
  const gridRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  // const gridActions = useGridActions();
  // const gridHeight = useGridHeight();
  // const gridWidth = useGridWidth();
  const peers = usePeerOthersValues();

  useLayoutEffect(() => {
    if (!gridRef.current) return;
    const gridDiv = gridRef.current;
    const updateDimensions = ([entry]: ResizeObserverEntry[]) => {
      const { width, height } = entry.contentRect;
      setDimensions({
        width: Math.round(width),
        height: Math.round(height),
      });
    };
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(gridDiv);
    return () => {
      resizeObserver.unobserve(gridDiv);
    };
  }, []);

  const { layout, totalPages, currentPageParticipants } = useMemo(() => {
    const totalParticipants = peers.length + 1; // 1 represent current peer

    // Find maximum participants that can fit on one page
    let maxParticipantsPerPage = totalParticipants;
    let optimalLayout = calculateOptimalLayout(
      dimensions.width,
      dimensions.height,
      totalParticipants
    );

    // If no layout fits all participants, reduce the count
    if (!optimalLayout) {
      for (let count = totalParticipants - 1; count >= 1; count--) {
        optimalLayout = calculateOptimalLayout(
          dimensions.width,
          dimensions.height,
          count
        );
        if (optimalLayout) {
          maxParticipantsPerPage = count;
          break;
        }
      }
    }

    const pages = Math.ceil(totalParticipants / maxParticipantsPerPage);
    const startIndex = 0 * maxParticipantsPerPage;
    const endIndex = Math.min(
      startIndex + maxParticipantsPerPage,
      totalParticipants
    );
    const pageParticipants = peers.slice(startIndex, endIndex);

    return {
      layout: optimalLayout,
      participantsPerPage: maxParticipantsPerPage,
      totalPages: pages,
      currentPageParticipants: pageParticipants,
    };
  }, [dimensions.height, dimensions.width, peers, calculateOptimalLayout]);

  return (
    <div
      ref={gridRef}
      className={`w-full h-full bg-gray-900/95 flex flex-wrap items-center justify-center content-center gap-3 p-4 overflow-hidden `}
    >
      {/* {dimensions.width}
      {dimensions.height}
      {JSON.stringify(layout)} */}
      {layout ? (
        <>
          {currentPageParticipants.map(data => (
            <PeerTile key={data.id} peerData={data} layout={layout} />
          ))}
          <MyTile layout={layout} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PeerGrid;
