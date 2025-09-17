import React, { createContext, useContext } from 'react';

import {
  type SidebarLayoutState,
  useSidebarLayout,
} from '../hooks/useSidebarLayout';

interface SidebarLayoutContextType extends SidebarLayoutState {
  toggleSidebar: () => void;
  openOverlay: () => void;
  closeOverlay: () => void;
  clearCloseTimeout: () => void;
}

export const SidebarLayoutContext =
  createContext<SidebarLayoutContextType | null>(null);

export const SidebarLayoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const sidebarLayout = useSidebarLayout();

  return (
    <SidebarLayoutContext.Provider value={sidebarLayout}>
      {children}
    </SidebarLayoutContext.Provider>
  );
};

export const useSidebarLayoutContext = (): SidebarLayoutContextType => {
  const context = useContext(SidebarLayoutContext);
  if (!context) {
    throw new Error(
      'useSidebarLayoutContext must be used within a SidebarLayoutProvider'
    );
  }
  return context;
};
