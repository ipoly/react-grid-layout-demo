import { type ReactNode, useMemo } from 'react';

import { GridLayout } from './GridLayout';
import type { GridItemConfig } from './GridLayout';

export interface MetricConfig {
  id: string;
  component: ReactNode;

  // 布局配置
  size?: 'small' | 'medium' | 'large'; // 尺寸
  span?: number; // 占用列数

  // 响应式
  priority?: number; // 优先级（移动端）
  hideOnTablet?: boolean; // 平板端隐藏

  // 样式
  className?: string;
}

export interface MetricsBarProps {
  metrics: MetricConfig[];

  // 布局配置
  columns?: {
    desktop?: number; // 桌面端列数（默认 4）
    tablet?: number; // 平板端列数（默认 2）
  };

  // 响应式
  tabletBehavior?: 'grid' | 'carousel' | 'stack'; // 平板端行为
  breakpoints?: { [key: string]: number };

  // 功能控制
  reorderable?: boolean; // 可重排序
  expandable?: boolean; // 可展开/收起
  draggable?: boolean;
  resizable?: boolean;

  // 持久化
  storageKey?: string;
  autoSave?: boolean;

  // 样式
  className?: string;
  gap?: number; // 卡片间距
  compact?: boolean; // 紧凑模式

  // 外部传入的状态
  isDragging?: boolean;
  isResizing?: boolean;
  isMobile?: boolean;
  onDragStart?: () => void;
  onDragStop?: () => void;
  onResizeStart?: () => void;
  onResizeStop?: () => void;
}

export const MetricsBar = ({
  metrics,
  columns = {
    desktop: 4,
    tablet: 2,
  },
  tabletBehavior = 'grid',
  breakpoints,
  reorderable = true,
  // expandable = false, // TODO: implement expandable feature
  draggable = true,
  resizable = false,
  storageKey = 'metrics-layout',
  autoSave = true,
  className = '',
  compact = false,
  // isDragging = false,
  // isResizing = false,
  isMobile = false,
  onDragStart,
  onDragStop,
  onResizeStart,
  onResizeStop,
}: MetricsBarProps) => {
  // 计算每个指标的网格配置
  const gridItems: GridItemConfig[] = useMemo(() => {
    const desktopCols = columns.desktop || 4;
    const itemsPerRow = desktopCols;
    const colWidth = 12 / itemsPerRow;

    return metrics.map((metric, index) => {
      // 根据 size 计算占用列数
      let span = metric.span || colWidth;
      if (!metric.span) {
        switch (metric.size) {
          case 'small':
            span = Math.max(2, colWidth - 1);
            break;
          case 'large':
            span = Math.min(6, colWidth + 1);
            break;
          case 'medium':
          default:
            span = colWidth;
            break;
        }
      }

      // 计算位置
      const row = Math.floor(index / itemsPerRow);
      const col = (index % itemsPerRow) * colWidth;

      return {
        id: metric.id,
        component: metric.component,
        defaultLayout: {
          x: col,
          y: row * 2, // 每行高度为2
          w: span,
          h: 2,
        },
        minSize: { w: 2, h: 2 },
        maxSize: { w: 4, h: 3 },
        className: `grid-item-metric ${metric.className || ''}`,
      };
    });
  }, [metrics, columns.desktop]);

  // 处理平板端的列配置
  const gridCols = useMemo(() => {
    if (tabletBehavior === 'stack') {
      return {
        desktop: 12,
        tablet: 4, // 堆叠模式，每个指标占满宽度
      };
    }
    return {
      desktop: 12,
      tablet: columns.tablet ? columns.tablet * 3 : 8,
    };
  }, [columns.tablet, tabletBehavior]);

  // 如果是移动端且配置为堆叠
  if (isMobile && tabletBehavior === 'stack') {
    return (
      <div className={`space-y-4 ${className}`}>
        {metrics
          .filter((m) => !m.hideOnTablet)
          .sort((a, b) => (b.priority || 0) - (a.priority || 0))
          .map((metric) => (
            <div key={metric.id} className={metric.className}>
              {metric.component}
            </div>
          ))}
      </div>
    );
  }

  // 使用 GridLayout 渲染
  return (
    <div className={className}>
      <GridLayout
        items={gridItems}
        cols={gridCols}
        breakpoints={breakpoints}
        draggable={draggable && reorderable}
        resizable={resizable}
        compactType="horizontal"
        storageKey={storageKey}
        autoSave={autoSave}
        className={compact ? 'compact-metrics' : ''}
        maxRows={1}
        isMobile={isMobile}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
      />
    </div>
  );
};
