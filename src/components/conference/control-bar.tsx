import Mic from './mic';
import Camera from './camera';
import Display from './display';
import Hand from './hand';
import Emoji from './emoji';
import End from './end';
import Chat from './chat';
import Users from './users';
import Menu from './menu';

const ControlBar = () => {
  return (
    <div className="p-4 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          {/* Microphone */}
          <Mic />

          {/* Camera */}
          <Camera />

          {/* Screen Share */}
          <Display />
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-2">
          <Hand />
          <Emoji />
          {/* Leave Call */}
          <End />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <Chat />
          <Users />
          <Menu />
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
