import { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Monitor } from 'lucide-react';

const Screen = () => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  return (
    <Button
      onClick={() => setIsScreenSharing(!isScreenSharing)}
      variant="ghost"
      size="icon"
      className={cn(
        'w-12 h-12 rounded-xl transition-all duration-200',
        isScreenSharing
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'bg-gray-700 hover:bg-gray-600 text-white'
      )}
    >
      <Monitor className="w-5 h-5" />
    </Button>
  );
};

export default Screen;
