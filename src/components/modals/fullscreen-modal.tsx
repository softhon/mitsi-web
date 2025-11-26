import { useFullscreenActions, useFullscreenActive } from '@/store/conf/hooks';
import { Dialog, DialogContent } from '../ui/dialog';
import { FullscreenType } from '@/types';

const FullScreenModal = () => {
  const fullscreenActive = useFullscreenActive();
  const fullscreenActions = useFullscreenActions();

  return (
    <Dialog
      open={fullscreenActive !== FullscreenType.Hide}
      onOpenChange={() => fullscreenActions.set(FullscreenType.Hide)}
    >
      <DialogContent className="max-w-full sm:max-w-full h-full rounded-none border-0 p-0   "></DialogContent>
    </Dialog>
  );
};

export default FullScreenModal;
