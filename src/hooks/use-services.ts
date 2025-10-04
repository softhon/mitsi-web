import { ServiceContext } from '@/context/service-context';
import { useContext } from 'react';

// Main hook to access services
export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
