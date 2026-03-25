import { useEffect, useCallback, useRef } from 'react';
import { useMedia } from './use-media';
import { useSignaling } from './use-signaling';
import {
  useHandActions,
  useHandRaised,
  useMicOn,
  useModalActions,
  usePeerActions,
  usePeerMe,
  useSettingsOpen,
} from '@/store/conf/hooks';
import { Actions } from '@/types/actions';

/**
 * Global keyboard shortcuts for the conference:
 *   M           — toggle mic
 *   V           — toggle camera
 *   S           — toggle screen share
 *   H           — raise/lower hand
 *   Space       — push-to-talk (hold to unmute, release to mute)
 *   Escape      — close open modals / sidebar panels
 */
export const useKeyboardShortcuts = () => {
  const { toggleMic, toggleCamera, toggleScreen } = useMedia();
  const { signalingService } = useSignaling();
  const micOn = useMicOn();
  const handRaised = useHandRaised();
  const handActions = useHandActions();
  const peerActions = usePeerActions();
  const peerMe = usePeerMe();
  const modalActions = useModalActions();
  const settingsOpen = useSettingsOpen();

  // Keep refs for push-to-talk so the keydown/keyup handlers always see latest values
  const micOnRef = useRef(micOn);
  micOnRef.current = micOn;
  const pttActiveRef = useRef(false);

  const handRaisedRef = useRef(handRaised);
  handRaisedRef.current = handRaised;

  const peerMeRef = useRef(peerMe);
  peerMeRef.current = peerMe;

  const raiseHand = useCallback(() => {
    const peer = peerMeRef.current;
    if (!signalingService || !peer) return;
    const raised = !handRaisedRef.current;
    signalingService.sendMessage({
      action: Actions.RaiseHand,
      args: { raised },
    });
    handActions.toggle();
    peerActions.updateCondition(peer.id, {
      hand: { raised, timestamp: Date.now() },
    });
  }, [signalingService, handActions, peerActions]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return;
      // Ignore when settings modal is open (avoid conflicting with its inputs)
      if (settingsOpen) return;

      switch (e.key.toLowerCase()) {
        case 'm':
          e.preventDefault();
          toggleMic();
          break;
        case 'v':
          e.preventDefault();
          toggleCamera();
          break;
        case 's':
          e.preventDefault();
          toggleScreen();
          break;
        case 'h':
          e.preventDefault();
          raiseHand();
          break;
        case ' ':
          // Push-to-talk: unmute on press (only if currently muted)
          if (!pttActiveRef.current && !micOnRef.current) {
            e.preventDefault();
            pttActiveRef.current = true;
            toggleMic();
          }
          break;
        case 'escape':
          modalActions.closeChatAndParticipant();
          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' && pttActiveRef.current) {
        e.preventDefault();
        pttActiveRef.current = false;
        // Re-mute only if we unmuted via push-to-talk
        if (micOnRef.current) toggleMic();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [toggleMic, toggleCamera, toggleScreen, raiseHand, modalActions, settingsOpen]);
};
