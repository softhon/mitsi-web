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
        'w-12 h-12 rounded-xl transition-all duration-200 bg-linear-to-bl text-white',
        isHandRaised
          ? 'from-white/10 hover:from-white/15 '
          : ' from-white/15 to-white/1  backdrop-blur-xl'
      )}
      title="Coming soon"
    >
      <HandIcon className="w-5 h-5" />
    </Button>
  );
};

export default Hand;
