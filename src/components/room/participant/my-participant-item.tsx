import { Typography } from '@/components/typography';
import { usePeerMe } from '@/store/conf/hooks';
import { Tag } from '@/types';

const MyParticipantItem = () => {
  const peerMe = usePeerMe();

  if (!peerMe) return null;
  return (
    <div className="flex gap-x-3 items-center">
      <div className="flex-1">
        <Typography variant="body-2">
          {peerMe.name} (me)
          {peerMe.tag === Tag.Host && (
            <span className="ml-2 text-xs text-blue-400">(host)</span>
          )}
          {peerMe.tag === Tag.Cohost && (
            <span className="ml-2 text-xs text-blue-300">(co-host)</span>
          )}
        </Typography>
      </div>
    </div>
  );
};

export default MyParticipantItem;
