import { Dialog, DialogContent } from '../ui/dialog';

const FullScreenModal = () => {
  return (
    <Dialog open={true}>
      <DialogContent className="max-w-full sm:max-w-full h-full rounded-none border-0 p-0   "></DialogContent>
    </Dialog>
  );
};

export default FullScreenModal;
