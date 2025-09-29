import { useGridCalculator } from '@/hooks/use-grid-calculator';
import { cn, DEFAULT_GRID_CONFIG } from '@/lib/utils';
import { usePeerPosition, usePeerScreens } from '@/store/conf/hooks';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { PeerTile } from '../grid/peer-tile';
import MyTile from '../grid/my-tile';
import type { Dimensions } from '@/types';

const MainGrid = () => {
  const { calculateOptimalLayout } = useGridCalculator(DEFAULT_GRID_CONFIG);
  const gridRef = useRef<HTMLDivElement>(null);
  const peerScreens = usePeerScreens();
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const peerPositions = usePeerPosition();

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

  const { layout, currentPageParticipants } = useMemo(() => {
    const totalParticipants = peerPositions.length + 1; // 1 represent current peer

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
    const pageParticipants = peerPositions.slice(startIndex, endIndex);

    return {
      layout: optimalLayout,
      participantsPerPage: maxParticipantsPerPage,
      totalPages: pages,
      currentPageParticipants: pageParticipants,
    };
  }, [
    dimensions.height,
    dimensions.width,
    peerPositions,
    calculateOptimalLayout,
  ]);

  return (
    <div
      ref={gridRef}
      className={cn(
        `w-full h-full bg-gray-900/95 flex flex-wrap items-center justify-center content-center gap-3 py-2 overflow-hidden lg:min-w-[400px] xl:min-w-[450px] 2xl:min-w-[500px]`,
        peerScreens.length && 'xl:w-2/6 2xl:w-3/12'
      )}
    >
      {layout ? (
        <>
          {currentPageParticipants.map(data => (
            <PeerTile key={data.id} peerId={data.id} layout={layout} />
          ))}
          <MyTile layout={layout} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MainGrid;
