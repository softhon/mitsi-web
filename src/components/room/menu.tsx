import { Button } from '../ui/button';
import {
  Fullscreen,
  // Image,
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
import { useSettingsActions } from '@/store/conf/hooks';
import { useCallback, useState } from 'react';

const Menu = () => {
  const [fullScreen, setFullScreen] = useState(false);
  const settingsAction = useSettingsActions();
  const makeFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setFullScreen(prev => !prev);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-xl  text-white
      bg-linear-to-tl from-white/15 to-white/1  backdrop-blur-xl
       cursor-pointer"
        >
          <MenuIcon className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-linear-to-bl from-slate-900 to-slate-800">
        <DropdownMenuItem onClick={makeFullScreen} className="focus:bg-white/8">
          <Fullscreen /> {fullScreen ? 'Exit' : 'Go'} Fullscreen
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={settingsAction.toggle}
          className="focus:bg-white/8"
        >
          <Settings /> Settings
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
          <Image /> Background Effect
        </DropdownMenuItem> */}
        <DropdownMenuSeparator></DropdownMenuSeparator>

        <DropdownMenuItem
          onClick={() =>
            window.open('https://github.com/softhon/mitsi-web/issues', '_blank')
          }
          className="focus:bg-white/8"
        >
          <MessageSquareWarning /> Issue/Feedback
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;
