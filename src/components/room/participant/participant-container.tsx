import { cn } from '@/lib/utils';
import {
  useModalParticipantsOpen,
  usePeerOthersKeys,
} from '@/store/conf/hooks';
import { Search } from 'lucide-react';
import ParticipantItem from './participant-item';
import MyParticipantItem from './my-participant-item';

const ParticipantContainer = () => {
  const participantsOpen = useModalParticipantsOpen();
  const peerOtherIds = usePeerOthersKeys();

  return (
    <div
      className={cn(
        'hidden gap-y-3 flex-1  flex-col w-full h-full overflow-hidden transition-all duration-300 ease-in-out ',
        participantsOpen && 'flex'
      )}
    >
      <div className=" h-12 flex items-center gap-2 bg-gray-700/40  p-2 rounded-md  w-full">
        <Search size={20} />
        <input
          className=" flex-1 bg-transparent focus:outline-none border-none focus:border-none placeholder:text-gray-500 text-sm"
          placeholder="Search for a participant..."
        />
      </div>
      <div className=" flex flex-col gap-3 overflow-y-auto h-full  ">
        <MyParticipantItem />
        {peerOtherIds.map(id => (
          <ParticipantItem key={id} peerId={id} />
        ))}
      </div>
    </div>
  );
};

export default ParticipantContainer;
