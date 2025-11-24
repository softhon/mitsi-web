import { Button } from '../ui/button';
import { Smile } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { emojiIcons } from '@/lib/utils';
import type { EmojiNames, EmojiReaction } from '@/types';
import { usePeerMe, useReactionsActions } from '@/store/conf/hooks';
import { useSignaling } from '@/hooks/use-signaling';
import { Actions } from '@/types/actions';

const Emoji = () => {
  const { signalingService } = useSignaling();
  const reactionsActions = useReactionsActions();
  const peerMe = usePeerMe();
  const iconSize = 25;

  const sendReactions = (name: EmojiNames) => {
    if (!signalingService || !peerMe) return;
    const reactions: EmojiReaction = {
      id: crypto.randomUUID(),
      name: name,
      sender: peerMe,
      position: `${Math.random() * 80 + 10}%`,
      timestamp: Date.now(),
    };

    signalingService.sendMessage({
      action: Actions.SendReaction,
      args: { ...reactions },
    });
    reactionsActions.add(reactions);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 cursor-pointer rounded-xl text-white bg-linear-to-bl from-white/15 to-white/1  backdrop-blur-xl"
        >
          <Smile className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-2 w-full bg-linear-to-bl from-slate-900 to-slate-800">
        <div className=" flex gap-x-1 ">
          <div
            onClick={() => sendReactions('thumbsUp')}
            className=" cursor-pointer w-fit p-1 hover:bg-white/10 rounded-full"
          >
            <img
              src={emojiIcons.thumbsUp}
              alt="Thumbs Up"
              width={iconSize}
              height={iconSize}
            />
          </div>

          <div
            onClick={() => sendReactions('clappingHand')}
            className=" cursor-pointer w-fit p-1 hover:bg-white/10 rounded-full"
          >
            <img
              src={emojiIcons.clappingHand}
              alt="Clapping Hands"
              width={iconSize}
              height={iconSize}
            />
          </div>

          <div
            onClick={() => sendReactions('raisingHand')}
            className=" cursor-pointer w-fit p-1 hover:bg-white/10 rounded-full"
          >
            <img
              src={emojiIcons.raisingHand}
              alt="Raising Hands"
              width={iconSize}
              height={iconSize}
            />
          </div>

          <div
            onClick={() => sendReactions('partyPopper')}
            className=" cursor-pointer w-fit p-1 hover:bg-white/10 rounded-full"
          >
            <img
              src={emojiIcons.partyPopper}
              alt="Party Popper"
              width={iconSize}
              height={iconSize}
            />
          </div>

          <div
            onClick={() => sendReactions('fire')}
            className=" cursor-pointer w-fit p-1 hover:bg-white/10 rounded-full"
          >
            <img
              src={emojiIcons.fire}
              alt="Fire"
              width={iconSize}
              height={iconSize}
            />
          </div>
          <div
            onClick={() => sendReactions('redHeart')}
            className=" cursor-pointer w-fit p-1 hover:bg-white/10 rounded-full"
          >
            <img
              src={emojiIcons.redHeart}
              alt="Red Heart"
              width={iconSize}
              height={iconSize}
            />
          </div>

          <div
            onClick={() => sendReactions('huggingFace')}
            className=" cursor-pointer w-fit p-1 hover:bg-white/10 rounded-full"
          >
            <img
              src={emojiIcons.huggingFace}
              alt="Hugging Face"
              width={iconSize}
              height={iconSize}
            />
          </div>
          <div
            onClick={() => sendReactions('tearsJoy')}
            className=" cursor-pointer w-fit p-1 hover:bg-white/10 rounded-full"
          >
            <img
              src={emojiIcons.tearsJoy}
              alt="Face with Tears of Joy"
              width={iconSize}
              height={iconSize}
            />
          </div>

          <div
            onClick={() => sendReactions('cryingFace')}
            className=" cursor-pointer w-fit p-1 hover:bg-white/10 rounded-full"
          >
            <img
              src={emojiIcons.cryingFace}
              alt="Crying Face"
              width={iconSize}
              height={iconSize}
            />
          </div>

          <div
            onClick={() => sendReactions('thinkingFace')}
            className=" cursor-pointer w-fit p-1 hover:bg-white/10 rounded-full"
          >
            <img
              src={emojiIcons.thinkingFace}
              alt="Thinking Face"
              width={iconSize}
              height={iconSize}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Emoji;
