import { useMemo } from 'react';

import { STORAGE_KEYS } from '../config/storage';
import { AssetsMetric } from './business/metrics/AssetsMetric';
import { ClientsMetric } from './business/metrics/ClientsMetric';
import { PlansMetric } from './business/metrics/PlansMetric';
import { TasksMetric } from './business/metrics/TasksMetric';
import { MetricsBar } from './layouts/MetricsBar';
import type { MetricConfig } from './layouts/MetricsBar';

interface TopPaneProps {
  isDragging: boolean;
  isResizing: boolean;
  isMobile: boolean;
  onDragStart: () => void;
  onDragStop: () => void;
  onResizeStart: () => void;
  onResizeStop: () => void;
  breakpoints: { [key: string]: number };
}

export const TopPane = ({
  isDragging,
  isResizing,
  isMobile,
  onDragStart,
  onDragStop,
  onResizeStart,
  onResizeStop,
  breakpoints,
}: TopPaneProps) => {
  // 指标配置
  const metricsConfig: MetricConfig[] = useMemo(
    () => [
      {
        id: 'clients-metric',
        component: <ClientsMetric />,
        size: 'medium',
        priority: 1,
      },
      {
        id: 'tasks-metric',
        component: <TasksMetric />,
        size: 'medium',
        priority: 2,
      },
      {
        id: 'assets-metric',
        component: <AssetsMetric />,
        size: 'medium',
        priority: 3,
      },
      {
        id: 'plans-metric',
        component: <PlansMetric />,
        size: 'medium',
        priority: 4,
      },
    ],
    []
  );

  return (
    <div className="mb-6">
      <div
        className={`transition-all duration-200 ${isDragging || isResizing ? 'select-none' : ''}`}
      >
        <MetricsBar
          metrics={metricsConfig}
          columns={{ desktop: 4, tablet: 2 }}
          tabletBehavior="grid"
          breakpoints={breakpoints}
          reorderable={true}
          draggable={!isMobile}
          resizable={false}
          storageKey={STORAGE_KEYS.TOP_LAYOUTS}
          autoSave={true}
          isMobile={isMobile}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          compact={false}
        />
      </div>
    </div>
  );
};
