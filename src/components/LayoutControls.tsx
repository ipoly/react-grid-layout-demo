import React from 'react';

import { PanelLeft, PanelTop, PanelTopOpen, RotateCcw } from 'lucide-react';

interface LayoutControlsProps {
  navigationMode: 'horizontal' | 'hover' | 'sidebar';
  onNavigationModeChange: (mode: 'horizontal' | 'hover' | 'sidebar') => void;
  onResetLayout: () => void;
}

export const LayoutControls: React.FC<LayoutControlsProps> = ({
  navigationMode,
  onNavigationModeChange,
  onResetLayout,
}) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-[100]">
      <div className="font-semibold mb-3 text-gray-700 text-sm">
        Layout Controls
      </div>

      {/* Reset Layout Button */}
      <button
        onClick={onResetLayout}
        className="w-full mb-3 px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Reset Layout
      </button>

      <div className="border-t border-gray-200 pt-3">
        <div className="text-xs text-gray-600 mb-2">Navigation Mode</div>
        <div className="space-y-1">
          <button
            onClick={() => onNavigationModeChange('horizontal')}
            className={`w-full px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
              navigationMode === 'horizontal'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <PanelTop className="h-4 w-4" />
            Horizontal
          </button>
          <button
            onClick={() => onNavigationModeChange('hover')}
            className={`w-full px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
              navigationMode === 'hover'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <PanelTopOpen className="h-4 w-4" />
            Hover
          </button>
          <button
            onClick={() => onNavigationModeChange('sidebar')}
            className={`w-full px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
              navigationMode === 'sidebar'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <PanelLeft className="h-4 w-4" />
            Sidebar
          </button>
        </div>
      </div>
    </div>
  );
};
