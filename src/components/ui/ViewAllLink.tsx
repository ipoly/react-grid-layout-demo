import { Button } from '@untitled-ui/components/base/buttons/button';
import type { LucideIcon } from 'lucide-react';

interface ViewAllLinkProps {
  onClick?: () => void;
  showIcon?: boolean;
  icon?: LucideIcon;
  align?: 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
}

export const ViewAllLink: React.FC<ViewAllLinkProps> = ({
  onClick,
  showIcon = false,
  icon,
  align = 'left',
  className = '',
  children = 'View all',
}) => {
  const alignmentClass = align === 'right' ? 'justify-end' : 'justify-start';

  return (
    <div className="mt-auto">
      <div className="pt-4">
        <hr className="border-gray-200 mb-4" />
        <div className={`flex ${alignmentClass}`}>
          <Button
            color="link-color"
            size="sm"
            iconLeading={showIcon && icon ? icon : undefined}
            className={`text-blue-600 ${className}`}
            onClick={onClick}
          >
            {children}
          </Button>
        </div>
      </div>
    </div>
  );
};
