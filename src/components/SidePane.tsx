import { useCallback, useEffect, useMemo, useState } from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';

import { STORAGE_KEYS } from '../config/storage';
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
          resizeHandles: ['s'], // 只显示底部调整手柄
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
          resizeHandles: ['s'], // 只显示底部调整手柄
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
          resizeHandles: ['s'], // 只显示底部调整手柄
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
          resizeHandles: ['s'], // 只显示底部调整手柄
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
          resizeHandles: ['s'], // 只显示底部调整手柄
        },
        {
          i: 'tasks',
          x: 0,
          y: 7,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
          resizeHandles: ['s'], // 只显示底部调整手柄
        },
        {
          i: 'events',
          x: 0,
          y: 13,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
          resizeHandles: ['s'], // 只显示底部调整手柄
        },
        {
          i: 'workflows',
          x: 0,
          y: 19,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
          resizeHandles: ['s'], // 只显示底部调整手柄
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
          resizeHandles: ['s'], // 只显示底部调整手柄
        },
        {
          i: 'tasks',
          x: 0,
          y: 7,
          w: 1,
          h: 5,
          minW: 1,
          maxW: 1,
          resizeHandles: ['s'], // 只显示底部调整手柄
        },
        {
          i: 'events',
          x: 0,
          y: 12,
          w: 1,
          h: 5,
          minW: 1,
          maxW: 1,
          resizeHandles: ['s'], // 只显示底部调整手柄
        },
        {
          i: 'workflows',
          x: 0,
          y: 17,
          w: 1,
          h: 5,
          minW: 1,
          maxW: 1,
          resizeHandles: ['s'], // 只显示底部调整手柄
        },
      ],
    }),
    []
  );

  // 从 localStorage 加载布局
  const loadSavedLayouts = (): Layouts => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIDE_LAYOUTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lg) {
          // 确保每个布局项都有 resizeHandles 属性
          const ensureResizeHandles = (layouts: Layouts): Layouts => {
            const result = { ...layouts };
            Object.keys(result).forEach((breakpoint) => {
              result[breakpoint] = result[breakpoint].map((item) => ({
                ...item,
                resizeHandles: item.resizeHandles || ['s'], // 默认只显示底部手柄
              }));
            });
            return result;
          };
          return ensureResizeHandles(parsed);
        }
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
      // 确保保存时保留 resizeHandles 属性
      const layoutsWithHandles = { ...layouts };
      Object.keys(layoutsWithHandles).forEach((breakpoint) => {
        layoutsWithHandles[breakpoint] = layoutsWithHandles[breakpoint].map(
          (item) => ({
            ...item,
            resizeHandles: item.resizeHandles || ['s'], // 确保总是有 resizeHandles
          })
        );
      });
      setLayouts(layoutsWithHandles);
      try {
        localStorage.setItem(
          STORAGE_KEYS.SIDE_LAYOUTS,
          JSON.stringify(layoutsWithHandles)
        );
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
      // 删除 localStorage 中的数据，强制使用默认布局
      localStorage.removeItem(STORAGE_KEYS.SIDE_LAYOUTS);
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
