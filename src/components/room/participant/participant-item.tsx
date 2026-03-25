import { Typography } from '@/components/typography';
import { usePeerOthersById, usePeerMe } from '@/store/conf/hooks';
import { Role, Tag } from '@/types';
import { Actions } from '@/types/actions';
import { useSignaling } from '@/hooks/use-signaling';
import { MicOff, UserX, Shield } from 'lucide-react';

const ParticipantItem = ({ peerId }: { peerId: string }) => {
  const peerData = usePeerOthersById(peerId);
  const peerMe = usePeerMe();
  const { signalingService } = useSignaling();

  const isModerator =
    peerMe?.tag === Tag.Host ||
    peerMe?.tag === Tag.Cohost ||
    peerMe?.tag === Tag.Moderator;

  const isHost = peerMe?.tag === Tag.Host;
  const isCohost = peerData?.tag === Tag.Cohost;

  const forceMute = () => {
    signalingService?.sendMessage({
      action: Actions.Mute,
      args: { peerIds: [peerId] },
    });
  };

  const removePeer = () => {
    signalingService?.sendMessage({
      action: Actions.RemovePeer,
      args: { peerId },
    });
  };

  const toggleCohost = () => {
    signalingService?.sendMessage({
      action: isCohost ? Actions.RemoveRole : Actions.AddRole,
      args: { peerId, role: Role.Moderator, tag: Tag.Cohost },
    });
  };

  if (!peerData) return null;

  return (
    <div className="flex gap-x-3 items-center group">
      <div className="flex-1">
        <Typography variant="body-2">
          {peerData.name}
          {peerData.tag === Tag.Host && (
            <span className="ml-2 text-xs text-blue-400">(host)</span>
          )}
          {peerData.tag === Tag.Cohost && (
            <span className="ml-2 text-xs text-blue-300">(co-host)</span>
          )}
        </Typography>
      </div>
      {isModerator && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isHost && (
            <button
              onClick={toggleCohost}
              title={isCohost ? 'Remove co-host' : 'Make co-host'}
              className={`p-1 rounded transition-colors ${
                isCohost
                  ? 'text-blue-400 hover:bg-gray-600 hover:text-white'
                  : 'text-gray-400 hover:bg-gray-600 hover:text-white'
              }`}
            >
              <Shield size={14} />
            </button>
          )}
          <button
            onClick={forceMute}
            title="Mute"
            className="p-1 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
          >
            <MicOff size={14} />
          </button>
          <button
            onClick={removePeer}
            title="Remove"
            className="p-1 rounded hover:bg-red-700 text-gray-400 hover:text-white transition-colors"
          >
            <UserX size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipantItem;
