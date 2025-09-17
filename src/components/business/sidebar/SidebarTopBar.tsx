import React from 'react';

import { Avatar } from '@untitled-ui/components/base/avatar/avatar';
import { Badge } from '@untitled-ui/components/base/badges/badges';
import {
  Bell,
  Folder,
  Key,
  PanelLeft,
  PanelTop,
  PanelTopOpen,
  RotateCcw,
  Settings,
} from 'lucide-react';

import { useSidebarLayoutContext } from '../../../contexts/SidebarLayoutContext';
import type {
  LegacyRightIconChangeHandler,
  NavigationChangeHandler,
} from '../../../types/navigation';
import { NavigationUtils } from '../../../types/navigation';

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

type NavigationMode = 'horizontal' | 'hover' | 'sidebar';

interface SidebarTopBarProps {
  userName?: string;
  userAvatarUrl?: string;
  activeRightIcon?: string;
  activeRightSubNav?: string;
  onResetLayout?: () => void;
  navigationMode?: NavigationMode;
  onNavigationModeChange?: (mode: NavigationMode) => void;
  onNavigationChange?: NavigationChangeHandler;
  onRightIconChange?: LegacyRightIconChangeHandler;
}

export const SidebarTopBar: React.FC<SidebarTopBarProps> = ({
  userName = 'Emma',
  userAvatarUrl,
  activeRightIcon = '',
  activeRightSubNav = '',
  onResetLayout,
  navigationMode = 'sidebar',
  onNavigationModeChange,
  onNavigationChange,
  onRightIconChange,
}) => {
  const { openOverlay, closeOverlay, isOverlayMode } =
    useSidebarLayoutContext();

  // 统一导航处理函数
  const handleNavigationChange = React.useCallback(
    (navigation: Parameters<NavigationChangeHandler>[0]) => {
      // 优先使用新的统一回调
      if (onNavigationChange) {
        onNavigationChange(navigation);
        return;
      }

      // 向后兼容：转换为旧的回调格式
      if (navigation.type === 'icon' && onRightIconChange) {
        const [iconId, subNav] =
          NavigationUtils.toRightIconNavigation(navigation);
        onRightIconChange(iconId, subNav);
      }
    },
    [onNavigationChange, onRightIconChange]
  );

  // Right side icons definition - same as Header component
  const rightSideIcons: RightSideIconItem[] = [
    {
      id: 'sso',
      name: 'SSO to Partner',
      icon: Key,
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
      icon: Folder,
      hasSubMenu: false,
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      hasSubMenu: true,
      subItems: [{ name: 'Notifications' }, { name: 'Notification Settings' }],
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
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

  // Set active states for right side icons
  rightSideIcons.forEach((icon) => {
    icon.active = icon.id === activeRightIcon;
    if (icon.subItems) {
      icon.subItems.forEach((subItem) => {
        subItem.active = subItem.name === activeRightSubNav && icon.active;
      });
    }
  });

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="w-full min-w-[1280px] mx-auto">
        <div className="flex h-[72px] items-center justify-between px-6 py-0">
          {/* Left side - Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Sidebar toggle button - only visible in overlay mode */}
            {isOverlayMode && (
              <button
                onMouseEnter={openOverlay}
                onMouseLeave={closeOverlay}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            )}

            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-brand rounded flex items-center justify-center">
                <span className="text-brand-foreground font-bold text-sm">
                  CC
                </span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">
                ChubbyCapital
              </span>
            </div>
          </div>

          {/* Right side - Actions and User */}
          <div className="flex items-center gap-3">
            {/* Right Side Icons with hover dropdowns */}
            <div className="flex gap-0.5">
              {rightSideIcons.map((iconItem) => {
                const IconComponent = iconItem.icon;
                const isNotifications = iconItem.id === 'notifications';

                return (
                  <div key={iconItem.id} className="group relative">
                    <button
                      onClick={() => {
                        const navigation =
                          NavigationUtils.fromRightIconNavigation(iconItem.id);
                        handleNavigationChange(navigation);
                      }}
                      className={`p-2 rounded-md transition-all duration-200 ease-in-out transform ${
                        iconItem.active
                          ? 'text-[#4a433c] bg-gray-300 shadow-md ring-1 ring-[#e6e2dc] scale-110'
                          : 'text-[#b8b1a9] hover:text-[#635a52] hover:bg-[#f8f7f5] hover:scale-105'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </button>

                    {/* Notification badge only for notifications icon */}
                    {isNotifications && (
                      <Badge
                        type="pill-color"
                        color="error"
                        size="sm"
                        className="absolute -top-1 -right-1 w-2 h-2 p-0 min-w-0"
                      >
                        <span className="sr-only">New notifications</span>
                      </Badge>
                    )}

                    {/* Hover Dropdown for right-side icons with sub-menus */}
                    {iconItem.hasSubMenu &&
                      iconItem.subItems &&
                      iconItem.subItems.length > 0 && (
                        <div className="absolute top-full right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform translate-y-2 group-hover:translate-y-0 z-50">
                          {/* Invisible bridge area */}
                          <div className="h-2 w-full" />

                          {/* Actual dropdown menu */}
                          <div className="bg-white rounded-lg shadow-lg ring-1 ring-gray-200 py-1 min-w-[200px]">
                            {iconItem.subItems.map((subItem) => (
                              <button
                                key={subItem.name}
                                onClick={() => {
                                  const navigation =
                                    NavigationUtils.fromRightIconNavigation(
                                      iconItem.id,
                                      subItem.name
                                    );
                                  handleNavigationChange(navigation);
                                }}
                                className={`dropdown-item-animate flex w-full items-center px-4 py-2 text-sm transition-colors ${
                                  subItem.active
                                    ? 'bg-brand/10 text-brand border-l-2 border-brand'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <span className="flex items-center">
                                  {subItem.name}
                                  {subItem.isExternal && (
                                    <svg
                                      className="w-3 h-3 ml-1"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  )}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>

            {/* User Avatar with CSS Hover Dropdown Menu */}
            <div className="group relative">
              <Avatar
                size="md"
                src={userAvatarUrl}
                alt={userName}
                initials={userName.charAt(0)}
                className="cursor-pointer"
              />

              <div className="absolute right-0 top-full w-62 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform translate-y-2 group-hover:translate-y-0 z-50">
                {/* 不可见的桥接区域 */}
                <div className="h-6 w-full -mt-4" />

                {/* 实际的下拉菜单 */}
                <div className="rounded-lg bg-white shadow-lg ring-1 ring-gray-200">
                  <div className="py-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onResetLayout) {
                          onResetLayout();
                        }
                      }}
                      className="dropdown-item-animate flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <RotateCcw className="mr-3 h-4 w-4 text-gray-400" />
                      Reset Layout
                    </button>

                    <div className="border-t border-gray-200 my-1"></div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onNavigationModeChange) {
                          onNavigationModeChange('horizontal');
                        }
                      }}
                      className={`dropdown-item-animate flex w-full items-center px-4 py-2 text-sm transition-colors ${
                        navigationMode === 'horizontal'
                          ? 'bg-brand/10 text-brand border-l-2 border-brand'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <PanelTop className="mr-3 h-4 w-4 text-gray-400" />
                      Horizontal Navigation
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onNavigationModeChange) {
                          onNavigationModeChange('hover');
                        }
                      }}
                      className={`dropdown-item-animate flex w-full items-center px-4 py-2 text-sm transition-colors ${
                        navigationMode === 'hover'
                          ? 'bg-brand/10 text-brand border-l-2 border-brand'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <PanelTopOpen className="mr-3 h-4 w-4 text-gray-400" />
                      Hover-activated Navigation
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onNavigationModeChange) {
                          onNavigationModeChange('sidebar');
                        }
                      }}
                      className={`dropdown-item-animate flex w-full items-center px-4 py-2 text-sm transition-colors ${
                        navigationMode === 'sidebar'
                          ? 'bg-brand/10 text-brand border-l-2 border-brand'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <PanelLeft className="mr-3 h-4 w-4 text-gray-400" />
                      Sidebar Navigation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
