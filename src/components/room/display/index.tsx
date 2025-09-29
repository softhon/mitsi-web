import PeerGrid from './peer-grid';

const Display = () => {
  return (
    <div
      className={`${'fixed inset-0 pt-10 pb-14 flex flex-row w-full justify-between overflow-hidden '} bg-amber-600`}
    >
      {/* screen sharing */}
      <div className=" bg-teal-500">screen sharing</div>
      {/* peers grid */}
      <PeerGrid />
      {/* chat and attendees */}
      <div className=" bg-purple-500 w-96 shrink-0">chat and attendees</div>
    </div>
  );
};

export default Display;
