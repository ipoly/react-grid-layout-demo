import { type ReactNode } from 'react';

import type { MetricConfig } from './MetricsBar';

// 导出一个简化的预设配置函数
export const createMetricsConfig = (
  components: ReactNode[],
  options?: {
    size?: 'small' | 'medium' | 'large';
    hideOnTablet?: boolean;
  }
): MetricConfig[] => {
  return components.map((component, index) => ({
    id: `metric-${index}`,
    component,
    size: options?.size || 'medium',
    hideOnTablet: options?.hideOnTablet || false,
    priority: components.length - index, // 越靠前优先级越高
  }));
};
