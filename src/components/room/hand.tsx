import { Hand as HandIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const Hand = () => {
  const [isHandRaised, setIsHandRaised] = useState(false);

  return (
    <Button
      onClick={() => setIsHandRaised(!isHandRaised)}
      variant="ghost"
      size="icon"
      className={cn(
        'w-12 h-12 rounded-xl transition-all duration-200 bg-gradient-to-br text-white',
        isHandRaised
          ? 'bg-yellow-600 hover:bg-yellow-700 '
          : ' from-white/15 to-white/1  backdrop-blur-xl'
      )}
    >
      <HandIcon className="w-5 h-5" />
    </Button>
  );
};

export default Hand;
