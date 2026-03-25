import { Button } from '@/components/ui/button';
import { useLayoutMode, useLayoutActions } from '@/store/conf/hooks';
import { Grid3x3, User } from 'lucide-react';

const LayoutToggle = () => {
  const layoutMode = useLayoutMode();
  const { toggleMode } = useLayoutActions();

  return (
    <Button
      onClick={toggleMode}
      variant="ghost"
      size="icon"
      className="relative w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition-all"
      title={
        layoutMode === 'grid' ? 'Switch to Speaker View' : 'Switch to Grid View'
      }
    >
      {layoutMode === 'grid' ? (
        <User className="w-5 h-5" />
      ) : (
        <Grid3x3 className="w-5 h-5" />
      )}
    </Button>
  );
};

export default LayoutToggle;
