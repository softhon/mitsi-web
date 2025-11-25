import { Button } from '../ui/button';
import { CircleStop, LogOut, MoreVertical, PhoneOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useCautionActions } from '@/store/conf/hooks';
import { CautionType } from '@/types';
import { useSignaling } from '@/hooks/use-signaling';
import { Actions } from '@/types/actions';

const End = () => {
  const cautionActions = useCautionActions();
  const { signalingService } = useSignaling();

  const handleLeaveCall = () => {
    signalingService?.sendMessage({
      action: Actions.EndRoom,
    });
  };
  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={handleLeaveCall}
        // variant="def"
        size="icon"
        className="w-12 h-12 rounded-xl bg-red-500 hover:bg-red-500/90 text-white ml-4 cursor-pointer"
      >
        <PhoneOff className="w-5 h-5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-linear-to-bl from-slate-900 to-slate-800">
          <DropdownMenuItem
            onClick={() => window.location.reload()}
            className="focus:bg-white/8"
          >
            <LogOut /> Leave
          </DropdownMenuItem>
          <DropdownMenuSeparator></DropdownMenuSeparator>
          <DropdownMenuItem
            onClick={() => cautionActions.set(CautionType.EndSession)}
            className="focus:bg-white/8"
          >
            <CircleStop /> End For All
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default End;
