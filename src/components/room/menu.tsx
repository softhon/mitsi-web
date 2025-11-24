import { Button } from '../ui/button';
import {
  Fullscreen,
  Image,
  Menu as MenuIcon,
  MessageSquareWarning,
  Settings,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const Menu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-linear-to-bl from-slate-900 to-slate-800">
        <DropdownMenuItem>
          <Fullscreen /> Go Fullscreen
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Image /> Background Effect
        </DropdownMenuItem>
        <DropdownMenuSeparator></DropdownMenuSeparator>
        <DropdownMenuItem>
          <Settings /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MessageSquareWarning /> Report/Feedback
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;
