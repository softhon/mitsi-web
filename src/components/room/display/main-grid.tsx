import { useGridCalculator } from '@/hooks/use-grid-calculator';
import { cn, DEFAULT_GRID_CONFIG } from '@/lib/utils';
import {
  usePeerPosition,
  usePeerScreens,
  useScreenOn,
  useLayoutMode,
} from '@/store/conf/hooks';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { PeerTile } from '../grid/peer-tile';
import MyTile from '../grid/my-tile';
import { ActiveSpeakerGrid } from '../grid/active-speaker-grid';
import type { Dimensions } from '@/types';

const MainGrid = () => {
  const layoutMode = useLayoutMode();
  const { calculateOptimalLayout } = useGridCalculator(DEFAULT_GRID_CONFIG);
  const gridRef = useRef<HTMLDivElement>(null);
  const peerScreens = usePeerScreens();
  const screenOn = useScreenOn();
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
        `w-full h-full lg:h-full  flex flex-col items-center justify-center
        py-2 overflow-y-auto lg:min-w-[400px] xl:min-w-[450px] 2xl:min-w-[500px]`,
        (screenOn || peerScreens.length) && 'h-1/2 lg:w-1/3 xl:w-2/6 2xl:w-3/12'
      )}
    >
      {layoutMode === 'speaker' ? (
        <>
          {/* Active Speaker Grid */}
          <ActiveSpeakerGrid maxSpeakers={9} />
          {/* Gallery Grid (Compact) */}
          <div className="flex flex-wrap items-center justify-center content-center gap-2 mt-4">
            {layout ? (
              <>
                {currentPageParticipants.slice(0, 6).map(data => (
                  <PeerTile
                    key={data.id}
                    peerId={data.id}
                    layout={{
                      ...layout,
                      width: Math.min(layout.width, 150),
                      height: Math.min(layout.height, 112),
                    }}
                  />
                ))}
                <MyTile
                  layout={{
                    ...layout,
                    width: Math.min(layout.width, 150),
                    height: Math.min(layout.height, 112),
                  }}
                />
              </>
            ) : null}
          </div>
        </>
      ) : (
        // Regular Grid Mode
        <div className="w-full h-full flex flex-wrap items-center justify-center content-center gap-3">
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
      )}
    </div>
  );
};

export default MainGrid;
