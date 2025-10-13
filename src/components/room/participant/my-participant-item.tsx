import { Typography } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { usePeerMe } from '@/store/conf/hooks';
import { Mic, MoreVertical } from 'lucide-react';

const MyParticipantItem = () => {
  const peerMe = usePeerMe();

  if (!peerMe) return null;
  return (
    <div className="flex gap-x-3  items-center ">
      <div className=" flex-1">
        <Typography variant="body-2">{peerMe.name} (me)</Typography>
      </div>
      <Button className=" bg-gray-700/90 rounded-full aspect-square h-8">
        <Mic className="text-white" />
      </Button>
      <span className=" bg-transparent text-white">
        <MoreVertical size={24} />
      </span>
    </div>
  );
};

export default MyParticipantItem;
