import { useCallback, useEffect, useMemo, useState } from 'react';
import { GridContainer } from './grid-container';
import { PaginationControls } from './pagination-controls';
import { useDimensions } from '@/hooks/use-dimensions';
import { DEFAULT_GRID_CONFIG } from '@/lib/utils';
import { useGridCalculator } from '@/hooks/use-grid-calculator';
// import ChatContainer from '../chat/chat-container';
import { usePeerOthersValues } from '@/store/conf/hooks';

const MAX_PARTICIPANTS_PER_PAGE = 25; // Hard limit to prevent overloading

export const ConferenceGrid = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const peers = usePeerOthersValues();

  const dimensions = useDimensions(true, false);
  const { calculateOptimalLayout } = useGridCalculator(DEFAULT_GRID_CONFIG);

  // Calculate layout and pagination
  const { layout, totalPages, currentPageParticipants } = useMemo(() => {
    const totalParticipants = peers.length + 1; // 1 represent current peer
    if (totalParticipants === 0) {
      return {
        layout: null,
        participantsPerPage: 0,
        totalPages: 0,
        currentPageParticipants: [],
      };
    }

    // Find maximum participants that can fit on one page (capped at MAX_PARTICIPANTS_PER_PAGE)
    let maxParticipantsPerPage = Math.min(
      totalParticipants,
      MAX_PARTICIPANTS_PER_PAGE
    );
    let optimalLayout = calculateOptimalLayout(
      dimensions.width,
      dimensions.height,
      maxParticipantsPerPage
    );

    // If no layout fits the target count, reduce the count
    if (!optimalLayout) {
      for (let count = maxParticipantsPerPage - 1; count >= 1; count--) {
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
    const startIndex = currentPage * maxParticipantsPerPage;
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
  }, [peers, dimensions, currentPage, calculateOptimalLayout]);

  // Reset to first page if current page is out of bounds
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [currentPage, totalPages]);

  // Pagination handlers with loading state
  const handlePrevious = useCallback(() => {
    if (currentPage > 0) {
      setIsLoading(true);
      setCurrentPage(currentPage - 1);
      // Allow render cycle to complete
      setTimeout(() => setIsLoading(false), 100);
    }
  }, [currentPage]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setIsLoading(true);
      setCurrentPage(currentPage + 1);
      // Allow render cycle to complete
      setTimeout(() => setIsLoading(false), 100);
    }
  }, [currentPage, totalPages]);

  // className={`${showControls ? 'fixed inset-0 pt-10 pb-14 flex flex-row w-full justify-between overflow-hidden ' : 'relative w-full h-full'}`}

  return (
    <div
      className={`${'fixed inset-0 pt-10 pb-14 flex flex-row w-full justify-between overflow-hidden '}`}
    >
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={handlePrevious}
        onNext={handleNext}
        show={totalPages > 1}
      />

      {/* Grid Container with Loading Overlay */}
      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-white text-sm">Loading...</p>
            </div>
          </div>
        )}
        <GridContainer peerData={currentPageParticipants} layout={layout} />
      </div>

      {/* <ChatContainer showChat={false} /> */}
    </div>
  );
};
