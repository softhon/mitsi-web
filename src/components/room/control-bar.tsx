import Mic from './mic';
import Camera from './camera';
import Hand from './hand';
import Emoji from './emoji';
import End from './end';
import Chat from './chat/chat';
import Users from './users';
import Menu from './menu';
import Screen from './screen';

const ControlBar = () => {
  return (
    <div className="p-2  backdrop-blur-sm flex">
      <div className="flex items-center justify-center md:justify-between gap-2 max-w-4xl mx-auto ">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          {/* Microphone */}
          <Mic />

          {/* Camera */}
          <Camera />

          {/* Screen Share */}
          <Screen />
        </div>

        {/* Center Controls */}
        <div className="hidden md:flex items-center gap-2">
          <Hand />
          <Emoji />
          {/* Leave Call */}
          <End />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 ">
          <span className=" md:hidden">
            <End />
          </span>
          <Chat />
          <Users />
          <Menu />
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
