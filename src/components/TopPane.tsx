import { useCallback, useEffect, useMemo, useState } from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';

import { GRID_CONFIG } from '../config/grid';
import { STORAGE_KEYS } from '../config/storage';
import { AssetsMetric } from './business/metrics/AssetsMetric';
import { ClientsMetric } from './business/metrics/ClientsMetric';
import { PlansMetric } from './business/metrics/PlansMetric';
import { TasksMetric } from './business/metrics/TasksMetric';

const ResponsiveGridLayout = WidthProvider(Responsive);

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
  // 顶部面板使用标准列数
  const topPaneCols = { lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 };
  // 默认布局配置 - 顶部4个指标卡片（单行）
  const defaultLayouts: Layouts = useMemo(
    () => ({
      lg: [
        {
          i: 'clients-metric',
          x: 0,
          y: 0,
          w: 3,
          h: 2,
          minW: 2,
          maxW: 4,
          minH: 2,
          maxH: 3,
        },
        {
          i: 'tasks-metric',
          x: 3,
          y: 0,
          w: 3,
          h: 2,
          minW: 2,
          maxW: 4,
          minH: 2,
          maxH: 3,
        },
        {
          i: 'assets-metric',
          x: 6,
          y: 0,
          w: 3,
          h: 2,
          minW: 2,
          maxW: 4,
          minH: 2,
          maxH: 3,
        },
        {
          i: 'plans-metric',
          x: 9,
          y: 0,
          w: 3,
          h: 2,
          minW: 2,
          maxW: 4,
          minH: 2,
          maxH: 3,
        },
      ],
      md: [
        // 平板：保持单行，10列
        { i: 'clients-metric', x: 0, y: 0, w: 2, h: 2, minW: 2, maxW: 3 },
        { i: 'tasks-metric', x: 2, y: 0, w: 2, h: 2, minW: 2, maxW: 3 },
        { i: 'assets-metric', x: 4, y: 0, w: 2, h: 2, minW: 2, maxW: 3 },
        { i: 'plans-metric', x: 6, y: 0, w: 2, h: 2, minW: 2, maxW: 3 },
      ],
      sm: [
        // 小屏幕：8列
        { i: 'clients-metric', x: 0, y: 0, w: 2, h: 2, minW: 1, maxW: 2 },
        { i: 'tasks-metric', x: 2, y: 0, w: 2, h: 2, minW: 1, maxW: 2 },
        { i: 'assets-metric', x: 4, y: 0, w: 2, h: 2, minW: 1, maxW: 2 },
        { i: 'plans-metric', x: 6, y: 0, w: 2, h: 2, minW: 1, maxW: 2 },
      ],
    }),
    []
  );

  // 从 localStorage 加载布局
  const loadSavedLayouts = (): Layouts => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOP_LAYOUTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.lg ? parsed : defaultLayouts;
      }
    } catch (error) {
      console.warn('Failed to load saved top pane layouts:', error);
    }
    return defaultLayouts;
  };

  const [layouts, setLayouts] = useState<Layouts>(loadSavedLayouts);

  // 布局变化处理
  const handleLayoutChange = useCallback(
    (_layout: Layout[], layouts: Layouts) => {
      setLayouts(layouts);
      try {
        localStorage.setItem(STORAGE_KEYS.TOP_LAYOUTS, JSON.stringify(layouts));
      } catch (error) {
        console.error('Failed to save top pane layout:', error);
      }
    },
    []
  );

  // 重置布局（通过 window 全局方法调用）
  useEffect(() => {
    const resetTopPaneLayout = () => {
      setLayouts(defaultLayouts);
      // 删除 localStorage 中的数据，强制使用默认布局
      localStorage.removeItem(STORAGE_KEYS.TOP_LAYOUTS);
    };

    // 将重置函数挂载到 window 对象
    const windowWithReset = window as Window & {
      __resetTopPaneLayout?: () => void;
    };
    windowWithReset.__resetTopPaneLayout = resetTopPaneLayout;

    return () => {
      delete windowWithReset.__resetTopPaneLayout;
    };
  }, [defaultLayouts]);

  return (
    <div className="mb-6">
      <div
        className={`transition-all duration-200 ${isDragging || isResizing ? 'select-none' : ''}`}
      >
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={breakpoints}
          cols={topPaneCols}
          rowHeight={GRID_CONFIG.ROW_HEIGHT}
          margin={GRID_CONFIG.MARGIN}
          containerPadding={GRID_CONFIG.CONTAINER_PADDING}
          onLayoutChange={handleLayoutChange}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          isDraggable={!isMobile}
          isResizable={false}
          compactType="horizontal"
          maxRows={1}
          useCSSTransforms={true}
        >
          <div key="clients-metric" className="bg-transparent h-full">
            <ClientsMetric />
          </div>

          <div key="tasks-metric" className="bg-transparent h-full">
            <TasksMetric />
          </div>

          <div key="assets-metric" className="bg-transparent h-full">
            <AssetsMetric />
          </div>

          <div key="plans-metric" className="bg-transparent h-full">
            <PlansMetric />
          </div>
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};
