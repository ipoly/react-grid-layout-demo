import React from 'react';

import './CustomResizeHandle.css';

interface CustomResizeHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  handleAxis: 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';
}

/**
 * 自定义调整大小手柄组件
 * 为主面板提供整条垂直线样式的手柄
 */
export const CustomResizeHandle = React.forwardRef<
  HTMLDivElement,
  CustomResizeHandleProps
>(({ handleAxis, ...props }, ref) => {
  // 只为西边（左边）手柄提供自定义样式
  if (handleAxis === 'w') {
    return (
      <div ref={ref} className="custom-resize-handle-west" {...props}>
        {/* 垂直分割线 */}
        <div className="handle-line" />

        {/* 拖动指示器（悬停时显示） */}
        <div className="handle-indicator" />
      </div>
    );
  }

  // 其他方向的手柄使用默认样式
  return (
    <div
      ref={ref}
      className={`react-resizable-handle react-resizable-handle-${handleAxis}`}
      {...props}
    />
  );
});

CustomResizeHandle.displayName = 'CustomResizeHandle';
