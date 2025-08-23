import { Button } from '../ui/button';
import { Smile } from 'lucide-react';

const Emoji = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-12 h-12 rounded-xl bg-gray-700 hover:bg-gray-600 text-white"
    >
      <Smile className="w-5 h-5" />
    </Button>
  );
};

export default Emoji;
