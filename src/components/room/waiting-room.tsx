import { Loader2 } from 'lucide-react';
import { useRoomAccess } from '@/store/conf/hooks';
import { Access } from '@/types';
import DynamicBg from '@/components/dynamic-bg';

const WaitingRoom = () => {
  const access = useRoomAccess();
  const declined = access === Access.Declined;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center p-4">
      <DynamicBg />
      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-sm">
        {declined ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center">
              <span className="text-3xl">✕</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Entry declined
              </h2>
              <p className="text-slate-400 text-sm">
                The host has declined your request to join this meeting.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Waiting to be admitted
              </h2>
              <p className="text-slate-400 text-sm">
                The host will let you in soon. Please wait.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;
