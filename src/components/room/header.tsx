import { Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';

const Header = () => {
  return (
    <div className="flex items-center justify-between px-4 py-2  top-0 left-0 right-0 z-20">
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
        <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
          REC
        </Badge>
      </div>
    </div>
  );
};

export default Header;
