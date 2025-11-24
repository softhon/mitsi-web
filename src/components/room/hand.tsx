import { Hand as HandIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import {
  useHandActions,
  useHandRaised,
  usePeerActions,
  usePeerMe,
} from '@/store/conf/hooks';
import { useCallback } from 'react';
import { useSignaling } from '@/hooks/use-signaling';
import { Actions } from '@/types/actions';

const Hand = () => {
  const { signalingService } = useSignaling();

  const handRaised = useHandRaised();
  const handActions = useHandActions();
  const peerActions = usePeerActions();
  const peerMe = usePeerMe();

  const handleHandRaise = useCallback(() => {
    if (!signalingService || !peerMe) return;
    signalingService.sendMessage({
      action: Actions.RaiseHand,
      args: { raised: !handRaised },
    });
    handActions.toggle();
    peerActions.updateCondition(peerMe.id, {
      hand: {
        raised: !handRaised,
        timestamp: Date.now(),
      },
    });
  }, [handRaised, handActions, signalingService, peerMe, peerActions]);

  return (
    <Button
      onClick={handleHandRaise}
      variant={handRaised ? 'default' : 'ghost'}
      size="icon"
      className={cn(
        'w-12 h-12 cursor-pointer rounded-xl transition-all duration-200 bg-linear-to-bl text-white',
        handRaised
          ? 'bg-blue-600 hover:bg-blue-700 '
          : ' from-white/15 to-white/1  backdrop-blur-xl'
      )}
    >
      <HandIcon className="w-5 h-5" />
    </Button>
  );
};

export default Hand;
