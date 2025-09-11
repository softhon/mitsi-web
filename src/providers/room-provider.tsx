import type { ReactNode } from 'react';

const RoomProvider = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default RoomProvider;
