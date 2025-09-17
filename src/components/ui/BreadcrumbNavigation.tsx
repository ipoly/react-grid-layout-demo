import React from 'react';

import { ChevronDown, ChevronRight } from 'lucide-react';

import type { NavigationChangeHandler } from '../../types/navigation';
import { NavigationUtils } from '../../types/navigation';

// Breadcrumb item type
export interface BreadcrumbItem {
  label: string;
  level: number;
  type: 'rightIcon' | 'mainNav';
  iconId?: string;
  siblings?: Array<{
    name: string;
    active: boolean;
    isExternal?: boolean;
  }>;
  hasDropdown?: boolean;
}

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

interface BreadcrumbNavigationProps {
  navigationItems: NavItem[];
  rightSideIcons: RightSideIconItem[];
  activeMainNav?: string;
  activeSubNav?: string;
  activeThirdNav?: string;
  activeRightIcon?: string;
  activeRightSubNav?: string;
  onNavigationChange?: NavigationChangeHandler;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  navigationItems,
  rightSideIcons,
  activeMainNav,
  activeSubNav,
  activeThirdNav,
  activeRightIcon,
  activeRightSubNav,
  onNavigationChange,
  containerClassName = '',
  containerStyle,
}) => {
  // Function to get siblings for a breadcrumb item
  const getSiblings = (
    item: BreadcrumbItem
  ): Array<{ name: string; active: boolean; isExternal?: boolean }> => {
    if (item.type === 'rightIcon' && item.iconId) {
      const rightIcon = rightSideIcons.find((icon) => icon.id === item.iconId);
      if (rightIcon?.subItems) {
        return rightIcon.subItems.map((sub) => ({
          name: sub.name,
          active:
            sub.name === activeRightSubNav && rightIcon.id === activeRightIcon,
          isExternal: sub.isExternal,
        }));
      }
    } else if (item.type === 'mainNav') {
      if (item.level === 1) {
        // Level 1: Get sub-items of the active main nav
        const mainNavItem = navigationItems.find(
          (nav) => nav.name === activeMainNav
        );
        if (mainNavItem?.subItems) {
          return mainNavItem.subItems.map((sub) => ({
            name: sub.name,
            active: sub.name === activeSubNav,
            isExternal: sub.isExternal,
          }));
        }
      } else if (item.level === 2) {
        // Level 2: Get sub-items of the active sub nav
        const mainNavItem = navigationItems.find(
          (nav) => nav.name === activeMainNav
        );
        const subNavItem = mainNavItem?.subItems?.find(
          (sub) => sub.name === activeSubNav
        );
        if (subNavItem?.subItems) {
          return subNavItem.subItems.map((third) => ({
            name: third.name,
            active: third.name === activeThirdNav,
            isExternal: third.isExternal,
          }));
        }
      }
    }
    return [];
  };

  const breadcrumbItems: BreadcrumbItem[] = [];

  if (activeRightIcon) {
    // When a right-side icon is active, show that navigation path
    const rightIcon = rightSideIcons.find(
      (icon) => icon.id === activeRightIcon
    );
    if (rightIcon) {
      breadcrumbItems.push({
        label: rightIcon.name,
        level: 0,
        type: 'rightIcon',
        iconId: rightIcon.id,
      });

      if (activeRightSubNav) {
        const subNavItem: BreadcrumbItem = {
          label: activeRightSubNav,
          level: 1,
          type: 'rightIcon' as const,
          iconId: rightIcon.id,
        };
        const siblings = getSiblings(subNavItem);
        breadcrumbItems.push({
          ...subNavItem,
          siblings,
          hasDropdown: siblings.length > 1,
        });
      }
    }
  } else if (activeMainNav) {
    // When main navigation is active, show that navigation path
    breadcrumbItems.push({
      label: activeMainNav,
      level: 0,
      type: 'mainNav',
    });

    if (activeSubNav) {
      const subNavItem: BreadcrumbItem = {
        label: activeSubNav,
        level: 1,
        type: 'mainNav' as const,
      };
      const siblings = getSiblings(subNavItem);
      breadcrumbItems.push({
        ...subNavItem,
        siblings,
        hasDropdown: siblings.length > 1,
      });
    }

    if (activeThirdNav) {
      const thirdNavItem: BreadcrumbItem = {
        label: activeThirdNav,
        level: 2,
        type: 'mainNav' as const,
      };
      const siblings = getSiblings(thirdNavItem);
      breadcrumbItems.push({
        ...thirdNavItem,
        siblings,
        hasDropdown: siblings.length > 1,
      });
    }
  }

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (!onNavigationChange) return;

    if (item.type === 'rightIcon' && item.iconId) {
      if (item.level === 0) {
        const navigation = NavigationUtils.fromRightIconNavigation(item.iconId);
        onNavigationChange(navigation);
      } else if (item.level === 1) {
        const navigation = NavigationUtils.fromRightIconNavigation(
          item.iconId,
          item.label
        );
        onNavigationChange(navigation);
      }
    } else if (item.type === 'mainNav') {
      if (item.level === 0) {
        const navigation = NavigationUtils.fromMainNavigation(item.label);
        onNavigationChange(navigation);
      } else if (item.level === 1) {
        const navigation = NavigationUtils.fromMainNavigation(
          activeMainNav || '',
          item.label
        );
        onNavigationChange(navigation);
      } else if (item.level === 2) {
        const navigation = NavigationUtils.fromMainNavigation(
          activeMainNav || '',
          activeSubNav || '',
          item.label
        );
        onNavigationChange(navigation);
      }
    }
  };

  const handleSiblingClick = (item: BreadcrumbItem, siblingName: string) => {
    if (!onNavigationChange) return;

    if (item.type === 'rightIcon' && item.iconId) {
      if (item.level === 1) {
        const navigation = NavigationUtils.fromRightIconNavigation(
          item.iconId,
          siblingName
        );
        onNavigationChange(navigation);
      }
    } else if (item.type === 'mainNav') {
      if (item.level === 1) {
        const navigation = NavigationUtils.fromMainNavigation(
          activeMainNav || '',
          siblingName
        );
        onNavigationChange(navigation);
      } else if (item.level === 2) {
        const navigation = NavigationUtils.fromMainNavigation(
          activeMainNav || '',
          activeSubNav || '',
          siblingName
        );
        onNavigationChange(navigation);
      }
    }
  };

  // Don't render empty breadcrumb
  if (breadcrumbItems.length === 0) {
    return null;
  }

  // For sidebar mode, we don't need the outer container
  const breadcrumbContent = (
    <nav className="flex items-center h-10 px-6 text-sm">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="mx-2 h-3 w-3 text-gray-400" />}

          {/* Breadcrumb item with optional dropdown */}
          <div className={item.hasDropdown ? 'group relative' : ''}>
            <button
              onClick={() => handleBreadcrumbClick(item)}
              className={`flex items-center gap-1 transition-colors ${
                index === breadcrumbItems.length - 1
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
              {item.hasDropdown && (
                <ChevronDown className="h-3 w-3 opacity-50" />
              )}
            </button>

            {/* Hover dropdown for siblings */}
            {item.hasDropdown && item.siblings && (
              <div className="absolute top-full left-0 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform translate-y-1 group-hover:translate-y-0 z-50">
                {/* Invisible bridge area */}
                <div className="h-1 w-full" />

                {/* Actual dropdown menu */}
                <div className="bg-white rounded-lg shadow-lg ring-1 ring-gray-200 py-1 min-w-[160px]">
                  {item.siblings.map((sibling, siblingIndex) => (
                    <button
                      key={sibling.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSiblingClick(item, sibling.name);
                      }}
                      className={`dropdown-item-animate flex w-full items-center px-3 py-2 text-sm transition-colors ${
                        sibling.active
                          ? 'bg-brand/10 text-brand border-l-2 border-brand'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      style={{
                        animationDelay: `${siblingIndex * 30}ms`,
                      }}
                    >
                      <span className="flex items-center">
                        {sibling.name}
                        {sibling.isExternal && (
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
        </React.Fragment>
      ))}
    </nav>
  );

  // If containerClassName is provided, wrap with container (for hover mode)
  if (containerClassName) {
    return (
      <div className="bg-gray-50 border-b border-gray-200">
        <div className={containerClassName} style={containerStyle}>
          {breadcrumbContent}
        </div>
      </div>
    );
  }

  // Otherwise return just the breadcrumb content (for sidebar mode)
  return breadcrumbContent;
};
