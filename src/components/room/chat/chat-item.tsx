import { Typography } from '@/components/typography';
import { convertTimestampTo12HourTime } from '@/lib/utils';
import type { Chat } from '@/types';

const ChatItem = ({ chat }: { chat: Chat }) => {
  return (
    <div
      key={chat.id}
      className=" flex w-full flex-col bg-black/20 p-2 rounded-lg gap-y-1"
    >
      <div className="flex flex-row  items-center justify-between ">
        <Typography variant="subtitle-2">{chat.sender.name}</Typography>
        <Typography variant="overline" className=" text-white/40 font-light">
          {convertTimestampTo12HourTime(chat.createdAt)}
        </Typography>
      </div>
      <div>
        <Typography
          variant="body-2"
          className=" font-light text-white/60 whitespace-pre-wrap"
        >
          {chat.text}
        </Typography>
      </div>
    </div>
  );
};

export default ChatItem;
