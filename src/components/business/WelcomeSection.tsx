import { Badge } from '@untitled-ui/components/base/badges/badges';
import { Button } from '@untitled-ui/components/base/buttons/button';
import { Layout, Plus, RotateCcw } from 'lucide-react';

interface WelcomeSectionProps {
  userName?: string;
  onResetLayout?: () => void;
  isDragging?: boolean;
  isResizing?: boolean;
}

export const WelcomeSection = ({
  userName = 'Emma',
  onResetLayout,
  isDragging = false,
  isResizing = false,
}: WelcomeSectionProps) => {
  return (
    <div className="flex flex-row items-center justify-between mb-6 gap-4">
      <div className="flex flex-row items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {userName}
        </h1>

        {/* Status indicators */}
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
      </div>

      <div className="flex items-center gap-3">
        <Button
          color="tertiary"
          size="md"
          iconLeading={RotateCcw}
          onClick={onResetLayout}
          className="text-gray-600"
        >
          Reset Layout
        </Button>

        <Button color="primary" size="md" iconLeading={Plus}>
          Add Widget
        </Button>
      </div>

      {/* Help text */}
      <div className="text-sm text-gray-600 flex items-center gap-2 mt-2">
        <Layout className="w-4 h-4" />
        <span>Drag and resize widgets to customize your dashboard</span>
      </div>
    </div>
  );
};
