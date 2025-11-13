import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface MediaControlButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}
const MediaControlButton: React.FC<MediaControlButtonProps> = ({
  isActive,
  onClick,
  children,
  className,
}) => (
  <Button
    onClick={onClick}
    variant={isActive ? 'default' : 'ghost'}
    size="icon"
    className={cn(
      'w-12 h-12 rounded-xl transition-all duration-200 cursor-pointer text-white bg-linear-to-br ',
      isActive
        ? 'bg-red-500 hover:bg-red-500/90 '
        : 'from-white/15 to-white/1  backdrop-blur-xl',

      className
    )}
  >
    {children}
  </Button>
);

export default MediaControlButton;
