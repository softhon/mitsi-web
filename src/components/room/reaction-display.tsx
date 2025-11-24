import { useReactionsEmojis } from '@/store/conf/hooks';
import ReactionItem from './reaction-item';

const ReactionDisplay = () => {
  const reactionsEmojis = useReactionsEmojis();
  return (
    <>
      {reactionsEmojis.map(reaction => (
        <ReactionItem key={reaction.id} {...reaction} />
      ))}
    </>
  );
};

export default ReactionDisplay;
