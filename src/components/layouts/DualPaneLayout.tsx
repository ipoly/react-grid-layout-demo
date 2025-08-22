import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';

import { GRID_CONFIG } from '../../config/grid';
import { CustomResizeHandle } from '../ui/CustomResizeHandle';
import './DualPaneLayout.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface DualPaneLayoutProps {
  // 布局配置
  leftPaneWidth?: number; // 左面板宽度（列数）
  minLeftWidth?: number; // 最小宽度
  maxLeftWidth?: number; // 最大宽度
  totalColumns?: number; // 总列数（默认12）

  // 内容
  leftContent: ReactNode; // 左面板内容
  rightContent: ReactNode; // 右面板内容

  // 交互控制
  resizable?: boolean; // 是否可调整
  resizeHandlePosition?: 'left' | 'right'; // 调整手柄位置
  onWidthChange?: (width: number) => void; // 宽度变化回调

  // 响应式
  breakpoint?: number; // 切换为垂直布局的断点
  stackedOnTablet?: boolean; // 平板端是否堆叠
  stackedOrder?: 'left-first' | 'right-first'; // 堆叠顺序

  // 样式
  className?: string;
  leftPaneClassName?: string;
  rightPaneClassName?: string;
  gap?: number; // 面板间距

  // 持久化
  storageKey?: string; // localStorage key

  // 外部传入的状态
  isDragging?: boolean;
  isResizing?: boolean;
  isMobile?: boolean;
  onResizeStart?: () => void;
  onResizeStop?: () => void;
  onDragStart?: () => void;
  onDragStop?: () => void;

  // 高度管理
  height?: number; // 当前高度（行数）
  defaultHeight?: number; // 默认高度（当 height 未定义时使用）
}

export const DualPaneLayout = ({
  leftPaneWidth: initialLeftWidth = 4,
  minLeftWidth = 2,
  maxLeftWidth = 10,
  totalColumns = 12,
  leftContent,
  rightContent,
  resizable = true,
  resizeHandlePosition = 'right',
  onWidthChange,
  breakpoint = 1200,
  stackedOnTablet = true,
  stackedOrder = 'left-first',
  className = '',
  leftPaneClassName = '',
  rightPaneClassName = '',
  storageKey,
  isDragging = false,
  isResizing = false,
  isMobile = false,
  onResizeStart,
  onResizeStop,
  onDragStart,
  onDragStop,
  height,
  defaultHeight = 1,
}: DualPaneLayoutProps) => {
  // 从 localStorage 加载宽度
  const getInitialWidth = () => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const width = parseInt(saved, 10);
        if (width >= minLeftWidth && width <= maxLeftWidth) {
          return width;
        }
      }
    }
    return initialLeftWidth;
  };

  const [leftWidth, setLeftWidth] = useState(getInitialWidth);
  const [isResizingPane, setIsResizingPane] = useState(false);

  // 计算右面板宽度
  const rightWidth = totalColumns - leftWidth;

  // 使用实际高度：优先使用 height，否则使用 defaultHeight
  const actualHeight = height ?? defaultHeight;

  // 检测是否需要堆叠布局
  const [isStacked, setIsStacked] = useState(false);

  useEffect(() => {
    const checkStacked = () => {
      setIsStacked(stackedOnTablet && window.innerWidth < breakpoint);
    };

    checkStacked();
    window.addEventListener('resize', checkStacked);
    return () => window.removeEventListener('resize', checkStacked);
  }, [breakpoint, stackedOnTablet]);

  // 主布局配置 - 包含左右两个面板
  const mainLayouts: Layouts = useMemo(
    () => ({
      lg: [
        {
          i: 'left-pane',
          x: 0,
          y: 0,
          w: leftWidth,
          h: actualHeight,
          static: !resizable || resizeHandlePosition !== 'left',
          isDraggable: false,
          isResizable: resizable && resizeHandlePosition === 'left',
          resizeHandles: resizeHandlePosition === 'left' ? ['e'] : [],
          minW: minLeftWidth,
          maxW: maxLeftWidth,
        },
        {
          i: 'right-pane',
          x: leftWidth,
          y: 0,
          w: rightWidth,
          h: actualHeight,
          isDraggable: false,
          isResizable: resizable && resizeHandlePosition === 'right',
          resizeHandles: resizeHandlePosition === 'right' ? ['w'] : [],
          minW: totalColumns - maxLeftWidth,
          maxW: totalColumns - minLeftWidth,
        },
      ],
      md: [
        {
          i: 'left-pane',
          x: 0,
          y: 0,
          w: leftWidth,
          h: actualHeight,
          static: true,
        },
        {
          i: 'right-pane',
          x: leftWidth,
          y: 0,
          w: rightWidth,
          h: actualHeight,
          static: true,
        },
      ],
      sm: [
        {
          i: 'left-pane',
          x: 0,
          y: 0,
          w: leftWidth,
          h: actualHeight,
          static: true,
        },
        {
          i: 'right-pane',
          x: leftWidth,
          y: 0,
          w: rightWidth,
          h: actualHeight,
          static: true,
        },
      ],
      xs: [
        {
          i: 'left-pane',
          x: 0,
          y: 0,
          w: totalColumns,
          h: actualHeight,
          static: true,
        },
        {
          i: 'right-pane',
          x: 0,
          y: actualHeight,
          w: totalColumns,
          h: actualHeight,
          static: true,
        },
      ],
      xxs: [
        {
          i: 'left-pane',
          x: 0,
          y: 0,
          w: totalColumns,
          h: actualHeight,
          static: true,
        },
        {
          i: 'right-pane',
          x: 0,
          y: actualHeight,
          w: totalColumns,
          h: actualHeight,
          static: true,
        },
      ],
    }),
    [
      leftWidth,
      rightWidth,
      actualHeight,
      resizable,
      resizeHandlePosition,
      minLeftWidth,
      maxLeftWidth,
      totalColumns,
    ]
  );

  // 布局变化处理
  const handleLayoutChange = useCallback(
    (layout: Layout[], _layouts: Layouts) => {
      const paneItem =
        resizeHandlePosition === 'right'
          ? layout.find((item) => item.i === 'right-pane')
          : layout.find((item) => item.i === 'left-pane');

      if (paneItem) {
        const newLeftWidth =
          resizeHandlePosition === 'right'
            ? totalColumns - paneItem.w
            : paneItem.w;

        if (newLeftWidth !== leftWidth) {
          setLeftWidth(newLeftWidth);

          // 保存到 localStorage
          if (storageKey) {
            localStorage.setItem(storageKey, newLeftWidth.toString());
          }

          // 调用外部回调
          onWidthChange?.(newLeftWidth);
        }
      }
    },
    [leftWidth, resizeHandlePosition, totalColumns, storageKey, onWidthChange]
  );

  // 处理 resize 开始
  const handleResizeStart = useCallback(() => {
    setIsResizingPane(true);
    onResizeStart?.();
  }, [onResizeStart]);

  // 处理 resize 结束
  const handleResizeStop = useCallback(() => {
    setIsResizingPane(false);
    onResizeStop?.();
  }, [onResizeStop]);

  // 重置布局
  useEffect(() => {
    if (!storageKey) return;

    const resetLayout = () => {
      setLeftWidth(initialLeftWidth);
      localStorage.removeItem(storageKey);
    };

    // 将重置函数挂载到 window 对象
    const windowWithReset = window as Window & {
      __resetDualPaneLayout?: { [key: string]: () => void };
    };

    if (!windowWithReset.__resetDualPaneLayout) {
      windowWithReset.__resetDualPaneLayout = {};
    }

    windowWithReset.__resetDualPaneLayout[storageKey] = resetLayout;

    return () => {
      if (windowWithReset.__resetDualPaneLayout) {
        delete windowWithReset.__resetDualPaneLayout[storageKey];
      }
    };
  }, [storageKey, initialLeftWidth]);

  // 垂直堆叠布局（平板和移动端）
  if (isStacked || isMobile) {
    const leftPanel = <div className={leftPaneClassName}>{leftContent}</div>;
    const rightPanel = <div className={rightPaneClassName}>{rightContent}</div>;

    return (
      <div className={`space-y-4 ${className}`}>
        {stackedOrder === 'left-first' ? (
          <>
            {leftPanel}
            {rightPanel}
          </>
        ) : (
          <>
            {rightPanel}
            {leftPanel}
          </>
        )}
      </div>
    );
  }

  // 水平双面板布局
  return (
    <div className={className}>
      <div
        className={`transition-all duration-200 ${
          isDragging || isResizing ? 'select-none' : ''
        }`}
      >
        <ResponsiveGridLayout
          className="dual-pane-layout"
          layouts={mainLayouts}
          breakpoints={GRID_CONFIG.BREAKPOINTS}
          cols={{
            lg: totalColumns,
            md: totalColumns,
            sm: totalColumns,
            xs: totalColumns,
            xxs: totalColumns,
          }}
          rowHeight={GRID_CONFIG.ROW_HEIGHT}
          margin={GRID_CONFIG.MARGIN}
          containerPadding={GRID_CONFIG.CONTAINER_PADDING}
          onLayoutChange={handleLayoutChange}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          isDraggable={false}
          isResizable={!isMobile && resizable}
          compactType={null}
          allowOverlap={true}
          preventCollision={false}
          autoSize={false}
          resizeHandle={<CustomResizeHandle handleAxis="x" />}
        >
          {/* 左面板 */}
          <div
            key="left-pane"
            className={`bg-transparent h-full ${leftPaneClassName}`}
          >
            {leftContent}
          </div>

          {/* 右面板 */}
          <div
            key="right-pane"
            className={`bg-transparent relative h-full ${rightPaneClassName}`}
          >
            {isResizingPane && resizeHandlePosition === 'right' && (
              <div className="absolute -top-8 left-4 bg-gray-900 text-white px-2 py-1 rounded text-xs z-50">
                {rightWidth}/{totalColumns} 列
              </div>
            )}
            {rightContent}
          </div>
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};
