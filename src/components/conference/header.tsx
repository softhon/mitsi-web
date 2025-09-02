import { Loader2, UserMinus, UserPlus } from 'lucide-react';
import { Badge } from '../ui/badge';

interface HeaderProps {
  onAddParticipant: () => void;
  onRemoveParticipant: () => void;
}
const Header: React.FC<HeaderProps> = ({
  onAddParticipant,
  onRemoveParticipant,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900/95 backdrop-blur-sm top-0 left-0 right-0 z-20">
      {/* Left side - Meeting info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
            <Loader2 className="w-3 h-3 text-white animate-spin" />
          </div>
          <span className="text-white font-medium">Mitsi</span>
        </div>
      </div>

      {/* Right side - Recording indicator */}
      <div className="flex items-center gap-2">
        {onAddParticipant && (
          <button
            onClick={onAddParticipant}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition flex items-center gap-1"
            aria-label="Add participant"
          >
            <UserPlus className="w-4 h-4" />
            Add
          </button>
        )}
        {onRemoveParticipant && (
          <button
            onClick={onRemoveParticipant}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition flex items-center gap-1"
            aria-label="Remove participant"
          >
            <UserMinus className="w-4 h-4" />
            Remove
          </button>
        )}
        <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
          REC
        </Badge>
      </div>
    </div>
  );
};

export default Header;
