/**
 * Storage configuration for localStorage keys
 * Update STORAGE_VERSION when making breaking changes to layout structure
 */

// Version UUID - Update this when making breaking changes to layout structure
// This ensures old localStorage data doesn't interfere with new layouts
export const STORAGE_VERSION = 'v3-2025-8-22-gridlayout';

// Storage keys with version
export const STORAGE_KEYS = {
  TOP_LAYOUTS: `dashboard-top-layouts-${STORAGE_VERSION}`,
  SIDE_LAYOUTS: `dashboard-side-layouts-${STORAGE_VERSION}`,
  ACTIVITIES_COLUMNS: `activities-grid-columns-${STORAGE_VERSION}`,
  BREAKPOINT_PRESET: `dashboard-breakpoint-preset-${STORAGE_VERSION}`,
  NAVIGATION_MODE: `dashboard-navigation-mode-${STORAGE_VERSION}`,
} as const;

// Helper function to clean up old versions
export const cleanupOldVersions = () => {
  const currentKeys = Object.values(STORAGE_KEYS) as string[];
  const allKeys = Object.keys(localStorage);

  allKeys.forEach((key) => {
    // Remove old versioned keys that don't match current version
    if (
      (key.startsWith('dashboard-') || key.startsWith('activities-')) &&
      !currentKeys.includes(key)
    ) {
      localStorage.removeItem(key);
    }
  });
};
