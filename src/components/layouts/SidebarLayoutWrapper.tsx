import React from 'react';

import { SidebarLayoutProvider } from '../../contexts/SidebarLayoutContext';
import { SidebarDebug } from '../SidebarDebug';

interface SidebarLayoutWrapperProps {
  children: React.ReactNode;
}

export const SidebarLayoutWrapper: React.FC<SidebarLayoutWrapperProps> = ({
  children,
}) => {
  return (
    <SidebarLayoutProvider>
      {/* Debug Panel - 仅在开发环境显示 */}
      {process.env.NODE_ENV === 'development' && <SidebarDebug />}

      {/* Pass through children content */}
      {children}
    </SidebarLayoutProvider>
  );
};
