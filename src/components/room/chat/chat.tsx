// import React, { useState } from 'react';
import { useModalActions } from '@/store/conf/hooks';
import { Button } from '../../ui/button';
import { MessageSquare } from 'lucide-react';

const Chat = () => {
  const modalActions = useModalActions();
  return (
    <Button
      onClick={modalActions.toggleChatOpen}
      variant="ghost"
      size="icon"
      className="w-12 h-12 rounded-xl  text-white relative
      bg-gradient-to-br from-white/15 to-white/1  backdrop-blur-xl
      "
    >
      <MessageSquare className="w-5 h-5" />
      {/* Chat notification */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
    </Button>
  );
};

export default Chat;
