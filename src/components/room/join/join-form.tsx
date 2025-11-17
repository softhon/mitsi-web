import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  usePeerActions,
  useRoomActions,
  useRoomData,
} from '@/store/conf/hooks';
import { getPeerId, isMobileDevice } from '@/lib/utils';
import { Access, type PeerData, type RoomData } from '@/types';
import { useSignaling } from '@/hooks/use-signaling';
import { Actions } from '@/types/actions';
import { Button } from '../../ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
// import { useEffect } from 'react';

const FormValues = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters long')
    .refine(
      val => (val.match(/[a-zA-Z]/g) || []).length >= 2,
      'Name must contain at least two alphabetic characters'
    ),
});

const JoinForm = () => {
  const { signalingService } = useSignaling();
  const roomData = useRoomData();
  const peerActions = usePeerActions();
  const roomActions = useRoomActions();

  type FormType = z.infer<typeof FormValues>;
  const form = useForm<FormType>({
    resolver: zodResolver(FormValues),
    defaultValues: {
      name: localStorage.getItem('name') || '',
    },
  });

  const name = form.watch('name');
  form.setFocus('name');

  const onSubmit = async (data: FormType) => {
    try {
      const peerData: PeerData = {
        id: getPeerId(),
        name: data.name,
        isMobileDevice: isMobileDevice(),
      };

      peerActions.addData(peerData, true);

      await signalingService?.sendMessage<{ roomData: RoomData }>({
        action: Actions.GetRoomData,
        args: {
          roomId: roomData?.roomId,
        },
      });
      localStorage.setItem('name', data.name);
      roomActions.setAccess(Access.Allowed);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          richColors: true,
          position: 'top-right',
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className=" flex-1">
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter name"
                  // onKeyUp={handleKeyPress}
                  className="w-full h-11 px-4 py-3 bg-gray-800/50  border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!name.trim() || form.formState.isSubmitting}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Joining...
            </>
          ) : (
            'Join Now'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default JoinForm;
