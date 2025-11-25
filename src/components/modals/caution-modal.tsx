import { OctagonAlert } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { CautionType } from '@/types';
import { useCautionActions, useCautionActive } from '@/store/conf/hooks';
import { useSignaling } from '@/hooks/use-signaling';
import { Actions } from '@/types/actions';

const CautionModal = () => {
  const { signalingService } = useSignaling();
  const cautionActive = useCautionActive();
  const cautionActions = useCautionActions();

  const heading: Record<CautionType, string> = {
    START_RECORDING: 'Start Recording',
    STOP_RECORDING: 'Stop Recording',
    END_SESSION: 'End Session',
    REMOVE_PEER: 'Remove Attendee',
    HIDE: '',
  };

  const body: Record<CautionType, string> = {
    START_RECORDING: 'Confirm you want to start recording',
    STOP_RECORDING: 'Confirm you want to stop recording',
    END_SESSION: 'This will end the meeting for everyone',
    REMOVE_PEER: `Are you sure you want to remove peer`,
    HIDE: '',
  };

  const okText: Record<CautionType, string> = {
    START_RECORDING: 'Start',
    STOP_RECORDING: 'Stop',
    END_SESSION: 'End Session',
    REMOVE_PEER: 'Remove',
    HIDE: '',
  };

  const okAction: Record<CautionType, () => void> = {
    START_RECORDING: () => {},
    STOP_RECORDING: () => {},
    END_SESSION: () => {
      signalingService?.sendMessage({
        action: Actions.EndRoom,
      });
    },
    REMOVE_PEER: () => {},
    HIDE: () => {
      cautionActions.set(CautionType.Hide);
    },
  };

  return (
    <Dialog
      open={cautionActive !== CautionType.Hide}
      onOpenChange={() => cautionActions.set(CautionType.Hide)}
    >
      <DialogContent className=" w-sm bg-linear-to-br  from-slate-950 via-slate-900 to-black">
        <div className=" flex flex-col gap-y-4">
          <div className=" flex items-center text-red-500 gap-2">
            <OctagonAlert />
            <span className=" font-medium">{heading[cautionActive]}</span>
          </div>

          <p className=" text-sm">{body[cautionActive]}</p>

          <Button
            onClick={okAction[cautionActive]}
            className=" bg-red-500 hover:bg-red-500/90 cursor-pointer text-white "
          >
            {okText[cautionActive]}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CautionModal;
