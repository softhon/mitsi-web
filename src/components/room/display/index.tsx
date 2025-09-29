import Sidebar from '../sidebar';
import MainGrid from './main-grid';

const Display = () => {
  return (
    <div
      className={`${'fixed h-full inset-0 pl-2 pt-10 pb-18 flex flex-row w-full justify-between overflow-hidden '}`}
    >
      {/* screen sharing */}
      <div className=" bg-black w-5/6  rounded-2xl "></div>
      {/* peers grid */}
      <MainGrid />
      {/* chat and attendees */}
      <Sidebar />
    </div>
  );
};

export default Display;
