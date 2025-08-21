import { useCallback, useEffect, useMemo, useState } from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';

import { Events } from './Events';
import { RecentPlans } from './RecentPlans';
import { Tasks } from './Tasks';
import { Workflows } from './Workflows';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface SidePaneProps {
  isDragging: boolean;
  isResizing: boolean;
  isMobile: boolean;
  onDragStart: () => void;
  onDragStop: () => void;
  onResizeStart: () => void;
  onResizeStop: () => void;
}

export const SidePane = ({
  isDragging,
  isResizing,
  isMobile,
  onDragStart,
  onDragStop,
  onResizeStart,
  onResizeStop,
}: SidePaneProps) => {
  // 侧边栏使用单列布局
  const sidebarCols = { lg: 1, md: 1, sm: 1, xs: 1, xxs: 1 };
  const sidebarBreakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };

  // 默认布局配置 - 侧边栏小部件垂直堆叠
  const defaultLayouts: Layouts = useMemo(
    () => ({
      lg: [
        {
          i: 'recent-plans',
          x: 0,
          y: 0,
          w: 1,
          h: 7,
          minW: 1,
          maxW: 1,
          minH: 5,
          maxH: 10,
        },
        {
          i: 'tasks',
          x: 0,
          y: 7,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
          minH: 4,
          maxH: 8,
        },
        {
          i: 'events',
          x: 0,
          y: 13,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
          minH: 4,
          maxH: 8,
        },
        {
          i: 'workflows',
          x: 0,
          y: 19,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
          minH: 4,
          maxH: 8,
        },
      ],
      md: [
        {
          i: 'recent-plans',
          x: 0,
          y: 0,
          w: 1,
          h: 7,
          minW: 1,
          maxW: 1,
        },
        {
          i: 'tasks',
          x: 0,
          y: 7,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
        },
        {
          i: 'events',
          x: 0,
          y: 13,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
        },
        {
          i: 'workflows',
          x: 0,
          y: 19,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
        },
      ],
      sm: [
        {
          i: 'recent-plans',
          x: 0,
          y: 0,
          w: 1,
          h: 7,
          minW: 1,
          maxW: 1,
        },
        {
          i: 'tasks',
          x: 0,
          y: 7,
          w: 1,
          h: 5,
          minW: 1,
          maxW: 1,
        },
        {
          i: 'events',
          x: 0,
          y: 12,
          w: 1,
          h: 5,
          minW: 1,
          maxW: 1,
        },
        {
          i: 'workflows',
          x: 0,
          y: 17,
          w: 1,
          h: 5,
          minW: 1,
          maxW: 1,
        },
      ],
    }),
    []
  );

  // 从 localStorage 加载布局
  const loadSavedLayouts = (): Layouts => {
    try {
      const saved = localStorage.getItem('dashboard-side-layouts');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.lg ? parsed : defaultLayouts;
      }
    } catch (error) {
      console.warn('Failed to load saved side pane layouts:', error);
    }
    return defaultLayouts;
  };

  const [layouts, setLayouts] = useState<Layouts>(loadSavedLayouts);

  // 布局变化处理
  const handleLayoutChange = useCallback(
    (_layout: Layout[], layouts: Layouts) => {
      setLayouts(layouts);
      try {
        localStorage.setItem('dashboard-side-layouts', JSON.stringify(layouts));
      } catch (error) {
        console.error('Failed to save side pane layout:', error);
      }
    },
    []
  );

  // 重置布局（通过 window 全局方法调用）
  useEffect(() => {
    const resetSidePaneLayout = () => {
      setLayouts(defaultLayouts);
      localStorage.setItem(
        'dashboard-side-layouts',
        JSON.stringify(defaultLayouts)
      );
    };

    // 将重置函数挂载到 window 对象
    const windowWithReset = window as Window & {
      __resetSidePaneLayout?: () => void;
    };
    windowWithReset.__resetSidePaneLayout = resetSidePaneLayout;

    return () => {
      delete windowWithReset.__resetSidePaneLayout;
    };
  }, [defaultLayouts]);

  return (
    <div className="w-full">
      <div
        className={`transition-all duration-200 ${isDragging || isResizing ? 'select-none' : ''}`}
      >
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={sidebarBreakpoints}
          cols={sidebarCols}
          rowHeight={68}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          onLayoutChange={handleLayoutChange}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          isDraggable={!isMobile}
          isResizable={!isMobile}
          compactType="vertical"
          preventCollision={false}
        >
          <div key="recent-plans" className="bg-transparent h-full">
            <RecentPlans />
          </div>

          <div key="tasks" className="bg-transparent h-full">
            <Tasks />
          </div>

          <div key="events" className="bg-transparent h-full">
            <Events />
          </div>

          <div key="workflows" className="bg-transparent h-full">
            <Workflows />
          </div>
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};
