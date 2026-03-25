import { Typography } from '@/components/typography';
import { Button } from '@/components/ui/button';
import type { PeerData } from '@/types';
import { Actions } from '@/types/actions';
import { useSignaling } from '@/hooks/use-signaling';
import { useWaitersActions } from '@/store/conf/hooks';

const WaiterItem = ({ waiter }: { waiter: PeerData }) => {
  const { signalingService } = useSignaling();
  const waitersActions = useWaitersActions();

  const admit = () => {
    signalingService?.sendMessage({
      action: Actions.AdmitWaiters,
      args: { peerIds: [waiter.id] },
    });
    waitersActions.removeWaiter(waiter.id);
  };

  const decline = () => {
    signalingService?.sendMessage({
      action: Actions.DeclineWaiters,
      args: { peerIds: [waiter.id] },
    });
    waitersActions.removeWaiter(waiter.id);
  };

  return (
    <div className="flex gap-x-3 items-center py-1">
      <div className="flex-1">
        <Typography variant="body-2">{waiter.name}</Typography>
      </div>
      <Button
        onClick={admit}
        className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md"
      >
        Admit
      </Button>
      <Button
        onClick={decline}
        className="h-7 px-3 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-md"
      >
        Decline
      </Button>
    </div>
  );
};

export default WaiterItem;
