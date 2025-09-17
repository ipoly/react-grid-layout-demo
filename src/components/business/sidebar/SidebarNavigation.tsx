import React from 'react';

import { useSidebarLayoutContext } from '../../../contexts/SidebarLayoutContext';
import { SIDEBAR_CONSTANTS } from '../../../hooks/useSidebarLayout';
import type { NavigationChangeHandler } from '../../../types/navigation';
import { SidebarNavigationItem } from './SidebarNavigationItem';

interface NavItem {
  name: string;
  active?: boolean;
  isExternal?: boolean;
  subItems?: Array<{
    name: string;
    active?: boolean;
    isExternal?: boolean;
    subItems?: Array<{
      name: string;
      active?: boolean;
      isExternal?: boolean;
    }>;
  }>;
}

interface SidebarNavigationProps {
  navigationItems: NavItem[];
  onNavigationChange?: NavigationChangeHandler;
  activeMainNav?: string;
  activeSubNav?: string;
  activeThirdNav?: string;
  className?: string;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  navigationItems,
  onNavigationChange,
  activeMainNav,
  activeSubNav,
  activeThirdNav,
  className = '',
}) => {
  const { clearCloseTimeout, closeOverlay } = useSidebarLayoutContext();

  // Filter out items that should not appear in sidebar
  const filteredItems = navigationItems.filter((item) => item.name !== 'More');

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col overflow-visible
        sticky top-[72px] self-start h-[calc(100vh-72px)] shadow-lg
        transition-transform duration-300 ease-in-out ${className}`}
      style={{ width: `${SIDEBAR_CONSTANTS.SIDEBAR_WIDTH}px` }}
      onMouseEnter={clearCloseTimeout}
      onMouseLeave={closeOverlay}
    >
      {/* Navigation Items */}
      <nav className="flex-1 overflow-x-visible p-4">
        <div className="space-y-1">
          {filteredItems.map((item) => (
            <SidebarNavigationItem
              key={item.name}
              item={item}
              level={1}
              onNavigationChange={onNavigationChange}
              activeMainNav={activeMainNav}
              activeSubNav={activeSubNav}
              activeThirdNav={activeThirdNav}
            />
          ))}
        </div>
      </nav>

      {/* Footer section - sticky to bottom */}
      <div className="mt-auto p-4 border-t border-gray-200 bg-white">
        <div className="text-xs text-gray-500 text-center">
          Sidebar Navigation
        </div>
      </div>
    </aside>
  );
};
