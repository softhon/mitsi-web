import { ArrowLeft, SendHorizonal, Smile } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import { v4 as uuidv4 } from 'uuid';
import { Assets } from '@/assets';
import { Typography } from '@/components/typography';
import { useSignaling } from '@/hooks/use-signaling';
import { cn } from '@/lib/utils';
import {
  useChatActions,
  useChats,
  useDmChats,
  useModalChatOpen,
  usePeerIds,
  usePeerMe,
  usePeerOthersById,
  useUnreadDm,
} from '@/store/conf/hooks';
import { Actions } from '@/types/actions';
import ChatItem from './chat-item';
import type { Chat, PeerData } from '@/types';

// ─── DM peer row (resolves peer data via hook) ────────────────────────────────
const DmPeerRow = ({
  peerId,
  onSelect,
}: {
  peerId: string;
  onSelect: (peer: PeerData) => void;
}) => {
  const peer = usePeerOthersById(peerId);
  const unreadDm = useUnreadDm();
  const unread = unreadDm[peerId] ?? 0;
  if (!peer) return null;
  return (
    <button
      onClick={() => onSelect(peer)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left"
    >
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
        {peer.name.charAt(0).toUpperCase()}
      </div>
      <span className="flex-1 text-sm text-white truncate">{peer.name}</span>
      {unread > 0 && (
        <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center shrink-0">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </button>
  );
};

// ─── DM thread view ───────────────────────────────────────────────────────────
const DmThread = ({
  peer,
  onBack,
}: {
  peer: PeerData;
  onBack: () => void;
}) => {
  const { signalingService } = useSignaling();
  const peerMe = usePeerMe();
  const dmChats = useDmChats();
  const [message, setMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const thread = dmChats[peer.id] ?? [];

  const handleSend = async () => {
    if (!signalingService || !peerMe || !message.trim()) return;
    const chatMessage: Chat = {
      id: uuidv4(),
      text: message,
      sender: peerMe,
      receiver: peer,
      isPrivate: true,
      createdAt: Date.now(),
    };
    signalingService.sendMessage({
      action: Actions.SendChat,
      args: { ...chatMessage },
    });
    setMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowPicker(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 pb-3 border-b border-white/10 mb-3 shrink-0">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
          {peer.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-white">{peer.name}</span>
      </div>

      {!thread.length ? (
        <div className="flex-1 flex justify-center items-center">
          <Typography variant="paragraph" className="text-center text-slate-400 text-sm">
            Send a private message to {peer.name}
          </Typography>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col justify-end gap-y-3">
            {thread.map(chat => (
              <ChatItem key={chat.id} chat={chat} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 mt-2 shrink-0">
        <div className="h-12 flex items-center gap-2 bg-gray-700/40 p-2 rounded-md">
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none border-none focus:border-none placeholder:text-gray-500 text-sm resize-none"
            placeholder={`Message ${peer.name}...`}
            onKeyDown={handleKeyDown}
          />
          <Smile onClick={() => setShowPicker(!showPicker)} className="cursor-pointer" />
          {showPicker && (
            <div style={{ position: 'absolute', bottom: '50px' }}>
              <EmojiPicker theme={Theme.DARK} onEmojiClick={handleEmojiClick} />
            </div>
          )}
          <SendHorizonal className="cursor-pointer" onClick={handleSend} />
        </div>
      </div>
    </div>
  );
};

// ─── Main container ───────────────────────────────────────────────────────────
const ChatContainer = () => {
  const chatOpen = useModalChatOpen();
  const { signalingService } = useSignaling();
  const peerMe = usePeerMe();
  const [message, setMessage] = useState('');
  const chats = useChats();
  const chatActions = useChatActions();
  const unreadDm = useUnreadDm();
  const peerIds = usePeerIds();
  const [showPicker, setShowPicker] = useState(false);
  const [tab, setTab] = useState<'everyone' | 'direct'>('everyone');
  const [selectedPeer, setSelectedPeer] = useState<PeerData | null>(null);

  const totalUnread = Object.values(unreadDm).reduce((a, b) => a + b, 0);

  const handleSendChat = async () => {
    if (!signalingService || !peerMe || !message.trim()) return;
    const chatMessage: Chat = {
      id: uuidv4(),
      text: message,
      sender: peerMe,
      createdAt: Date.now(),
    };
    signalingService.sendMessage({
      action: Actions.SendChat,
      args: { ...chatMessage },
    });
    chatActions.addChat(chatMessage);
    setMessage('');
  };

  const handleOnKeyPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowPicker(false);
  };

  const handleSelectPeer = (peer: PeerData) => {
    chatActions.clearUnread(peer.id);
    setSelectedPeer(peer);
  };

  return (
    <div
      className={cn(
        'hidden flex-col gap-3 w-full h-full flex-1 overflow-hidden transition-all duration-300 ease-in-out',
        chatOpen && 'flex'
      )}
    >
      {/* Tab bar */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1 shrink-0">
        <button
          onClick={() => setTab('everyone')}
          className={cn(
            'flex-1 py-1.5 rounded-md text-xs font-medium transition-colors',
            tab === 'everyone'
              ? 'bg-white/10 text-white'
              : 'text-slate-400 hover:text-white'
          )}
        >
          Everyone
        </button>
        <button
          onClick={() => {
            setTab('direct');
            setSelectedPeer(null);
          }}
          className={cn(
            'flex-1 py-1.5 rounded-md text-xs font-medium transition-colors relative',
            tab === 'direct'
              ? 'bg-white/10 text-white'
              : 'text-slate-400 hover:text-white'
          )}
        >
          Direct
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center">
              {totalUnread > 9 ? '9+' : totalUnread}
            </span>
          )}
        </button>
      </div>

      {/* Everyone tab */}
      {tab === 'everyone' && (
        <>
          {!chats.length ? (
            <div className="flex-1 flex justify-center items-center flex-col gap-2">
              <img src={Assets.emptyChat} alt="Empty Chat" className="w-3/5" />
              <Typography variant="h5">Start Conversation</Typography>
              <Typography variant="paragraph" className="text-center">
                There are no messages here yet. Start a conversation by sending a
                message.
              </Typography>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col justify-end gap-y-3">
                {chats.map(chat => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <div className="h-12 flex items-center gap-2 bg-gray-700/40 p-2 rounded-md">
              <textarea
                value={message}
                onChange={event => setMessage(event.target.value)}
                className="flex-1 bg-transparent focus:outline-none border-none focus:border-none placeholder:text-gray-500 text-sm resize-none"
                placeholder="Send a message..."
                onKeyDown={handleOnKeyPress}
              />
              <Smile onClick={() => setShowPicker(!showPicker)} />
              {showPicker && (
                <div style={{ position: 'absolute', bottom: '50px' }}>
                  <EmojiPicker theme={Theme.DARK} onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <SendHorizonal className="cursor-pointer" onClick={handleSendChat} />
            </div>
          </div>
        </>
      )}

      {/* Direct tab — thread view */}
      {tab === 'direct' && selectedPeer && (
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <DmThread peer={selectedPeer} onBack={() => setSelectedPeer(null)} />
        </div>
      )}

      {/* Direct tab — peer list */}
      {tab === 'direct' && !selectedPeer && (
        <div className="flex-1 overflow-y-auto">
          {peerIds.length === 0 ? (
            <div className="h-full flex justify-center items-center">
              <Typography variant="paragraph" className="text-slate-400 text-sm text-center">
                No other participants yet
              </Typography>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {peerIds.map(id => (
                <DmPeerRow key={id} peerId={id} onSelect={handleSelectPeer} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
