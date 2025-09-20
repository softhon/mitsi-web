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
    variant="ghost"
    size="icon"
    className={cn(
      'w-12 h-12 rounded-xl transition-all duration-200 cursor-pointer',
      isActive
        ? 'bg-white/10 hover:bg-white/20 text-white'
        : 'bg-red-500/90 hover:bg-red-500 text-white',
      className
    )}
  >
    {children}
  </Button>
);

export default MediaControlButton;
