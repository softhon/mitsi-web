import { toast } from 'sonner';
import { Actions } from '@/types/actions';
import type { PeerData } from '@/types';
import type SignalingService from '@/services/signaling-service';

interface WaiterToastProps {
  waiter: PeerData;
  toastId: string | number;
  signalingService: SignalingService;
  onRemoveWaiter: (id: string) => void;
}

const WaiterToast = ({
  waiter,
  toastId,
  signalingService,
  onRemoveWaiter,
}: WaiterToastProps) => {
  const admit = () => {
    signalingService.sendMessage({
      action: Actions.AdmitWaiters,
      args: { peerIds: [waiter.id] },
    });
    onRemoveWaiter(waiter.id);
    toast.dismiss(toastId);
  };

  const decline = () => {
    signalingService.sendMessage({
      action: Actions.DeclineWaiters,
      args: { peerIds: [waiter.id] },
    });
    onRemoveWaiter(waiter.id);
    toast.dismiss(toastId);
  };

  return (
    <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl shadow-xl px-4 py-3 w-80">
      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
        {waiter.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{waiter.name}</p>
        <p className="text-slate-400 text-xs">wants to join</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={admit}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
        >
          Admit
        </button>
        <button
          onClick={decline}
          className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default WaiterToast;
