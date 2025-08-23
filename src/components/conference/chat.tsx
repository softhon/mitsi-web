import React, { useState } from 'react';
import { Button } from '../ui/button';
import { MessageSquare } from 'lucide-react';

const Chat = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <Button
      onClick={() => setShowChat(!showChat)}
      variant="ghost"
      size="icon"
      className="w-12 h-12 rounded-xl bg-gray-700 hover:bg-gray-600 text-white relative"
    >
      <MessageSquare className="w-5 h-5" />
      {/* Chat notification */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
    </Button>
  );
};

export default Chat;
