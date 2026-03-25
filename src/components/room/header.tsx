import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  useRoomLocked,
  useRoomRecording,
  usePeerMe,
  useRoomData,
} from '@/store/conf/hooks';
import { useSignaling } from '@/hooks/use-signaling';
import { Actions } from '@/types/actions';
import { Tag } from '@/types';
import { Lock, Unlock } from 'lucide-react';

const Header = () => {
  const recording = useRoomRecording();
  const locked = useRoomLocked();
  const peerMe = usePeerMe();
  const roomData = useRoomData();
  const { signalingService } = useSignaling();

  const isHost = peerMe?.tag === Tag.Host;

  const toggleLock = () => {
    signalingService?.sendMessage({
      action: Actions.LockRoom,
      args: { locked: !locked },
    });
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {recording && (
          <Badge className="bg-red-600 hover:bg-red-700 text-white">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
            <span className="text-xs">REC</span>
          </Badge>
        )}
        {locked && !isHost && (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-400 text-xs gap-1"
          >
            <Lock size={10} />
            Locked
          </Badge>
        )}
      </div>
      {roomData?.roomId && (
        <span className="text-white/40 text-xs font-mono tracking-wide hidden sm:block">
          {roomData.roomId}
        </span>
      )}
      <div className="flex items-center">
        {isHost && (
          <Button
            onClick={toggleLock}
            variant="ghost"
            size="sm"
            title={locked ? 'Unlock room' : 'Lock room'}
            className={
              locked
                ? 'cursor-pointer text-yellow-400 hover:text-yellow-300 hover:bg-white/10'
                : 'cursor-pointer text-gray-400 hover:text-white hover:bg-white/10'
            }
          >
            {locked ? <Lock size={16} /> : <Unlock size={16} />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
