import React from 'react';

import { useSidebarLayoutContext } from '../contexts/SidebarLayoutContext';

export const SidebarDebug: React.FC = () => {
  const context = useSidebarLayoutContext();

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-[100] font-mono text-xs">
      <div className="font-bold mb-2 text-gray-700">Sidebar Debug</div>
      <div className="space-y-1">
        <div>Window: {context.windowWidth}px</div>
        <div>Overlay Mode: {context.isOverlayMode ? 'YES' : 'NO'}</div>
        <div>Overlay Open: {context.isOverlayOpen ? 'YES' : 'NO'}</div>
        <div>Sidebar Visible: {context.isSidebarVisible ? 'YES' : 'NO'}</div>
        <div>Sidebar Hovered: {context.isSidebarHovered ? 'YES' : 'NO'}</div>
      </div>
      <div className="mt-3 space-y-2">
        <button
          onClick={() => context.toggleSidebar()}
          className="w-full px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Toggle Sidebar
        </button>
        {context.isOverlayMode && (
          <>
            <button
              onClick={() => context.openOverlay()}
              className="w-full px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
            >
              Open Overlay
            </button>
            <button
              onClick={() => context.closeOverlay()}
              className="w-full px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
            >
              Close Overlay
            </button>
          </>
        )}
      </div>
    </div>
  );
};
