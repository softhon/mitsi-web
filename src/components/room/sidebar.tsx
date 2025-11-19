import { cn } from '@/lib/utils';
import {
  useModalActions,
  useModalChatOpen,
  useModalParticipantsOpen,
} from '@/store/conf/hooks';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import ChatContainer from './chat/chat-container';
import ParticipantContainer from './participant/participant-container';
import { useCallback } from 'react';

const Sidebar = () => {
  const chatOpen = useModalChatOpen();
  const participantsOpen = useModalParticipantsOpen();
  const modalActions = useModalActions();

  const openParticipantsTab = useCallback(() => {
    if (!participantsOpen) modalActions.toggleParticipantOpen();
  }, [participantsOpen, modalActions]);

  const openChatTab = useCallback(() => {
    if (!chatOpen) modalActions.toggleChatOpen();
  }, [chatOpen, modalActions]);
  return (
    <div
      className={cn(
        `absolute lg:static z-10 h-full right-0 
        bg-linear-to-br from-slate-950 lg:from-white/5  via-slate-900 to-black lg:to-white/2
         w-0  shrink-0 transition-all duration-300 ease-in-out overflow-hidden  rounded-xl`,
        (chatOpen || participantsOpen) && 'w-full max-w-[400px]'
      )}
    >
      <div className="flex flex-col gap-3  w-full h-full  p-3">
        <div className="flex flex-row items-center gap-x-3">
          <div className=" flex flex-1 gap-1 rounded-xl bg-black/70 p-1 ">
            <Button
              onClick={openChatTab}
              className={cn(
                ' flex-1 text-white font-normal bg-transparent   hover:bg-gray-800 cursor-pointer',
                chatOpen && ' bg-gray-800/90'
              )}
            >
              Chat
            </Button>
            <Button
              onClick={openParticipantsTab}
              className={cn(
                ' flex-1 text-white font-normal bg-transparent   hover:bg-gray-800 cursor-pointer',
                participantsOpen && ' bg-gray-800/90'
              )}
            >
              Participants
            </Button>
          </div>
          <Button
            onClick={modalActions.closeChatAndParticipant}
            className="w-8 h-8 bg-gray-950/50 hover:bg-gray-950 "
          >
            <X className=" text-white" />
          </Button>
        </div>

        <ChatContainer />
        <ParticipantContainer />
      </div>
    </div>
  );
};

export default Sidebar;
