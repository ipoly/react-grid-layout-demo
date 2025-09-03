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
  }>;
}

interface HeaderProps {
  userName?: string;
  userAvatarUrl?: string;
  currentBreakpointPreset?: string;
  onBreakpointPresetChange?: (presetId: string) => void;
  activeMainNav?: string;
  activeSubNav?: string;
  onNavChange?: (mainNav: string, subNav?: string) => void;
}

export const Header = ({
  userName = 'Emma',
  userAvatarUrl,
  currentBreakpointPreset: _currentBreakpointPreset = 'default',
  onBreakpointPresetChange: _onBreakpointPresetChange,
  activeMainNav = 'Planning',
  activeSubNav = 'Clients',
  onNavChange,
}: HeaderProps) => {
  // Navigation structure based on Advisor Portal Navigation Tree
  const navigationItems: NavItem[] = [
    { name: 'Dashboard' },
    { name: 'Clients' },
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
    { name: 'Admin', isExternal: true },
    { name: 'Help', isExternal: true },
  ];

  // Set active states
  const activeNavItem = navigationItems.find(
    (item) => item.name === activeMainNav
  );
  const hasSubNav =
    activeNavItem?.subItems && activeNavItem.subItems.length > 0;

  navigationItems.forEach((item) => {
    item.active = item.name === activeMainNav;
    if (item.subItems) {
      item.subItems.forEach((subItem) => {
        subItem.active = subItem.name === activeSubNav && item.active;
      });
    }
  });

  return (
    <div className="bg-white">
      {/* Main Navigation */}
      <div className="px-12 py-0">
        <div className="flex h-[72px] items-center justify-between">
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
            <nav className="flex items-center gap-1">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onNavChange?.(item.name)}
                  className={`px-3 py-2 rounded-md text-base font-semibold transition-all ${
                    item.active
                      ? 'bg-[#f2f0ee] text-[#4a433c]'
                      : 'text-[#635a52] hover:text-[#4a433c] hover:bg-gray-50'
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
            {/* Action Icons */}
            <div className="flex gap-1">
              <button className="p-2 rounded-md text-[#b8b1a9] hover:text-[#635a52] hover:bg-gray-50 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-md text-[#b8b1a9] hover:text-[#635a52] hover:bg-gray-50 transition-colors">
                <Key className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-md text-[#b8b1a9] hover:text-[#635a52] hover:bg-gray-50 transition-colors">
                <Folder className="w-5 h-5" />
              </button>
              <div className="relative">
                <button className="p-2 rounded-md text-[#b8b1a9] hover:text-[#635a52] hover:bg-gray-50 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <Badge
                  type="pill-color"
                  color="error"
                  size="sm"
                  className="absolute -top-1 -right-1 w-2 h-2 p-0 min-w-0"
                >
                  <span className="sr-only">New notifications</span>
                </Badge>
              </div>
              <button className="p-2 rounded-md text-[#b8b1a9] hover:text-[#635a52] hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
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

      {/* Sub Navigation */}
      {hasSubNav && (
        <div className="bg-[#f2f0ee] px-12 py-0">
          <div className="flex h-11 items-center gap-8">
            <nav className="flex items-center gap-2">
              {activeNavItem?.subItems?.map((subItem) => (
                <div key={subItem.name} className="relative">
                  <button
                    onClick={() => onNavChange?.(activeMainNav, subItem.name)}
                    className={`px-3 py-1 rounded-md text-base font-semibold transition-colors ${
                      subItem.active
                        ? 'text-[#4a433c]'
                        : 'text-[#635a52] hover:text-[#4a433c]'
                    }`}
                  >
                    {subItem.name}
                  </button>
                  {subItem.active && (
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#d1ccc6] rounded-full" />
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
