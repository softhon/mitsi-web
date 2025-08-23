import React from 'react';
import { createPortal } from 'react-dom';
import { useToast } from './toast-context';
import { Toast } from './toast';
import { cn } from '@/lib/utils';

const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export const ToastContainer: React.FC = () => {
  const { toasts, position, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 max-h-screen overflow-hidden pointer-events-none',
        positionClasses[position],
        position.includes('bottom') ? 'flex-col-reverse' : 'flex-col'
      )}
      aria-label="Notifications"
    >
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onDismiss={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>,
    document.body
  );
};
