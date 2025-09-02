import { twMerge } from 'tailwind-merge';

const ChatContainer = ({ showChat }: { showChat: boolean }) => {
  return (
    <div
      className={twMerge(
        `transition-all duration-300 ease-in-out py-4 pr-4 `,
        showChat ? 'w-[460px] ' : 'w-[0px] py-0 pr-0'
      )}
    >
      <div className=" bg-gray-500 w-full  rounded-xl  h-full">
        ChatContainer
      </div>
    </div>
  );
};

export default ChatContainer;
