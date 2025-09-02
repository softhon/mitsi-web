import React from 'react';
import {
  X,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Camera,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ToastType } from '.';
// import { Toast as ToastType } from './';

interface ToastProps {
  toast: ToastType;
  onDismiss: () => void;
}

const toastVariants = {
  default: {
    borderColor: 'border-l-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    iconColor: 'text-gray-600 dark:text-gray-400',
    icon: Camera,
  },
  success: {
    borderColor: 'border-l-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    icon: CheckCircle,
  },
  error: {
    borderColor: 'border-l-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-600 dark:text-red-400',
    icon: AlertCircle,
  },
  warning: {
    borderColor: 'border-l-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    icon: AlertTriangle,
  },
  info: {
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    icon: Info,
  },
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const variant = toastVariants[toast.type];
  const IconComponent = variant.icon;

  return (
    <div
      className={cn(
        'relative flex w-full max-w-sm items-start gap-3 rounded-lg border-l-4 bg-background p-4 shadow-lg transition-all duration-300 ease-in-out',
        variant.borderColor,
        variant.bgColor,
        'animate-in slide-in-from-right-full',
        'data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-full'
      )}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <IconComponent className={cn('h-5 w-5', variant.iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{toast.title}</h3>
        {toast.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {toast.description}
          </p>
        )}

        {/* Action Button */}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mt-2"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => {
          toast.onDismiss?.();
          onDismiss();
        }}
        className="flex-shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
