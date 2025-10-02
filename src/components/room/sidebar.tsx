import { cn } from '@/lib/utils';
import {
  useModalActions,
  useModalChatOpen,
  useModalParticipantsOpen,
} from '@/store/conf/hooks';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

const Sidebar = () => {
  const chatOpen = useModalChatOpen();
  const participantsOpen = useModalParticipantsOpen();
  const modalActions = useModalActions();

  return (
    <div
      className={cn(
        `bg-gray-800/50 w-0 shrink-0 p-3 transition-all duration-300 ease-in-out overflow-hidden rounded-xl`,
        (chatOpen || participantsOpen) && 'w-full max-w-[400px]'
      )}
    >
      <div className="flex flex-row items-center gap-x-3">
        <div className=" flex flex-1 gap-1 rounded-xl bg-black/50 p-1 ">
          <Button
            onClick={modalActions.toggleChatOpen}
            className={cn(
              ' flex-1 text-white font-normal bg-transparent   hover:bg-gray-800 cursor-pointer',
              chatOpen && ' bg-gray-800/80'
            )}
          >
            Chat
          </Button>
          <Button
            onClick={modalActions.toggleParticipantOpen}
            className={cn(
              ' flex-1 text-white font-normal bg-transparent   hover:bg-gray-800 cursor-pointer',
              participantsOpen && ' bg-gray-800/80'
            )}
          >
            Participants
          </Button>
        </div>
        <Button className="w-8 h-8 bg-gray-950/50 hover:bg-gray-950 ">
          <X className=" text-white" />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
