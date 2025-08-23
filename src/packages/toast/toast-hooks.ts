import { useToast } from './toast-context';

// Convenient hooks for different toast types
export const useToastActions = () => {
  const { addToast } = useToast();

  const success = (
    title: string,
    description?: string,
    options?: {
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ) => {
    return addToast({
      type: 'success',
      title,
      description,
      duration: options?.duration,
      action: options?.action,
    });
  };

  const error = (
    title: string,
    description?: string,
    options?: {
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ) => {
    return addToast({
      type: 'error',
      title,
      description,
      duration: options?.duration ?? 0, // Errors persist by default
      action: options?.action,
    });
  };

  const warning = (
    title: string,
    description?: string,
    options?: {
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ) => {
    return addToast({
      type: 'warning',
      title,
      description,
      duration: options?.duration,
      action: options?.action,
    });
  };

  const info = (
    title: string,
    description?: string,
    options?: {
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ) => {
    return addToast({
      type: 'info',
      title,
      description,
      duration: options?.duration,
      action: options?.action,
    });
  };

  const toast = (
    title: string,
    description?: string,
    options?: {
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ) => {
    return addToast({
      type: 'default',
      title,
      description,
      duration: options?.duration,
      action: options?.action,
    });
  };

  return {
    toast,
    success,
    error,
    warning,
    info,
  };
};
