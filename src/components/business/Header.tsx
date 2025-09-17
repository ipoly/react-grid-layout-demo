import React, { useContext } from 'react';

import { Avatar } from '@untitled-ui/components/base/avatar/avatar';
import { Badge } from '@untitled-ui/components/base/badges/badges';
import { useBreakpoint } from '@untitled-ui/hooks/use-breakpoint';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Folder,
  Key,
  MoreHorizontal,
  PanelLeft,
  PanelRight,
  Settings,
} from 'lucide-react';

import { SidebarLayoutContext } from '../../contexts/SidebarLayoutContext';
import type {
  LegacyNavChangeHandler,
  LegacyRightIconChangeHandler,
  NavigationChangeHandler,
  NavigationState,
} from '../../types/navigation';
import { NavigationUtils } from '../../types/navigation';
import { BreadcrumbNavigation } from '../ui/BreadcrumbNavigation';

type NavigationMode = 'horizontal' | 'hover' | 'sidebar';

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

interface HeaderProps {
  userName?: string;
  userAvatarUrl?: string;
  currentBreakpointPreset?: string;
  onBreakpointPresetChange?: (presetId: string) => void;
  activeMainNav?: string;
  activeSubNav?: string;
  activeThirdNav?: string;
  activeRightIcon?: string;
  activeRightSubNav?: string;
  navigationMode?: NavigationMode;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;

  // 新的统一导航回调
  onNavigationChange?: NavigationChangeHandler;

  // 向后兼容的回调（将被弃用）
  /** @deprecated 使用 onNavigationChange 替代 */
  onNavChange?: LegacyNavChangeHandler;
  /** @deprecated 使用 onNavigationChange 替代 */
  onRightIconChange?: LegacyRightIconChangeHandler;
}

export const Header = ({
  userName = 'Emma',
  userAvatarUrl,
  currentBreakpointPreset: _currentBreakpointPreset = 'default',
  onBreakpointPresetChange: _onBreakpointPresetChange,
  activeMainNav = 'Planning',
  activeSubNav = 'Clients',
  activeThirdNav = '',
  activeRightIcon = '',
  activeRightSubNav = '',
  navigationMode = 'horizontal',
  containerClassName = 'max-w-[1680px] min-w-[1200px] mx-auto',
  containerStyle = {},

  // 新的统一导航回调
  onNavigationChange,

  // 向后兼容的回调
  onNavChange,
  onRightIconChange,
}: HeaderProps) => {
  /**
   * Navigation container classes:
   * Uses Tailwind v4 utility-first approach - no complex JavaScript manipulation.
   * Navigation bars manage their own vertical spacing through fixed heights.
   */
  const navContainerClassName = containerClassName;

  // 统一导航处理函数
  const handleNavigationChange = React.useCallback(
    (navigation: NavigationState) => {
      // 优先使用新的统一回调
      if (onNavigationChange) {
        onNavigationChange(navigation);
        return;
      }

      // 向后兼容：转换为旧的回调格式
      if (navigation.type === 'main' && onNavChange) {
        const [mainNav, subNav, thirdNav] =
          NavigationUtils.toMainNavigation(navigation);
        onNavChange(mainNav, subNav, thirdNav);
      } else if (navigation.type === 'icon' && onRightIconChange) {
        const [iconId, subNav] =
          NavigationUtils.toRightIconNavigation(navigation);
        onRightIconChange(iconId, subNav);
      }
    },
    [onNavigationChange, onNavChange, onRightIconChange]
  );

  // Responsive navigation configuration
  const isXL = useBreakpoint('xl'); // >= 1280px
  const is2XL = useBreakpoint('2xl'); // >= 1536px

  // Custom hook for 1440px breakpoint detection
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamic navigation item count based on screen width
  const getVisibleNavCount = () => {
    if (is2XL || windowWidth >= 1680) return 10; // 1680px+: show 10 items
    if (windowWidth >= 1440) return 8; // 1440px+: show 8 items
    if (isXL || windowWidth >= 1280) return 6; // 1280px+: show 6 items
    return 6; // fallback
  };

  const visibleNavCount = getVisibleNavCount();
  // Navigation structure based on Advisor Portal Navigation Tree
  const navigationItems: NavItem[] = [
    { name: 'Dashboard' },
    {
      name: 'Planning',
      subItems: [
        { name: 'Clients' },
        {
          name: 'Models',
          subItems: [
            { name: 'Portfolios' },
            { name: 'Glide' },
            { name: 'Scenarios' },
            { name: 'Vesting' },
            { name: 'Retirement Spending' },
            { name: 'Annuities' },
          ],
        },
        { name: 'Assumptions' },
      ],
    },
    {
      name: 'ChubbyIntel',
      subItems: [
        { name: 'Dashboard' },
        { name: 'Client Overview' },
        { name: 'Opportunities' },
      ],
    },
    {
      name: 'ChubbyFlows',
      subItems: [{ name: 'Tasks' }, { name: 'Workflows' }],
    },
    {
      name: 'ChubbyPay',
      subItems: [
        { name: 'Plans' },
        { name: 'Subscriptions' },
        { name: 'Invoices' },
        { name: 'Transactions' },
        { name: 'Accounts' },
      ],
    },
    {
      name: 'Risk',
      subItems: [
        { name: 'Summary' },
        { name: 'Questionnaires' },
        { name: 'Categories' },
      ],
    },
    { name: 'Templates' },
    { name: 'Client Settings' },
    { name: 'Integrations' },
    { name: 'Admin', isExternal: true },
    { name: 'Help', isExternal: true },
  ];

  // Split navigation items dynamically based on screen width
  const primaryNavItems = navigationItems.slice(0, visibleNavCount);
  const moreNavItems = navigationItems.slice(visibleNavCount);

  // Right side icons definition
  const rightSideIcons: RightSideIconItem[] = [
    {
      id: 'more',
      name: 'More',
      icon: MoreHorizontal,
      hasSubMenu: true,
      subItems: moreNavItems.map((item) => ({
        name: item.name,
        active: item.active,
        isExternal: item.isExternal,
      })),
    },
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

  // Set active states for main navigation
  const activeNavItem = navigationItems.find(
    (item) => item.name === activeMainNav
  );
  const hasSubNav =
    activeNavItem?.subItems && activeNavItem.subItems.length > 0;

  // Find active sub item and check if it has third level nav
  let activeSubItem;
  if (activeMainNav === 'More') {
    // When "More" is active, look for sub-item in moreNavItems
    const moreItem = moreNavItems.find((item) => item.name === activeSubNav);
    activeSubItem = moreItem;
  } else {
    activeSubItem = activeNavItem?.subItems?.find(
      (subItem) => subItem.name === activeSubNav
    );
  }
  const hasThirdNav =
    activeSubItem?.subItems && activeSubItem.subItems.length > 0;

  navigationItems.forEach((item) => {
    item.active = item.name === activeMainNav;
    if (item.subItems) {
      item.subItems.forEach((subItem) => {
        subItem.active = subItem.name === activeSubNav && item.active;
        if (subItem.subItems) {
          subItem.subItems.forEach((thirdItem) => {
            thirdItem.active =
              thirdItem.name === activeThirdNav &&
              subItem.active &&
              item.active;
          });
        }
      });
    }
  });

  // Set active states for right side icons
  const activeRightIconItem = rightSideIcons.find(
    (icon) => icon.id === activeRightIcon
  );
  const hasRightSubNav =
    activeRightIconItem?.hasSubMenu &&
    activeRightIconItem.subItems &&
    activeRightIconItem.subItems.length > 0;

  rightSideIcons.forEach((icon) => {
    // Special handling for "More" icon - it's active when activeMainNav is "More"
    if (icon.id === 'more') {
      icon.active = activeMainNav === 'More';
    } else {
      icon.active = icon.id === activeRightIcon;
    }

    if (icon.subItems) {
      icon.subItems.forEach((subItem) => {
        if (icon.id === 'more') {
          // For "More" items, they are active when "More" is main nav and this is sub nav
          subItem.active =
            activeMainNav === 'More' && activeSubNav === subItem.name;
        } else {
          subItem.active = subItem.name === activeRightSubNav && icon.active;
        }
      });
    }
  });

  // Hover Navigation Layout Component
  const HoverNavigationLayout = () => {
    return (
      <>
        {/* Main Navigation with Hover Dropdowns */}
        <div className={navContainerClassName} style={containerStyle}>
          <div className="flex h-[72px] items-center justify-between px-6 py-0">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center gap-6">
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

              {/* Navigation with hover dropdowns */}
              <nav className="flex items-center gap-0.5 whitespace-nowrap">
                {primaryNavItems.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;

                  return (
                    <div key={item.name} className="group relative">
                      <button
                        onClick={() => {
                          const navigation = NavigationUtils.fromMainNavigation(
                            item.name
                          );
                          handleNavigationChange(navigation);
                        }}
                        className={`flex items-center gap-1 px-3 py-2 rounded-md text-base font-['Roobert_RC:Semibold',_sans-serif] transition-all duration-200 ease-in-out transform ${
                          item.active
                            ? 'bg-gray-300 text-[#4a433c] shadow-md ring-1 ring-[#e6e2dc] scale-105'
                            : 'text-[#635a52] hover:text-[#4a433c] hover:bg-[#f8f7f5] hover:scale-102'
                        }`}
                      >
                        {item.name}
                        {hasSubItems && (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                        {item.isExternal && (
                          <svg
                            className="w-4 h-4"
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
                      </button>

                      {/* Hover Dropdown for sub navigation */}
                      {hasSubItems && (
                        <div className="absolute top-full left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform translate-y-2 group-hover:translate-y-0 z-50">
                          {/* Invisible bridge area */}
                          <div className="h-2 w-full" />

                          {/* Actual dropdown menu */}
                          <div className="bg-white rounded-lg shadow-lg ring-1 ring-gray-200 py-1 min-w-[200px]">
                            {item.subItems?.map((subItem) => {
                              const hasThirdLevel =
                                subItem.subItems && subItem.subItems.length > 0;

                              return (
                                <div
                                  key={subItem.name}
                                  className="group/sub relative"
                                >
                                  <button
                                    onClick={() => {
                                      const navigation =
                                        NavigationUtils.fromMainNavigation(
                                          item.name,
                                          subItem.name
                                        );
                                      handleNavigationChange(navigation);
                                    }}
                                    className={`dropdown-item-animate flex w-full items-center justify-between px-4 py-2 text-sm transition-colors ${
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
                                    {hasThirdLevel && (
                                      <ChevronRight className="w-4 h-4 text-gray-400" />
                                    )}
                                  </button>

                                  {/* Third level dropdown */}
                                  {hasThirdLevel && (
                                    <div className="absolute left-full top-0 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 ease-out transform translate-x-2 group-hover/sub:translate-x-0 z-50">
                                      {/* Invisible bridge */}
                                      <div className="w-2 h-full absolute -left-2 top-0" />

                                      <div className="bg-white rounded-lg shadow-lg ring-1 ring-gray-200 py-1 min-w-[180px] ml-1">
                                        {subItem.subItems?.map((thirdItem) => (
                                          <button
                                            key={thirdItem.name}
                                            onClick={() => {
                                              const navigation =
                                                NavigationUtils.fromMainNavigation(
                                                  item.name,
                                                  subItem.name,
                                                  thirdItem.name
                                                );
                                              handleNavigationChange(
                                                navigation
                                              );
                                            }}
                                            className={`dropdown-item-animate flex w-full items-center px-4 py-2 text-sm transition-colors ${
                                              thirdItem.active
                                                ? 'bg-brand/10 text-brand border-l-2 border-brand'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                          >
                                            {thirdItem.name}
                                            {thirdItem.isExternal && (
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
                                                  d="M10 6H6a2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                              </svg>
                                            )}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Right side - Actions and User with hover dropdowns */}
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
                          if (
                            iconItem.id === 'more' &&
                            moreNavItems.length > 0
                          ) {
                            // For "More" icon, treat as main navigation and activate first sub-item
                            const navigation =
                              NavigationUtils.fromMainNavigation(
                                'More',
                                moreNavItems[0].name,
                                undefined,
                                'more'
                              );
                            handleNavigationChange(navigation);
                          } else {
                            const navigation =
                              NavigationUtils.fromRightIconNavigation(
                                iconItem.id
                              );
                            handleNavigationChange(navigation);
                          }
                        }}
                        style={{ anchorName: `--icon-${iconItem.id}` }}
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
                                    if (iconItem.id === 'more') {
                                      // More button dropdown items are main navigation items
                                      const navigation =
                                        NavigationUtils.fromMainNavigation(
                                          subItem.name,
                                          undefined,
                                          undefined,
                                          'more'
                                        );
                                      handleNavigationChange(navigation);
                                    } else {
                                      // Other right-side icons use sub-navigation
                                      const navigation =
                                        NavigationUtils.fromRightIconNavigation(
                                          iconItem.id,
                                          subItem.name
                                        );
                                      handleNavigationChange(navigation);
                                    }
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

              {/* User Avatar */}
              <Avatar
                size="md"
                src={userAvatarUrl}
                alt={userName}
                initials={userName.charAt(0)}
              />
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation - only show in hover mode */}
        {navigationMode === 'hover' && (
          <BreadcrumbNavigation
            navigationItems={navigationItems}
            rightSideIcons={rightSideIcons}
            activeMainNav={activeMainNav}
            activeSubNav={activeSubNav}
            activeThirdNav={activeThirdNav}
            activeRightIcon={activeRightIcon}
            activeRightSubNav={activeRightSubNav}
            onNavigationChange={handleNavigationChange}
            containerClassName={navContainerClassName}
            containerStyle={containerStyle}
          />
        )}
      </>
    );
  };

  // Horizontal Navigation Layout Component (existing navigation)
  const HorizontalNavigationLayout = () => {
    return (
      <>
        {/* Main Navigation */}
        <div className={navContainerClassName} style={containerStyle}>
          <div className="flex h-[72px] items-center justify-between px-6 py-0">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center gap-6">
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

              {/* Navigation */}
              <nav className="flex items-center gap-0.5 whitespace-nowrap">
                {/* Primary navigation items (first 6 only) */}
                {primaryNavItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      const navigation = NavigationUtils.fromMainNavigation(
                        item.name
                      );
                      handleNavigationChange(navigation);
                    }}
                    style={{
                      anchorName: `--nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
                    }}
                    className={`px-3 py-2 rounded-md text-base font-['Roobert_RC:Semibold',_sans-serif] transition-all duration-200 ease-in-out transform ${
                      item.active
                        ? 'bg-gray-300 text-[#4a433c] shadow-md ring-1 ring-[#e6e2dc] scale-105'
                        : 'text-[#635a52] hover:text-[#4a433c] hover:bg-[#f8f7f5] hover:scale-102'
                    } ${item.isExternal ? 'flex items-center gap-1' : ''}`}
                  >
                    {item.name}
                    {item.isExternal && (
                      <svg
                        className="w-4 h-4"
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
                  </button>
                ))}
              </nav>
            </div>

            {/* Right side - Actions and User */}
            <div className="flex items-center gap-3">
              {/* Right Side Icons */}
              <div className="flex gap-0.5">
                {rightSideIcons.map((iconItem) => {
                  const IconComponent = iconItem.icon;
                  const isNotifications = iconItem.id === 'notifications';

                  return (
                    <div key={iconItem.id} className="group relative">
                      <button
                        onClick={() => {
                          if (
                            iconItem.id === 'more' &&
                            moreNavItems.length > 0
                          ) {
                            // For "More" icon, treat as main navigation and activate first sub-item
                            const navigation =
                              NavigationUtils.fromMainNavigation(
                                'More',
                                moreNavItems[0].name,
                                undefined,
                                'more'
                              );
                            handleNavigationChange(navigation);
                          } else {
                            const navigation =
                              NavigationUtils.fromRightIconNavigation(
                                iconItem.id
                              );
                            handleNavigationChange(navigation);
                          }
                        }}
                        style={{ anchorName: `--icon-${iconItem.id}` }}
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

                      {/* No dropdowns in horizontal mode - right-side icons only use horizontal sub-navigation bars */}
                    </div>
                  );
                })}
              </div>

              {/* User Avatar */}
              <Avatar
                size="md"
                src={userAvatarUrl}
                alt={userName}
                initials={userName.charAt(0)}
              />
            </div>
          </div>
        </div>

        {/* Sub Navigation - for main navigation (including More) */}
        {(hasSubNav || activeMainNav === 'More') && (
          <div className="bg-gray-300">
            <div className={navContainerClassName} style={containerStyle}>
              <div className="h-11 flex items-center">
                <nav
                  className="absolute flex items-center gap-0.5"
                  style={{
                    positionAnchor:
                      activeMainNav === 'More'
                        ? '--icon-more' // Use the More icon's anchor position
                        : `--nav-${activeMainNav?.toLowerCase().replace(/\s+/g, '-')}`,
                    justifySelf: 'anchor-center',
                  }}
                >
                  {/* Show sub-navigation items */}
                  {activeMainNav === 'More'
                    ? moreNavItems.map((item) => (
                        <div key={item.name} className="relative">
                          <button
                            onClick={() => {
                              const navigation =
                                NavigationUtils.fromMainNavigation(
                                  'More',
                                  item.name,
                                  item.subItems ? '' : undefined,
                                  'more'
                                );
                              handleNavigationChange(navigation);
                            }}
                            style={{
                              anchorName: `--sub-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
                            }}
                            className={`px-3 py-1 rounded-md text-base font-['Roobert_RC:Semibold',_sans-serif] transition-all duration-150 ease-in-out transform ${
                              activeSubNav === item.name
                                ? 'text-[#4a433c] scale-105'
                                : 'text-[#635a52] hover:text-[#4a433c] hover:scale-102'
                            } ${item.isExternal ? 'flex items-center gap-1' : ''}`}
                          >
                            {item.name}
                            {item.isExternal && (
                              <svg
                                className="w-3 h-3"
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
                          </button>
                          {activeSubNav === item.name && (
                            <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gray-600 rounded-full" />
                          )}
                        </div>
                      ))
                    : activeNavItem?.subItems?.map((subItem) => (
                        <div key={subItem.name} className="relative">
                          <button
                            onClick={() => {
                              const navigation =
                                NavigationUtils.fromMainNavigation(
                                  activeMainNav,
                                  subItem.name,
                                  subItem.subItems ? '' : undefined
                                );
                              handleNavigationChange(navigation);
                            }}
                            style={{
                              anchorName: `--sub-nav-${subItem.name.toLowerCase().replace(/\s+/g, '-')}`,
                            }}
                            className={`px-3 py-1 rounded-md text-base font-['Roobert_RC:Semibold',_sans-serif] transition-all duration-150 ease-in-out transform ${
                              subItem.active
                                ? 'text-[#4a433c] scale-105'
                                : 'text-[#635a52] hover:text-[#4a433c] hover:scale-102'
                            } ${subItem.isExternal ? 'flex items-center gap-1' : ''}`}
                          >
                            {subItem.name}
                            {subItem.isExternal && (
                              <svg
                                className="w-3 h-3"
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
                          </button>
                          {subItem.active && (
                            <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gray-600 rounded-full" />
                          )}
                        </div>
                      ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Third Level Navigation - for sub items with children (like Models under Planning) */}
        {hasThirdNav && (
          <div className="bg-gray-100 ">
            <div className={navContainerClassName} style={containerStyle}>
              <div className="h-11 flex items-center justify-end px-6 border-b border-gray-300 max-w-[1680px] min-w-[1280px] w-full mx-auto">
                <nav className="flex items-center gap-0.5">
                  {activeSubItem?.subItems?.map((thirdItem) => (
                    <div key={thirdItem.name} className="relative">
                      <button
                        onClick={() => {
                          const navigation = NavigationUtils.fromMainNavigation(
                            activeMainNav,
                            activeSubNav,
                            thirdItem.name
                          );
                          handleNavigationChange(navigation);
                        }}
                        style={{
                          anchorName: `--third-nav-${thirdItem.name.toLowerCase().replace(/\s+/g, '-')}`,
                        }}
                        className={`px-3 py-1 rounded-md text-base font-['Roobert_RC:Semibold',_sans-serif] transition-all duration-150 ease-in-out transform ${
                          thirdItem.active
                            ? 'text-[#4a433c] scale-105'
                            : 'text-[#635a52] hover:text-[#4a433c] hover:scale-102'
                        } ${thirdItem.isExternal ? 'flex items-center gap-1' : ''}`}
                      >
                        {thirdItem.name}
                        {thirdItem.isExternal && (
                          <svg
                            className="w-3 h-3"
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
                      </button>
                      {thirdItem.active && (
                        <div className="absolute bottom-0 left-2 right-2 h-1 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Sub Navigation - for right side icons */}
        {hasRightSubNav && (
          <div className="bg-gray-300">
            <div className={navContainerClassName} style={containerStyle}>
              <div className="h-11 px-6 flex items-center justify-end">
                <nav className="flex items-center gap-0.5">
                  {activeRightIconItem?.subItems?.map((subItem) => (
                    <div key={subItem.name} className="relative">
                      <button
                        onClick={() => {
                          const navigation =
                            NavigationUtils.fromRightIconNavigation(
                              activeRightIcon,
                              subItem.name
                            );
                          handleNavigationChange(navigation);
                        }}
                        className={`px-3 py-1 rounded-md text-base font-['Roobert_RC:Semibold',_sans-serif] transition-all duration-150 ease-in-out transform ${
                          subItem.active
                            ? 'text-[#4a433c] scale-105'
                            : 'text-[#635a52] hover:text-[#4a433c] hover:scale-102'
                        } ${subItem.isExternal ? 'flex items-center gap-1' : ''}`}
                      >
                        {subItem.name}
                        {subItem.isExternal && (
                          <svg
                            className="w-3 h-3"
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
                      </button>
                      {subItem.active && (
                        <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gray-600 rounded-full" />
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // Always call useContext at the top level, not conditionally
  const sidebarContext = useContext(SidebarLayoutContext);

  // For sidebar mode, render simplified header with logo, breadcrumb and right icons
  if (navigationMode === 'sidebar') {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className={containerClassName} style={containerStyle}>
          <div className="flex h-[72px] items-center justify-between px-6 py-0">
            {/* Left side - Logo and Sidebar Toggle */}
            <div className="flex items-center gap-3">
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

              {/* Sidebar Toggle Button */}
              {sidebarContext?.isOverlayMode ? (
                // Overlay mode: hover to show/hide
                <button
                  onMouseEnter={() => {
                    if (sidebarContext?.openOverlay) {
                      sidebarContext.openOverlay();
                    }
                  }}
                  onMouseLeave={() => {
                    if (sidebarContext?.closeOverlay) {
                      sidebarContext.closeOverlay();
                    }
                  }}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Show sidebar"
                >
                  <PanelLeft className="w-5 h-5" />
                </button>
              ) : (
                // Normal mode: click to toggle
                <button
                  onClick={() => {
                    if (sidebarContext?.toggleSidebar) {
                      sidebarContext.toggleSidebar();
                    }
                  }}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Toggle sidebar"
                >
                  {sidebarContext?.isSidebarVisible ? (
                    <PanelLeft className="w-5 h-5" />
                  ) : (
                    <PanelRight className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>

            {/* Center - Empty space in sidebar mode */}
            <div className="flex-1"></div>

            {/* Right side - Icons and User */}
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
                            NavigationUtils.fromRightIconNavigation(
                              iconItem.id
                            );
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

              {/* User Avatar */}
              <Avatar
                size="md"
                src={userAvatarUrl}
                alt={userName}
                initials={userName.charAt(0)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {navigationMode === 'horizontal' && <HorizontalNavigationLayout />}
      {navigationMode === 'hover' && <HoverNavigationLayout />}
    </div>
  );
};

// Export the navigation items for use in SidebarLayoutWrapper
export const getNavigationItems = (): NavItem[] => [
  { name: 'Dashboard' },
  {
    name: 'Planning',
    subItems: [
      { name: 'Clients' },
      {
        name: 'Models',
        subItems: [
          { name: 'Portfolios' },
          { name: 'Glide' },
          { name: 'Scenarios' },
          { name: 'Vesting' },
          { name: 'Retirement Spending' },
          { name: 'Annuities' },
        ],
      },
      { name: 'Assumptions' },
    ],
  },
  {
    name: 'ChubbyIntel',
    subItems: [
      { name: 'Dashboard' },
      { name: 'Client Overview' },
      { name: 'Opportunities' },
    ],
  },
  {
    name: 'ChubbyFlows',
    subItems: [{ name: 'Tasks' }, { name: 'Workflows' }],
  },
  {
    name: 'ChubbyPay',
    subItems: [
      { name: 'Plans' },
      { name: 'Subscriptions' },
      { name: 'Invoices' },
      { name: 'Transactions' },
      { name: 'Accounts' },
    ],
  },
  {
    name: 'Risk',
    subItems: [
      { name: 'Summary' },
      { name: 'Questionnaires' },
      { name: 'Categories' },
    ],
  },
  { name: 'Templates' },
  { name: 'Client Settings' },
  { name: 'Integrations' },
  { name: 'Admin', isExternal: true },
  { name: 'Help', isExternal: true },
];
