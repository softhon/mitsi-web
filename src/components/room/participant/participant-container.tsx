import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  useModalParticipantsOpen,
  usePeerOthersKeys,
  usePeerCount,
  usePeerMe,
  useWaiters,
  useWaiterCount,
  useWaitersActions,
  usePeerIds,
} from '@/store/conf/hooks';
import { Search } from 'lucide-react';
import ParticipantItem from './participant-item';
import MyParticipantItem from './my-participant-item';
import VirtualParticipantList from './virtual-participant-list';
import WaiterItem from './waiter-item';
import { Tag } from '@/types';
import { Actions } from '@/types/actions';
import { useSignaling } from '@/hooks/use-signaling';
import { Button } from '@/components/ui/button';

const VIRTUAL_SCROLL_THRESHOLD = 50;

type TabType = 'inMeeting' | 'waiting';

const ParticipantContainer = () => {
  const participantsOpen = useModalParticipantsOpen();
  const peerOtherIds = usePeerOthersKeys();
  const peerCount = usePeerCount();
  const peerMe = usePeerMe();
  const peerIds = usePeerIds();
  const waiters = useWaiters();
  const waiterCount = useWaiterCount();
  const waitersActions = useWaitersActions();
  const { signalingService } = useSignaling();
  const useVirtualScrolling = peerCount > VIRTUAL_SCROLL_THRESHOLD;

  const [activeTab, setActiveTab] = useState<TabType>('inMeeting');
  const isModerator =
    peerMe?.tag === Tag.Host ||
    peerMe?.tag === Tag.Cohost ||
    peerMe?.tag === Tag.Moderator;

  const muteAll = () => {
    if (!peerIds.length) return;
    signalingService?.sendMessage({
      action: Actions.Mute,
      args: { peerIds },
    });
  };

  const lowerAllHands = () => {
    signalingService?.sendMessage({ action: Actions.LowerHands });
  };

  const admitAll = () => {
    if (!waiters.length) return;
    signalingService?.sendMessage({
      action: Actions.AdmitWaiters,
      args: { peerIds: waiters.map(w => w.id) },
    });
    waitersActions.clearWaiters();
  };

  return (
    <div
      className={cn(
        'hidden gap-y-3 flex-1 flex-col w-full h-full overflow-hidden transition-all duration-300 ease-in-out',
        participantsOpen && 'flex'
      )}
    >
      {/* Waiting Room tab — only visible to moderators */}
      {isModerator && (
        <div className="flex gap-1 bg-gray-700/30 rounded-md p-1">
          <button
            onClick={() => setActiveTab('inMeeting')}
            className={cn(
              'flex-1 text-xs py-1.5 rounded transition-colors',
              activeTab === 'inMeeting'
                ? 'bg-gray-600 text-white'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            In Meeting ({peerCount})
          </button>
          <button
            onClick={() => setActiveTab('waiting')}
            className={cn(
              'flex-1 text-xs py-1.5 rounded transition-colors relative',
              activeTab === 'waiting'
                ? 'bg-gray-600 text-white'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            Waiting ({waiterCount})
            {waiterCount > 0 && activeTab !== 'waiting' && (
              <span className="absolute top-0.5 right-1 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>
      )}

      {activeTab === 'inMeeting' && (
        <>
          <div className="h-12 flex items-center gap-2 bg-gray-700/40 p-2 rounded-md w-full">
            <Search size={20} />
            <input
              className="flex-1 bg-transparent focus:outline-none border-none focus:border-none placeholder:text-gray-500 text-sm"
              placeholder="Search for a participant..."
            />
          </div>
          {isModerator && peerIds.length > 0 && (
            <div className="flex gap-2">
              <Button
                onClick={muteAll}
                variant="ghost"
                className="flex-1 h-7 text-xs text-gray-400 hover:text-white hover:bg-gray-700/60"
              >
                Mute All
              </Button>
              <Button
                onClick={lowerAllHands}
                variant="ghost"
                className="flex-1 h-7 text-xs text-gray-400 hover:text-white hover:bg-gray-700/60"
              >
                Lower All Hands
              </Button>
            </div>
          )}
          <div className="flex flex-col gap-3 overflow-y-auto h-full">
            <MyParticipantItem />
            {useVirtualScrolling ? (
              <VirtualParticipantList />
            ) : (
              peerOtherIds.map(id => <ParticipantItem key={id} peerId={id} />)
            )}
          </div>
        </>
      )}

      {activeTab === 'waiting' && isModerator && (
        <div className="flex flex-col gap-3 overflow-y-auto h-full">
          {waiters.length > 0 && (
            <Button
              onClick={admitAll}
              className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white"
            >
              Admit All ({waiterCount})
            </Button>
          )}
          {waiters.length === 0 && (
            <p className="text-gray-500 text-sm text-center mt-4">
              No one is waiting
            </p>
          )}
          {waiters.map(waiter => (
            <WaiterItem key={waiter.id} waiter={waiter} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantContainer;
