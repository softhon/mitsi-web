import type { GridCalculatorConfig, Layout } from '@/types';
import { useCallback } from 'react';

export const useGridCalculator = (config: GridCalculatorConfig) => {
  const calculateOptimalLayout = useCallback(
    (
      containerWidth: number,
      containerHeight: number,
      participantCount: number
    ): Layout | null => {
      let bestLayout: Layout | null = null;
      let maxArea = 0;

      // Try different row/column combinations
      for (let cols = 1; cols <= participantCount; cols++) {
        const rows = Math.ceil(participantCount / cols);

        // Try different aspect ratios
        for (const aspectRatio of config.aspectRatios) {
          const itemWidth = Math.floor(
            (containerWidth - (cols + 1) * config.gap) / cols
          );
          const itemHeight = Math.floor(
            (containerHeight - (rows + 1) * config.gap) / rows
          );

          // Calculate dimensions based on aspect ratio
          let finalWidth: number, finalHeight: number;

          if (itemWidth / itemHeight > aspectRatio.ratio) {
            // Width is limiting factor
            finalHeight = itemHeight;
            finalWidth = Math.min(itemWidth, finalHeight * aspectRatio.ratio);
          } else {
            // Height is limiting factor
            finalWidth = itemWidth;
            finalHeight = Math.min(itemHeight, finalWidth / aspectRatio.ratio);
          }

          // Check minimum size constraint
          if (finalWidth >= config.minSize && finalHeight >= config.minSize) {
            const totalArea = finalWidth * finalHeight * participantCount;

            if (totalArea > maxArea) {
              maxArea = totalArea;
              bestLayout = {
                rows,
                cols,
                width: finalWidth,
                height: finalHeight,
                aspectRatio: aspectRatio.name,
              };
            }
          }
        }
      }

      return bestLayout;
    },
    [config]
  );

  return { calculateOptimalLayout };
};
