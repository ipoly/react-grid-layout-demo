import { Avatar } from '@untitled-ui/components/base/avatar/avatar';
import { Badge } from '@untitled-ui/components/base/badges/badges';
import { Bell, Folder, Key, MoreHorizontal, Settings } from 'lucide-react';

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
  onNavChange?: (mainNav: string, subNav?: string, thirdNav?: string) => void;
  activeRightIcon?: string;
  activeRightSubNav?: string;
  onRightIconChange?: (iconId: string, subNav?: string) => void;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
}

export const Header = ({
  userName = 'Emma',
  userAvatarUrl,
  currentBreakpointPreset: _currentBreakpointPreset = 'default',
  onBreakpointPresetChange: _onBreakpointPresetChange,
  activeMainNav = 'Planning',
  activeSubNav = 'Clients',
  activeThirdNav = '',
  onNavChange,
  activeRightIcon = '',
  activeRightSubNav = '',
  onRightIconChange,
  containerClassName = 'max-w-7xl mx-auto',
  containerStyle = {},
}: HeaderProps) => {
  /**
   * Navigation container classes:
   * Uses Tailwind v4 utility-first approach - no complex JavaScript manipulation.
   * Navigation bars manage their own vertical spacing through fixed heights.
   */
  const navContainerClassName = containerClassName;
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

  // Split navigation items: first 6 in primary nav, rest in "More" dropdown
  const primaryNavItems = navigationItems.slice(0, 6);
  const moreNavItems = navigationItems.slice(6);

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
  const activeSubItem = activeNavItem?.subItems?.find(
    (subItem) => subItem.name === activeSubNav
  );
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
    icon.active = icon.id === activeRightIcon;
    if (icon.subItems) {
      icon.subItems.forEach((subItem) => {
        subItem.active = subItem.name === activeRightSubNav && icon.active;
      });
    }
  });

  return (
    <div className="bg-white">
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
            <nav className="flex items-center gap-0.5">
              {/* Primary navigation items (first 6 only) */}
              {primaryNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onNavChange?.(item.name)}
                  style={{
                    anchorName: `--nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
                  }}
                  className={`px-3 py-2 rounded-md text-base font-['Roobert_RC:Semibold',_sans-serif] transition-all ${
                    item.active
                      ? 'bg-gray-300 text-[#4a433c] shadow-sm ring-1 ring-[#e6e2dc]'
                      : 'text-[#635a52] hover:text-[#4a433c] hover:bg-[#f8f7f5]'
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
                  <div key={iconItem.id} className="relative">
                    <button
                      onClick={() => onRightIconChange?.(iconItem.id)}
                      style={{ anchorName: `--icon-${iconItem.id}` }}
                      className={`p-2 rounded-md transition-colors ${
                        iconItem.active
                          ? 'text-[#4a433c] bg-gray-300 shadow-sm ring-1 ring-[#e6e2dc]'
                          : 'text-[#b8b1a9] hover:text-[#635a52] hover:bg-[#f8f7f5]'
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

      {/* Sub Navigation - for main navigation */}
      {hasSubNav && (
        <div className="bg-gray-300">
          <div className={navContainerClassName} style={containerStyle}>
            <div className="h-11 flex items-center">
              <nav
                className="absolute flex items-center gap-0.5"
                style={{
                  positionAnchor: `--nav-${activeMainNav?.toLowerCase().replace(/\s+/g, '-')}`,
                  justifySelf: 'anchor-center',
                }}
              >
                {activeNavItem?.subItems?.map((subItem) => (
                  <div key={subItem.name} className="relative">
                    <button
                      onClick={() =>
                        onNavChange?.(
                          activeMainNav,
                          subItem.name,
                          subItem.subItems ? '' : undefined
                        )
                      }
                      style={{
                        anchorName: `--sub-nav-${subItem.name.toLowerCase().replace(/\s+/g, '-')}`,
                      }}
                      className={`px-3 py-1 rounded-md text-base font-['Roobert_RC:Semibold',_sans-serif] transition-colors ${
                        subItem.active
                          ? 'text-[#4a433c]'
                          : 'text-[#635a52] hover:text-[#4a433c]'
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
        <div className="bg-gray-100">
          <div className={navContainerClassName} style={containerStyle}>
            <div className="h-11 flex items-center justify-end px-6 border-b border-gray-300">
              <nav className="flex items-center gap-0.5">
                {activeSubItem?.subItems?.map((thirdItem) => (
                  <div key={thirdItem.name} className="relative">
                    <button
                      onClick={() =>
                        onNavChange?.(
                          activeMainNav,
                          activeSubNav,
                          thirdItem.name
                        )
                      }
                      style={{
                        anchorName: `--third-nav-${thirdItem.name.toLowerCase().replace(/\s+/g, '-')}`,
                      }}
                      className={`px-3 py-1 rounded-md text-base font-['Roobert_RC:Semibold',_sans-serif] transition-colors ${
                        thirdItem.active
                          ? 'text-[#4a433c]'
                          : 'text-[#635a52] hover:text-[#4a433c]'
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
                      onClick={() =>
                        onRightIconChange?.(activeRightIcon, subItem.name)
                      }
                      className={`px-3 py-1 rounded-md text-base font-['Roobert_RC:Semibold',_sans-serif] transition-colors ${
                        subItem.active
                          ? 'text-[#4a433c]'
                          : 'text-[#635a52] hover:text-[#4a433c]'
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
    </div>
  );
};
