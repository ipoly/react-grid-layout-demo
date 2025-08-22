import type { FC, ReactNode } from 'react';

import { Badge } from '@untitled-ui/components/base/badges/badges';
import { FeaturedIcon } from '@untitled-ui/components/foundations/featured-icon/featured-icons';
import { MoreHorizontal } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string;
    type: 'positive' | 'negative';
    period: string;
  };
  icon: FC<{ className?: string }> | ReactNode;
  iconColor?: 'brand' | 'gray' | 'success' | 'warning' | 'error';
  iconTheme?:
    | 'light'
    | 'gradient'
    | 'dark'
    | 'outline'
    | 'modern'
    | 'modern-neue';
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  change,
  icon,
  iconColor = 'gray',
  iconTheme = 'light',
  className = '',
}: MetricCardProps) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-sm text-gray-600 font-medium">{title}</div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-3xl font-semibold text-gray-900 mb-1">
            {value}
          </div>
          {subtitle && (
            <div className="text-sm text-gray-600 mb-2">{subtitle}</div>
          )}
          {change && (
            <div className="flex items-center text-sm">
              <Badge
                type="pill-color"
                color={change.type === 'positive' ? 'success' : 'error'}
                size="sm"
                className="mr-2"
              >
                {change.type === 'positive' ? '+' : ''}
                {change.value}
              </Badge>
              <span className="text-gray-600">since {change.period}</span>
            </div>
          )}
        </div>

        <div className="ml-4">
          <FeaturedIcon
            color={iconColor}
            theme={iconTheme}
            size="lg"
            icon={icon}
          />
        </div>
      </div>
    </div>
  );
};
