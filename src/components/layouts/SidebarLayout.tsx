import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';

import { GRID_CONFIG } from '../../config/grid';

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface SidebarWidget {
  id: string;
  title?: string;
  component: ReactNode;

  // 布局配置
  defaultHeight?: number;
  minHeight?: number;
  maxHeight?: number;

  // 功能配置
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  removable?: boolean;

  // 样式
  className?: string;
  headerClassName?: string;
}

export interface SidebarLayoutProps {
  widgets: SidebarWidget[];
  width?: number; // 宽度（列数）

  // 功能控制
  collapsible?: boolean; // 整体可折叠
  defaultCollapsed?: boolean;
  reorderable?: boolean; // 可重排序
  resizable?: boolean; // 可调整高度

  // 持久化
  storageKey?: string; // 保存布局的key

  // 回调
  onReorder?: (widgets: SidebarWidget[]) => void;
  onHeightChange?: (id: string, height: number) => void;
  onLayoutChange?: (layouts: Layouts) => void;

  // 样式
  className?: string;
  gap?: number; // 小部件间距

  // 外部传入的状态
  isDragging?: boolean;
  isResizing?: boolean;
  isMobile?: boolean;
  onDragStart?: () => void;
  onDragStop?: () => void;
  onResizeStart?: () => void;
  onResizeStop?: () => void;

  // 响应式配置
  breakpoints?: { [key: string]: number };
}

export const SidebarLayout = ({
  widgets,
  width = 1,
  collapsible = false,
  defaultCollapsed = false,
  reorderable = true,
  resizable = true,
  storageKey,
  onReorder,
  onHeightChange,
  onLayoutChange,
  className = '',
  isDragging = false,
  isResizing = false,
  isMobile = false,
  onDragStart,
  onDragStop,
  onResizeStart,
  onResizeStop,
  breakpoints = GRID_CONFIG.BREAKPOINTS,
}: SidebarLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // 生成默认布局
  const generateDefaultLayouts = useCallback((): Layouts => {
    let currentY = 0;
    const layouts: Layouts = {
      lg: [],
      md: [],
      sm: [],
    };

    widgets.forEach((widget) => {
      const height = widget.defaultHeight || 6;
      const layoutItem: Layout = {
        i: widget.id,
        x: 0,
        y: currentY,
        w: width,
        h: height,
        minW: width,
        maxW: width,
        minH: widget.minHeight || 2,
        maxH: widget.maxHeight || 10,
        resizeHandles: resizable ? ['s'] : [],
      };

      layouts.lg?.push({ ...layoutItem });
      layouts.md?.push({ ...layoutItem });
      layouts.sm?.push({ ...layoutItem });

      currentY += height;
    });

    return layouts;
  }, [widgets, width, resizable]);

  // 从 localStorage 加载布局
  const loadSavedLayouts = useCallback((): Layouts => {
    if (!storageKey) return generateDefaultLayouts();

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lg) return parsed;
      }
    } catch (error) {
      console.warn(`Failed to load saved sidebar layouts:`, error);
    }

    return generateDefaultLayouts();
  }, [storageKey, generateDefaultLayouts]);

  const [layouts, setLayouts] = useState<Layouts>(loadSavedLayouts);

  // 计算侧边栏的总高度
  // const calculateTotalHeight = useCallback((currentLayouts: Layouts) => {
  //   const currentLayout = currentLayouts.lg || currentLayouts.md || currentLayouts.sm;
  //   if (!currentLayout || currentLayout.length === 0) return 1;

  //   const maxBottom = currentLayout.reduce((max, item) => {
  //     const bottom = item.y + item.h;
  //     return Math.max(max, bottom);
  //   }, 0);

  //   return maxBottom || 1;
  // }, []);

  // 布局变化处理
  const handleLayoutChange = useCallback(
    (layout: Layout[], newLayouts: Layouts) => {
      setLayouts(newLayouts);

      // 保存到 localStorage
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(newLayouts));
        } catch (error) {
          console.error('Failed to save sidebar layouts:', error);
        }
      }

      // 处理重排序
      if (reorderable && onReorder) {
        const sortedIds = layout
          .sort((a, b) => a.y - b.y)
          .map((item) => item.i);
        const reorderedWidgets = sortedIds
          .map((id) => widgets.find((w) => w.id === id))
          .filter(Boolean) as SidebarWidget[];
        onReorder(reorderedWidgets);
      }

      // 处理高度变化
      if (resizable && onHeightChange) {
        layout.forEach((item) => {
          const widget = widgets.find((w) => w.id === item.i);
          if (widget && item.h !== widget.defaultHeight) {
            onHeightChange(item.i, item.h);
          }
        });
      }

      // 调用外部回调
      onLayoutChange?.(newLayouts);
    },
    [
      storageKey,
      reorderable,
      resizable,
      widgets,
      onReorder,
      onHeightChange,
      onLayoutChange,
    ]
  );

  // 重置布局
  useEffect(() => {
    if (!storageKey) return;

    const resetLayout = () => {
      const defaultLayouts = generateDefaultLayouts();
      setLayouts(defaultLayouts);
      localStorage.removeItem(storageKey);
    };

    // 将重置函数挂载到 window 对象
    const windowWithReset = window as Window & {
      __resetSidebarLayout?: { [key: string]: () => void };
    };

    if (!windowWithReset.__resetSidebarLayout) {
      windowWithReset.__resetSidebarLayout = {};
    }

    windowWithReset.__resetSidebarLayout[storageKey] = resetLayout;

    return () => {
      if (windowWithReset.__resetSidebarLayout) {
        delete windowWithReset.__resetSidebarLayout[storageKey];
      }
    };
  }, [storageKey, generateDefaultLayouts]);

  // 折叠状态
  if (collapsible && isCollapsed) {
    return (
      <div
        className={`${className} cursor-pointer`}
        onClick={() => setIsCollapsed(false)}
      >
        <div className="text-center py-2 text-gray-500 hover:text-gray-700">
          展开侧边栏 ({widgets.length})
        </div>
      </div>
    );
  }

  // 网格配置
  const cols = { lg: width, md: width, sm: width };

  return (
    <div className={className}>
      {collapsible && (
        <div
          className="text-right pb-2 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => setIsCollapsed(true)}
        >
          收起
        </div>
      )}
      <div
        className={`transition-all duration-200 ${
          isDragging || isResizing ? 'select-none' : ''
        }`}
      >
        <ResponsiveGridLayout
          className="sidebar-layout"
          layouts={layouts}
          breakpoints={breakpoints}
          cols={cols}
          rowHeight={GRID_CONFIG.ROW_HEIGHT}
          margin={GRID_CONFIG.MARGIN}
          containerPadding={GRID_CONFIG.CONTAINER_PADDING}
          onLayoutChange={handleLayoutChange}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          isDraggable={!isMobile && reorderable}
          isResizable={!isMobile && resizable}
          compactType="vertical"
          preventCollision={false}
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className={`bg-transparent h-full ${widget.className || ''}`}
            >
              {widget.component}
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};
