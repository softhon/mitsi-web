import { Button } from '../ui/button';
import { Smile } from 'lucide-react';

const Emoji = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-12 h-12 rounded-xl text-white
      bg-linear-to-bl from-white/15 to-white/1  backdrop-blur-xl
      "
      title="Coming soon"
    >
      <Smile className="w-5 h-5" />
    </Button>
  );
};

export default Emoji;
