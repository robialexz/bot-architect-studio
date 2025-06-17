import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Eye } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const VersionSwitcher: React.FC = () => {
  const location = useLocation();
  const isV2 = location.pathname === '/landing-v2';

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-3">
      {/* Current Version Indicator */}
      <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-center">
        <div className="text-xs text-gray-400 mb-1">Current Version</div>
        <Badge className={`${isV2 ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-600'} text-white`}>
          {isV2 ? 'V2 - Modern' : 'V1 - Original'}
        </Badge>
      </div>

      {/* Switch Button */}
      <Button
        asChild
        size="sm"
        className={`${
          isV2 
            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
        } transition-all duration-300 group`}
      >
        <Link to={isV2 ? '/' : '/landing-v2'}>
          <Eye className="w-4 h-4 mr-2" />
          {isV2 ? 'View Original' : 'View Modern V2'}
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>

      {/* New Badge for V2 */}
      {!isV2 && (
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg px-3 py-2 text-center">
          <div className="flex items-center justify-center gap-1 text-blue-300 text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            New V2 Available!
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionSwitcher;
