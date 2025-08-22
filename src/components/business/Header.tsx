import { useState } from 'react';

import { Avatar } from '@untitled-ui/components/base/avatar/avatar';
import { Badge } from '@untitled-ui/components/base/badges/badges';
import { Button } from '@untitled-ui/components/base/buttons/button';
import { Bell, HelpCircle, Menu } from 'lucide-react';

import { SettingsMenu } from './SettingsMenu';

interface HeaderProps {
  userName?: string;
  userAvatarUrl?: string;
  currentBreakpointPreset?: string;
  onBreakpointPresetChange?: (presetId: string) => void;
}

export const Header = ({
  userName = 'Emma',
  userAvatarUrl,
  currentBreakpointPreset = 'default',
  onBreakpointPresetChange,
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', active: true },
    { name: 'Planning' },
    { name: 'Households' },
    { name: 'ChubbyIntel' },
    { name: 'ChubbyFlows' },
    { name: 'Risk' },
    { name: 'ChubbyPay' },
    { name: 'Admin' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-4 lg:space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">RC</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 hidden sm:block">
              ChubbyCapital
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                className={`text-sm font-medium transition-colors ${
                  item.active
                    ? 'text-brand border-b-2 border-brand pb-1'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            color="tertiary"
            size="sm"
            className="lg:hidden p-2"
            iconLeading={Menu}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>

        {/* Right side - Actions and User */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Help - Hidden on mobile */}
          <Button
            color="secondary"
            size="sm"
            className="hidden md:flex text-gray-600"
            iconLeading={HelpCircle}
          >
            Help
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              color="tertiary"
              size="sm"
              className="p-2"
              iconLeading={Bell}
            />
            <Badge
              type="pill-color"
              color="error"
              size="sm"
              className="absolute -top-1 -right-1 w-2 h-2 p-0 min-w-0"
            >
              <span className="sr-only">New notifications</span>
            </Badge>
          </div>

          {/* Settings Menu - Hidden on mobile */}
          <div className="hidden sm:block">
            <SettingsMenu
              currentPreset={currentBreakpointPreset}
              onPresetChange={onBreakpointPresetChange || (() => {})}
            />
          </div>

          {/* User Avatar */}
          <Avatar
            size="sm"
            src={userAvatarUrl}
            alt={userName}
            initials={userName.charAt(0)}
          />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
          <nav className="grid grid-cols-2 gap-2">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                className={`text-sm font-medium p-3 rounded-lg text-left transition-colors ${
                  item.active
                    ? 'text-brand bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
