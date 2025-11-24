// import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users as UsersIcon } from 'lucide-react';
import { useModalActions, usePeersCount } from '@/store/conf/hooks';

const Users = () => {
  const count = usePeersCount();
  const modalActions = useModalActions();

  return (
    <Button
      onClick={modalActions.toggleParticipantOpen}
      variant="ghost"
      size="icon"
      className="w-12 h-12 rounded-xl bg-linear-to-bl from-white/15 to-white/1  backdrop-blur-xl text-white relative cursor-pointer"
    >
      <UsersIcon className="w-5 h-5" />
      <Badge
        variant="secondary"
        className="absolute -top-2 -right-2 w-6 h-6 text-xs  text-white border-gray-500"
      >
        {count}
      </Badge>
    </Button>
  );
};

export default Users;
