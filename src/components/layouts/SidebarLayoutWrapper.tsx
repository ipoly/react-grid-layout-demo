import React from 'react';

import { SidebarLayoutProvider } from '../../contexts/SidebarLayoutContext';

interface SidebarLayoutWrapperProps {
  children: React.ReactNode;
}

export const SidebarLayoutWrapper: React.FC<SidebarLayoutWrapperProps> = ({
  children,
}) => {
  return (
    <SidebarLayoutProvider>
      {/* Pass through children content */}
      {children}
    </SidebarLayoutProvider>
  );
};
