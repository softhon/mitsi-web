import { Button } from '../ui/button';
import { Menu as MenuIcon } from 'lucide-react';

const Menu = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-12 h-12 rounded-xl bg-gray-700 hover:bg-gray-600 text-white"
    >
      <MenuIcon className="w-5 h-5" />
    </Button>
  );
};

export default Menu;
