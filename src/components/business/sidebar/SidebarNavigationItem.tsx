import React, { useState } from 'react';

import { ChevronDown, ChevronRight } from 'lucide-react';

import { useSidebarLayoutContext } from '../../../contexts/SidebarLayoutContext';
import type { NavigationChangeHandler } from '../../../types/navigation';
import { NavigationUtils } from '../../../types/navigation';

interface NavSubItem {
  name: string;
  active?: boolean;
  isExternal?: boolean;
  subItems?: Array<{
    name: string;
    active?: boolean;
    isExternal?: boolean;
  }>;
}

interface NavItem {
  name: string;
  active?: boolean;
  isExternal?: boolean;
  subItems?: NavSubItem[];
}

interface SidebarNavigationItemProps {
  item: NavItem;
  level: 1 | 2;
  onNavigationChange?: NavigationChangeHandler;
  activeMainNav?: string;
  activeSubNav?: string;
  activeThirdNav?: string;
}

export const SidebarNavigationItem: React.FC<SidebarNavigationItemProps> = ({
  item,
  level,
  onNavigationChange,
  activeMainNav,
  activeSubNav,
  activeThirdNav,
}) => {
  const [isExpanded, setIsExpanded] = useState(item.active || false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isOverlayMode, closeOverlay } = useSidebarLayoutContext();

  const hasSubItems = item.subItems && item.subItems.length > 0;
  const hasThirdLevel =
    hasSubItems &&
    item.subItems?.some(
      (subItem) => subItem.subItems && subItem.subItems.length > 0
    );

  // Helper to close sidebar in overlay mode after navigation
  const closeIfOverlayMode = () => {
    if (isOverlayMode) {
      // Delay slightly to allow navigation animation to start
      setTimeout(() => {
        closeOverlay();
      }, 150);
    }
  };

  const handleItemClick = () => {
    if (level === 1) {
      // Level 1: Main navigation
      const navigation = NavigationUtils.fromMainNavigation(item.name);
      onNavigationChange?.(navigation);

      // If has sub items, toggle expansion
      if (hasSubItems) {
        setIsExpanded(!isExpanded);
      } else {
        // No sub items - this is a leaf node, close sidebar in overlay mode
        closeIfOverlayMode();
      }
    } else if (level === 2) {
      // Level 2: Sub navigation
      const navigation = NavigationUtils.fromMainNavigation(
        activeMainNav || '',
        item.name,
        hasThirdLevel ? '' : undefined
      );
      onNavigationChange?.(navigation);

      // If no third level, this is a leaf node, close sidebar
      if (!hasThirdLevel) {
        closeIfOverlayMode();
      }
    }
  };

  const handleThirdLevelClick = (
    thirdItem: NonNullable<NavSubItem['subItems']>[0]
  ) => {
    const navigation = NavigationUtils.fromMainNavigation(
      activeMainNav || '',
      item.name,
      thirdItem.name
    );
    onNavigationChange?.(navigation);
    setDropdownOpen(false);

    // Third level is always a leaf node, close sidebar in overlay mode
    closeIfOverlayMode();
  };

  const renderExternalIcon = () => (
    <svg
      className="w-3 h-3 ml-1 shrink-0"
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
  );

  if (level === 1) {
    return (
      <div className="mb-1">
        {/* Main navigation item */}
        <button
          onClick={handleItemClick}
          className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-left transition-all duration-200 ${
            item.active
              ? 'bg-brand/10 text-brand font-semibold'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <span className="flex-1 truncate flex items-center">
            {item.name}
            {item.isExternal && renderExternalIcon()}
          </span>
          {hasSubItems && (
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          )}
        </button>

        {/* Sub items - collapsible */}
        {hasSubItems && isExpanded && (
          <div className="mt-1 ml-3 border-l border-gray-200 pl-3">
            {item.subItems?.map((subItem) => (
              <SidebarNavigationItem
                key={subItem.name}
                item={subItem}
                level={2}
                onNavigationChange={onNavigationChange}
                activeMainNav={activeMainNav}
                activeSubNav={activeSubNav}
                activeThirdNav={activeThirdNav}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Level 2 items
  const subItemHasThirdLevel = item.subItems && item.subItems.length > 0;

  return (
    <div className="mb-0.5 relative">
      <button
        onClick={() => {
          if (subItemHasThirdLevel) {
            // If has third level, show dropdown
            setDropdownOpen(!dropdownOpen);
          } else {
            // If no third level, navigate directly
            handleItemClick();
          }
        }}
        className={`flex w-full items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
          item.active
            ? 'bg-brand/10 text-brand font-medium'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
        }`}
      >
        <span className="flex-1 truncate text-left flex items-center">
          {item.name}
          {item.isExternal && renderExternalIcon()}
        </span>
        {subItemHasThirdLevel && (
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </button>

      {/* Third level dropdown */}
      {subItemHasThirdLevel && dropdownOpen && (
        <div className="absolute left-full top-0 ml-2 z-[60]">
          <div className="bg-white rounded-lg shadow-lg ring-1 ring-gray-200 py-1 min-w-[180px]">
            {item.subItems?.map((thirdItem) => (
              <button
                key={thirdItem.name}
                onClick={() => handleThirdLevelClick(thirdItem)}
                className={`dropdown-item-animate flex w-full items-center px-3 py-2 text-sm transition-colors ${
                  thirdItem.active
                    ? 'bg-brand/10 text-brand border-l-2 border-brand'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center">
                  {thirdItem.name}
                  {thirdItem.isExternal && renderExternalIcon()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
