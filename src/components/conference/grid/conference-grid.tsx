import { useCallback, useEffect, useMemo, useState } from 'react';
import { GridContainer } from './grid-container';
import { PaginationControls } from './pagination-controls';
import { useDimensions } from '@/hooks/use-dimensions';
import { DEFAULT_GRID_CONFIG } from '@/lib/utils';
import { useGridCalculator } from '@/hooks/use-grid-calculator';
import ChatContainer from '../chat/chat-container';
import { usePeerOthersList } from '@/store/conf/hooks';

export const ConferenceGrid = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const peers = usePeerOthersList();

  const dimensions = useDimensions(true, false);
  const { calculateOptimalLayout } = useGridCalculator(DEFAULT_GRID_CONFIG);

  // Calculate layout and pagination
  const { layout, totalPages, currentPageParticipants } = useMemo(() => {
    const totalParticipants = peers.length; // 1 represent current peer
    if (totalParticipants === 0) {
      return {
        layout: null,
        participantsPerPage: 0,
        totalPages: 0,
        currentPageParticipants: [],
      };
    }

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

  // Pagination handlers
  const handlePrevious = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
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

      {/* Grid Container */}
      <GridContainer participants={currentPageParticipants} layout={layout} />

      <ChatContainer showChat={false} />
    </div>
  );
};
