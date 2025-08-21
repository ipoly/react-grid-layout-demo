import { Badge } from '@untitled-ui/components/base/badges/badges';
import { Button } from '@untitled-ui/components/base/buttons/button';
import { Layout, Plus, RotateCcw } from 'lucide-react';

interface WelcomeSectionProps {
  userName?: string;
  onResetLayout?: () => void;
  isDragging?: boolean;
  isResizing?: boolean;
  isMobile?: boolean;
}

export const WelcomeSection = ({
  userName = 'Emma',
  onResetLayout,
  isDragging = false,
  isResizing = false,
  isMobile = false,
}: WelcomeSectionProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Welcome back, {userName}
        </h1>

        {/* Status indicators - only show on desktop */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <Badge
              type="pill-color"
              color={isDragging ? 'warning' : 'gray'}
              size="sm"
            >
              {isDragging ? 'Dragging' : 'Ready'}
            </Badge>
            <Badge
              type="pill-color"
              color={isResizing ? 'warning' : 'gray'}
              size="sm"
            >
              {isResizing ? 'Resizing' : 'Ready'}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isMobile && (
          <Button
            color="tertiary"
            size="md"
            iconLeading={RotateCcw}
            onClick={onResetLayout}
            className="text-gray-600"
          >
            <span className="hidden sm:inline">Reset Layout</span>
            <span className="sm:hidden">Reset</span>
          </Button>
        )}

        <Button color="primary" size="md" iconLeading={Plus}>
          <span className="hidden sm:inline">Add Widget</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Help text - only show on desktop */}
      {!isMobile && (
        <div className="lg:hidden text-sm text-gray-600 flex items-center gap-2 mt-2">
          <Layout className="w-4 h-4" />
          <span>Drag and resize widgets to customize your dashboard</span>
        </div>
      )}
    </div>
  );
};
