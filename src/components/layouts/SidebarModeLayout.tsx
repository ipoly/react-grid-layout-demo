import React from 'react';

import { useSidebarLayoutContext } from '../../contexts/SidebarLayoutContext';
import type { NavigationChangeHandler } from '../../types/navigation';
import { SidebarNavigation } from '../business/sidebar/SidebarNavigation';
import { BreadcrumbNavigation } from '../ui/BreadcrumbNavigation';

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

interface RightSideIconItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  hasSubMenu?: boolean;
  subItems?: Array<{
    name: string;
    active?: boolean;
    isExternal?: boolean;
  }>;
}

interface SidebarModeLayoutProps {
  children: React.ReactNode;
  navigationItems: NavItem[];
  rightSideIcons?: RightSideIconItem[];
  onNavigationChange?: NavigationChangeHandler;
  activeMainNav?: string;
  activeSubNav?: string;
  activeThirdNav?: string;
  activeRightIcon?: string;
  activeRightSubNav?: string;
}

export const SidebarModeLayout: React.FC<SidebarModeLayoutProps> = ({
  children,
  navigationItems,
  rightSideIcons = [],
  onNavigationChange,
  activeMainNav,
  activeSubNav,
  activeThirdNav,
  activeRightIcon,
  activeRightSubNav,
}) => {
  const { isSidebarVisible, isOverlayMode } = useSidebarLayoutContext();

  // Default right side icons if not provided
  const defaultRightSideIcons: RightSideIconItem[] =
    rightSideIcons.length > 0
      ? rightSideIcons
      : [
          {
            id: 'sso',
            name: 'SSO to Partner',
            icon: () => null,
            hasSubMenu: true,
            subItems: [
              { name: 'Goldman Sachs' },
              { name: 'Morgan Stanley' },
              { name: 'Charles Schwab' },
              { name: 'Fidelity' },
              { name: 'TD Ameritrade' },
              { name: 'E*TRADE' },
            ],
          },
          {
            id: 'vault',
            name: 'Vault',
            icon: () => null,
            hasSubMenu: false,
          },
          {
            id: 'notifications',
            name: 'Notifications',
            icon: () => null,
            hasSubMenu: true,
            subItems: [
              { name: 'Notifications' },
              { name: 'Notification Settings' },
            ],
          },
          {
            id: 'settings',
            name: 'Settings',
            icon: () => null,
            hasSubMenu: true,
            subItems: [
              { name: 'Account' },
              { name: 'Security' },
              { name: 'Teams' },
              { name: 'Billing' },
              { name: 'Updates', isExternal: true },
              { name: 'Sign Out' },
            ],
          },
        ];

  const iconsToUse =
    rightSideIcons.length > 0 ? rightSideIcons : defaultRightSideIcons;

  return (
    <div className="flex min-h-[calc(100vh-72px)] min-w-[1280px] relative">
      {/* Sidebar container - can shrink but content overflows */}
      <div
        className={`flex-shrink min-w-0 overflow-visible relative z-10 transition-all duration-300 ease-in-out ${
          isOverlayMode
            ? 'max-w-0'
            : isSidebarVisible
              ? 'max-w-[280px]'
              : 'max-w-0'
        }`}
      >
        <SidebarNavigation
          navigationItems={navigationItems}
          onNavigationChange={onNavigationChange}
          activeMainNav={activeMainNav}
          activeSubNav={activeSubNav}
          activeThirdNav={activeThirdNav}
          className={isSidebarVisible ? '' : '-translate-x-full'}
        />
      </div>

      {/* Main content area */}
      <main className="flex-1 flex flex-col items-center">
        {/* Breadcrumb Navigation */}
        <div className="bg-gray-50 border-b border-gray-200 w-full sticky top-[72px] z-10">
          <BreadcrumbNavigation
            navigationItems={navigationItems}
            rightSideIcons={iconsToUse}
            activeMainNav={activeMainNav}
            activeSubNav={activeSubNav}
            activeThirdNav={activeThirdNav}
            activeRightIcon={activeRightIcon}
            activeRightSubNav={activeRightSubNav}
            onNavigationChange={onNavigationChange}
          />
        </div>

        {/* Main content */}
        {children}
      </main>
    </div>
  );
};
