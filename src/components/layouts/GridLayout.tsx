import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';

import { GRID_CONFIG } from '../../config/grid';

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface GridItemConfig {
  id: string;
  component: ReactNode;
  defaultLayout?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  minSize?: { w: number; h: number };
  maxSize?: { w: number; h: number };
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  resizeHandles?: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>;
}

export interface GridLayoutProps {
  // 布局配置
  items: GridItemConfig[];
  layouts?: Layouts;
  breakpoints?: {
    desktop?: number;
    tablet?: number;
  };
  cols?: {
    desktop?: number;
    tablet?: number;
  };

  // 功能开关
  draggable?: boolean;
  resizable?: boolean;
  compactType?: 'vertical' | 'horizontal' | null;

  // 持久化
  storageKey?: string;
  autoSave?: boolean;

  // 回调
  onLayoutChange?: (layouts: Layouts) => void;
  onDragStart?: () => void;
  onDragStop?: () => void;
  onResizeStart?: () => void;
  onResizeStop?: () => void;

  // 样式
  className?: string;
  rowHeight?: number;
  margin?: [number, number];
  containerPadding?: [number, number];
  maxRows?: number;
  isMobile?: boolean;
  resizeHandle?: ReactNode;
}

export const GridLayout = ({
  items,
  layouts: initialLayouts,
  breakpoints = {
    desktop: GRID_CONFIG.BREAKPOINTS.lg,
    tablet: GRID_CONFIG.BREAKPOINTS.sm,
  },
  cols = {
    desktop: 12,
    tablet: 8,
  },
  draggable = true,
  resizable = true,
  compactType = 'vertical',
  storageKey,
  autoSave = true,
  onLayoutChange,
  onDragStart,
  onDragStop,
  onResizeStart,
  onResizeStop,
  className = '',
  rowHeight = GRID_CONFIG.ROW_HEIGHT,
  margin = GRID_CONFIG.MARGIN,
  containerPadding = GRID_CONFIG.CONTAINER_PADDING,
  maxRows,
  isMobile = false,
  resizeHandle,
}: GridLayoutProps) => {
  // 生成默认布局
  const generateDefaultLayouts = useCallback((): Layouts => {
    const defaultLayouts: Layouts = {
      lg: [],
      md: [],
      sm: [],
      xs: [],
      xxs: [],
    };

    items.forEach((item) => {
      const baseLayout: Layout = {
        i: item.id,
        x: item.defaultLayout?.x ?? 0,
        y: item.defaultLayout?.y ?? 0,
        w: item.defaultLayout?.w ?? 1,
        h: item.defaultLayout?.h ?? 1,
        minW: item.minSize?.w,
        maxW: item.maxSize?.w,
        minH: item.minSize?.h,
        maxH: item.maxSize?.h,
        static: item.static,
        isDraggable: item.isDraggable,
        isResizable: item.isResizable,
        resizeHandles: item.resizeHandles,
      };

      // 为每个断点生成布局
      defaultLayouts.lg?.push({ ...baseLayout });
      defaultLayouts.md?.push({ ...baseLayout });
      defaultLayouts.sm?.push({ ...baseLayout });
      defaultLayouts.xs?.push({ ...baseLayout });
      defaultLayouts.xxs?.push({ ...baseLayout });
    });

    return defaultLayouts;
  }, [items]);

  // 从 localStorage 加载布局
  const loadSavedLayouts = useCallback((): Layouts => {
    if (!storageKey) return initialLayouts || generateDefaultLayouts();

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lg) return parsed;
      }
    } catch (error) {
      console.warn(`Failed to load saved layouts for ${storageKey}:`, error);
    }

    return initialLayouts || generateDefaultLayouts();
  }, [storageKey, initialLayouts, generateDefaultLayouts]);

  const [layouts, setLayouts] = useState<Layouts>(loadSavedLayouts);

  // 布局变化处理
  const handleLayoutChange = useCallback(
    (_layout: Layout[], newLayouts: Layouts) => {
      setLayouts(newLayouts);

      // 自动保存到 localStorage
      if (autoSave && storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(newLayouts));
        } catch (error) {
          console.error(`Failed to save layouts for ${storageKey}:`, error);
        }
      }

      // 调用外部回调
      onLayoutChange?.(newLayouts);
    },
    [autoSave, storageKey, onLayoutChange]
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
      __resetLayouts?: { [key: string]: () => void };
    };

    if (!windowWithReset.__resetLayouts) {
      windowWithReset.__resetLayouts = {};
    }

    windowWithReset.__resetLayouts[storageKey] = resetLayout;

    return () => {
      if (windowWithReset.__resetLayouts) {
        delete windowWithReset.__resetLayouts[storageKey];
      }
    };
  }, [storageKey, generateDefaultLayouts]);

  // 响应式断点配置（映射到 react-grid-layout 的标准断点）
  const gridBreakpoints = {
    lg: breakpoints.desktop ?? 1200,
    md: 996,
    sm: breakpoints.tablet ?? 768,
    xs: 480,
    xxs: 0,
  };

  const gridCols = {
    lg: cols.desktop ?? 12,
    md: 10,
    sm: cols.tablet ?? 8,
    xs: 6,
    xxs: 4,
  };

  return (
    <ResponsiveGridLayout
      className={`layout ${className}`}
      layouts={layouts}
      breakpoints={gridBreakpoints}
      cols={gridCols}
      rowHeight={rowHeight}
      margin={margin}
      containerPadding={containerPadding}
      onLayoutChange={handleLayoutChange}
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
      isDraggable={!isMobile && draggable}
      isResizable={!isMobile && resizable}
      compactType={compactType}
      maxRows={maxRows}
      useCSSTransforms={true}
      resizeHandle={resizeHandle}
    >
      {items.map((item) => (
        <div key={item.id} className={`h-full ${item.className || ''}`}>
          {item.component}
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};
