import { cn } from '@/lib/utils';
import { useModalChatOpen, useModalParticipantsOpen } from '@/store/conf/hooks';

const Sidebar = () => {
  const chatOpen = useModalChatOpen();
  const participantsOpen = useModalParticipantsOpen();

  return (
    <div
      className={cn(
        `bg-purple-500 w-0 shrink-0 transition-all duration-300 ease-in-out`,
        (chatOpen || participantsOpen) && 'w-full max-w-[400px]'
      )}
    >
      Sidebar
    </div>
  );
};

export default Sidebar;
