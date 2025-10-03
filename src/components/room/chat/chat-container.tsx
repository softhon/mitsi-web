import { Assets } from '@/assets';
import { Typography } from '@/components/typography';
import { cn } from '@/lib/utils';
import { useModalChatOpen } from '@/store/conf/hooks';

import { ChevronRightIcon, SendHorizonal, Smile, Users } from 'lucide-react';

const ChatContainer = () => {
  const chatOpen = useModalChatOpen();
  return (
    <div
      className={cn(
        'hidden flex-col gap-3 w-full flex-1 overflow-hidden transition-all duration-300 ease-in-out ',
        chatOpen && 'flex'
      )}
    >
      {/* content */}
      <div className=" flex-1 flex justify-center items-center flex-col  gap-2 ">
        <img src={Assets.emptyChat} alt="Emtpy Chat" className=" w-3/5 " />
        <Typography variant="h5">Start Conversation</Typography>
        <Typography variant="paragraph" className=" text-center">
          There are no messages here yet. Start a conversation by sending a
          message.
        </Typography>
      </div>
      {/* input */}
      <div className=" flex flex-col gap-2">
        <div className=" flex items-center text-xs gap-1 cursor-pointer">
          <span>To</span>
          <div className="text-xs h-5 px-2 gap-1 flex bg-blue-500 rounded-sm items-center">
            <Users size={12} />
            <span>Everyone</span>
            <ChevronRightIcon size={12} />
          </div>
        </div>
        <div className=" flex items-center gap-2  bg-gray-800/70 p-2 rounded-md ">
          <input
            className=" flex-1 bg-transparent focus:outline-none border-none focus:border-none placeholder:text-gray-500 text-sm"
            placeholder="Send a message..."
          />
          <Smile />
          <SendHorizonal />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
