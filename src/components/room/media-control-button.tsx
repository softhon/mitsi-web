import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface MediaControlButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  label?: string;
  disabled?: boolean;
}
const MediaControlButton: React.FC<MediaControlButtonProps> = ({
  isActive,
  onClick,
  children,
  className,
  label,
  disabled,
}) => (
  <Button
    onClick={onClick}
    variant={isActive ? 'default' : 'ghost'}
    size="icon"
    disabled={disabled}
    className={cn(
      'rounded-xl transition-all duration-200 cursor-pointer text-white bg-linear-to-br',
      label ? 'w-14 h-14 flex-col gap-0.5' : 'w-12 h-12',
      isActive
        ? 'bg-red-500 hover:bg-red-500/90'
        : 'from-white/15 to-white/1 backdrop-blur-xl',
      className
    )}
  >
    {children}
    {label && (
      <span className="text-[10px] font-medium leading-none">{label}</span>
    )}
  </Button>
);

export default MediaControlButton;
