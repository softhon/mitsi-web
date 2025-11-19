import { ChevronRightIcon, SendHorizonal, Smile, Users } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Assets } from '@/assets';
import { Typography } from '@/components/typography';
import { useSignaling } from '@/hooks/use-signaling';
import { cn } from '@/lib/utils';
import { useModalChatOpen, usePeerMe } from '@/store/conf/hooks';
import { Actions } from '@/types/actions';

const ChatContainer = () => {
  const chatOpen = useModalChatOpen();
  const { signalingService } = useSignaling();
  const peerMe = usePeerMe();
  const [message, setMessage] = useState('');

  const handleSendChat = async () => {
    if (!signalingService) return;
    signalingService.sendMessage({
      action: Actions.SendChat,
      args: {
        id: uuidv4(),
        text: message,
        sender: peerMe,
        createdAt: Date.now(),
      },
    });
    console.log(message, 'sent');
  };
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
        <div
          className=" h-12 flex items-center gap-2  bg-gray-700/40  p-2 rounded-md "
          title="Coming soon"
        >
          <textarea
            value={message}
            onChange={event => setMessage(event.target.value)}
            className=" flex-1 bg-transparent focus:outline-none border-none focus:border-none placeholder:text-gray-500 text-sm"
            placeholder="Send a message..."
          />
          <Smile />
          <SendHorizonal onClick={handleSendChat} />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
