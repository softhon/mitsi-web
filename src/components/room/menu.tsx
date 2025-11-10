import { Button } from '../ui/button';
import { Menu as MenuIcon } from 'lucide-react';

const Menu = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-12 h-12 rounded-xl  text-white
      bg-linear-to-tl from-white/15 to-white/1  backdrop-blur-xl
      "
      title="Coming soon"
    >
      <MenuIcon className="w-5 h-5" />
    </Button>
  );
};

export default Menu;
