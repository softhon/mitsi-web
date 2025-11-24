import { cn, emojiIcons } from '@/lib/utils';
import { usePeerMe } from '@/store/conf/hooks';
import type { EmojiReaction } from '@/types';
import { memo } from 'react';

const ReactionItem: React.FC<EmojiReaction> = memo(
  ({ name, sender, position }) => {
    const peerMe = usePeerMe();

    if (!name) return null;
    return (
      <div
        style={{
          left: `${parseInt(position) / 5}%`,
        }}
        className={cn(
          'flex z-50 w-32 absolute flex-col justify-center items-center riseAndFade'
        )}
      >
        <img src={emojiIcons[name]} alt={name} width="35" height="35" />
        <span className="text-center rounded-lg px-1  text-[10px] md:text-[12px] font-medium">
          {peerMe?.id === sender.id ? 'You' : sender.name}
        </span>
      </div>
    );
  }
);

export default ReactionItem;
