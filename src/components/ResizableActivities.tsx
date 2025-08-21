import { useCallback, useEffect, useRef, useState } from 'react';

import { ResizableBox } from 'react-resizable';

import { Activities } from './Activities';

interface ResizableActivitiesProps {
  onReset?: () => void;
  gridColumns?: number;
  minColumns?: number;
  maxColumns?: number;
  defaultColumns?: number;
}

export const ResizableActivities = ({
  onReset,
  gridColumns = 12,
  minColumns = 4,
  maxColumns = 8,
  defaultColumns = 8,
}: ResizableActivitiesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentColumns, setCurrentColumns] = useState(defaultColumns);
  const [isDragging, setIsDragging] = useState(false);

  // 从 localStorage 加载保存的列数
  useEffect(() => {
    const saved = localStorage.getItem('activities-grid-columns');
    if (saved) {
      const columns = parseInt(saved, 10);
      if (columns >= minColumns && columns <= maxColumns) {
        setCurrentColumns(columns);
      }
    }
  }, [minColumns, maxColumns]);

  // 更新容器宽度
  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        const parentWidth =
          containerRef.current.parentElement?.offsetWidth || 0;
        setContainerWidth(parentWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  // 计算列宽
  const columnWidth = containerWidth / gridColumns;
  const currentWidth = columnWidth * currentColumns;

  // 栅格吸附函数
  const snapToGrid = useCallback(
    (width: number) => {
      const columns = Math.round(width / columnWidth);
      return Math.max(minColumns, Math.min(maxColumns, columns));
    },
    [columnWidth, minColumns, maxColumns]
  );

  // 处理调整大小
  const handleResize = useCallback(
    (_event: React.SyntheticEvent, { size }: { size: { width: number } }) => {
      const newColumns = snapToGrid(size.width);
      if (newColumns !== currentColumns) {
        setCurrentColumns(newColumns);
      }
    },
    [snapToGrid, currentColumns]
  );

  // 处理调整停止
  const handleResizeStop = useCallback(
    (_event: React.SyntheticEvent, { size }: { size: { width: number } }) => {
      setIsDragging(false);
      const newColumns = snapToGrid(size.width);
      setCurrentColumns(newColumns);
      // 保存到 localStorage
      localStorage.setItem('activities-grid-columns', newColumns.toString());
      // 触发布局重新计算
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    },
    [snapToGrid]
  );

  // 处理调整开始
  const handleResizeStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  // 重置宽度（由父组件调用）
  useEffect(() => {
    const resetWidth = () => {
      setCurrentColumns(defaultColumns);
      localStorage.removeItem('activities-grid-columns');
    };

    const windowWithReset = window as Window & {
      __resetActivitiesWidth?: () => void;
    };
    windowWithReset.__resetActivitiesWidth = resetWidth;

    return () => {
      delete windowWithReset.__resetActivitiesWidth;
    };
  }, [defaultColumns]);

  // 检查是否移动设备
  const isMobile = containerWidth < 1024; // lg 断点

  // 移动设备或容器宽度为0时不使用 ResizableBox
  if (isMobile || containerWidth === 0) {
    return (
      <div ref={containerRef} className="flex-1">
        <Activities onReset={onReset} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ flex: `0 0 ${currentWidth}px` }}
    >
      <ResizableBox
        width={currentWidth}
        height={Infinity}
        minConstraints={[columnWidth * minColumns, Infinity]}
        maxConstraints={[columnWidth * maxColumns, Infinity]}
        resizeHandles={['w']}
        axis="x"
        handle={
          <div
            className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize transition-all ${
              isDragging ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            style={{
              marginLeft: '-2px',
              width: '4px',
            }}
          >
            <div className="h-full flex items-center justify-center">
              <div
                className={`h-12 w-1 rounded-full ${
                  isDragging ? 'bg-blue-600' : 'bg-gray-400'
                }`}
              />
            </div>
          </div>
        }
        onResize={handleResize}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        draggableOpts={{ grid: [columnWidth, 1] }}
      >
        <div className="h-full relative">
          {isDragging && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs z-50">
              {currentColumns}/{gridColumns} 列
            </div>
          )}
          <Activities onReset={onReset} />
        </div>
      </ResizableBox>
    </div>
  );
};
