import { Dialog, DialogContent } from '../ui/dialog';

const FullScreenModal = () => {
  // const { getTrack, getConsumer } = useMedia();
  // const peerMe = usePeerMe();
  // const videoRef = useRef<HTMLVideoElement>(null);

  // const fullscreenActive = useFullscreenActive();
  // const fullscreenActions = useFullscreenActions();
  // const selectedPeerId = usePeerSelectedId();

  // useEffect(() => {
  //   if (!selectedPeerId || !videoRef.current)
  //     return console.log('return screen');
  //   let track;
  //   const source =
  //     fullscreenActive === FullscreenType.Screen ? 'screen' : 'camera';
  //   if (selectedPeerId === peerMe?.id) {
  //     track = getTrack(source);
  //   } else {
  //     const consumer = getConsumer(selectedPeerId, source);
  //     track = consumer?.track;
  //   }

  //   if (!track) return console.log('return screen 2');

  //   console.log('got here');

  //   const stream = new MediaStream([track]);
  //   videoRef.current.srcObject = stream;
  // }, [getConsumer, getTrack, selectedPeerId, fullscreenActive, peerMe?.id]);

  return (
    <Dialog open={false}>
      <DialogContent className="max-w-full sm:max-w-full h-full rounded-none border-0 p-0   "></DialogContent>
    </Dialog>
  );
};

export default FullScreenModal;
