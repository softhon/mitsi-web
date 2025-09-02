import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationControlsProps } from '@/types';

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  show,
}) => {
  if (!show) return null;

  return (
    <div className="absolute top-1/2 transform -translate-y-1/2  w-full flex  justify-between pointer-events-none z-10 px-4 gap-4">
      <button
        onClick={onPrevious}
        disabled={currentPage === 0}
        className="pointer-events-auto bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black/50"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
        className="pointer-events-auto bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black/50"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
