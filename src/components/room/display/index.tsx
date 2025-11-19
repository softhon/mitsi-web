import Sidebar from '../sidebar';
import MainGrid from './main-grid';
import ScreenView from './screen-view';

const Display = () => {
  return (
    <div
      className={`${'fixed inset-0  pt-4 pb-18 px-3 h-full w-full  overflow-hidden '}`}
    >
      <div className="relative h-full w-full flex flex-row justify-between ">
        {/* change padding to pt-10 */}
        {/* screen sharing */}
        <ScreenView />
        {/* peers grid */}
        <MainGrid />
        {/* chat and attendees */}
        <Sidebar />
      </div>
    </div>
  );
};

export default Display;
