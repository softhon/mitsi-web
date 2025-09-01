import { useState, useEffect } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

export const useDimensions = (showControls: boolean = true): Dimensions => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const headerHeight = showControls ? 64 : 0;
      const footerHeight = showControls ? 48 : 0;
      setDimensions({
        width: window.innerWidth - 32, // Account for padding
        height: window.innerHeight - headerHeight - footerHeight - 32,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [showControls]);

  return dimensions;
};
