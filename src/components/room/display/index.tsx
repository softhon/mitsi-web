import Sidebar from '../sidebar';
import MainGrid from './main-grid';

const Display = () => {
  return (
    <div
      className={`${'fixed inset-0 pt-10 pb-14 flex flex-row w-full justify-between overflow-hidden '} bg-amber-600`}
    >
      {/* screen sharing */}
      <div className=" bg-teal-500">screen sharing</div>
      {/* peers grid */}
      <MainGrid />
      {/* chat and attendees */}
      <Sidebar />
    </div>
  );
};

export default Display;
