import { useMemo } from 'react';
import { List, type ListProps } from 'react-window';
import { usePeerIds } from '@/store/conf/hooks';
import ParticipantItem from './participant-item';

const VirtualParticipantList = () => {
  const peerIds = usePeerIds();

  // Memoize row component to prevent unnecessary re-renders
  const MemoizedRowComponent = useMemo<
    ListProps<{ peerId: string }>['rowComponent']
  >(
    () =>
      ({ index, style }) => {
        const peerId = peerIds[index];
        return (
          <div style={style}>
            <ParticipantItem peerId={peerId} />
          </div>
        );
      },
    [peerIds]
  );

  return (
    <List
      defaultHeight={600} // Adjust based on container height
      rowCount={peerIds.length}
      rowHeight={64} // Height of each participant item
      rowComponent={MemoizedRowComponent}
      rowProps={{ peerId: '' }} // Placeholder, actual peerId comes from index
    />
  );
};

export default VirtualParticipantList;
