// import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users as UsersIcon } from 'lucide-react';
import { usePeersCount } from '@/store/conf/hooks';

const Users = () => {
  const count = usePeersCount();
  return (
    <Button
      // onClick={() => add()}
      variant="ghost"
      size="icon"
      className="w-12 h-12 rounded-xl bg-gray-700 hover:bg-gray-600 text-white relative"
    >
      <UsersIcon className="w-5 h-5" />
      <Badge
        variant="secondary"
        className="absolute -top-2 -right-2 w-6 h-6 text-xs bg-gray-600 text-white border-gray-500"
      >
        {count}
      </Badge>
    </Button>
  );
};

export default Users;
