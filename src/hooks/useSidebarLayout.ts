import { useCallback, useEffect, useRef, useState } from 'react';

export interface SidebarLayoutState {
  isSidebarVisible: boolean;
  sidebarWidth: number;
  isOverlayMode: boolean;
}

export const SIDEBAR_CONSTANTS = {
  SIDEBAR_WIDTH: 280,
  MIN_CONTENT_WIDTH: 1280,
  OVERLAY_BREAKPOINT: 1560, // MIN_CONTENT_WIDTH + SIDEBAR_WIDTH
} as const;

export const useSidebarLayout = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isOverlayMode, setIsOverlayMode] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Check if overlay mode should be activated based on window width
  useEffect(() => {
    const checkOverlayMode = () => {
      const width = window.innerWidth;
      const shouldBeOverlay = width < SIDEBAR_CONSTANTS.OVERLAY_BREAKPOINT;
      setIsOverlayMode(shouldBeOverlay);

      // Auto show/hide sidebar based on screen size
      if (!shouldBeOverlay) {
        setIsSidebarVisible(true); // Always show on large screens
      } else {
        setIsSidebarVisible(false); // Hide by default on small screens
      }
    };

    // Initial check
    checkOverlayMode();

    // Add resize listener
    window.addEventListener('resize', checkOverlayMode);

    return () => {
      window.removeEventListener('resize', checkOverlayMode);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const sidebarLayoutState: SidebarLayoutState = {
    isSidebarVisible,
    sidebarWidth: SIDEBAR_CONSTANTS.SIDEBAR_WIDTH,
    isOverlayMode,
  };

  // Toggle sidebar visibility
  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible((prev) => !prev);
  }, []);

  // Open overlay (hover enter)
  const openOverlay = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = undefined;
    }
    if (isOverlayMode) {
      setIsSidebarVisible(true);
    }
  }, [isOverlayMode]);

  // Close overlay with delay (hover leave)
  const closeOverlay = useCallback(() => {
    if (isOverlayMode) {
      closeTimeoutRef.current = setTimeout(() => {
        setIsSidebarVisible(false);
      }, 300); // 300ms delay to allow mouse movement
    }
  }, [isOverlayMode]);

  // Clear close timeout (when entering sidebar)
  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = undefined;
    }
  }, []);

  return {
    ...sidebarLayoutState,
    toggleSidebar,
    openOverlay,
    closeOverlay,
    clearCloseTimeout,
  };
};
