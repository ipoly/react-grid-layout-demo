# React Resizable 组件集成指南

本指南介绍如何在项目中使用 React Resizable，包括独立使用和与 React Grid Layout 的集成方式。

## 独立使用 React Resizable

### 基础可调整大小组件

```tsx
import { useState } from 'react';

import { Resizable } from 'react-resizable';

import './resizable.css';

// 导入必要样式

interface ResizableBoxProps {
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

export function ResizableBox({
  children,
  initialWidth = 200,
  initialHeight = 200,
  minWidth = 100,
  maxWidth = 500,
  minHeight = 100,
  maxHeight = 400,
}: ResizableBoxProps) {
  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });

  return (
    <Resizable
      width={size.width}
      height={size.height}
      minConstraints={[minWidth, minHeight]}
      maxConstraints={[maxWidth, maxHeight]}
      onResize={(e, { size: newSize }) => setSize(newSize)}
      resizeHandles={['se']} // 右下角调整
    >
      <div
        style={{
          width: size.width,
          height: size.height,
          border: '1px solid #ddd',
          padding: '10px',
          backgroundColor: 'white',
        }}
      >
        {children}
      </div>
    </Resizable>
  );
}
```

### 多方向调整组件

```tsx
import { useCallback, useState } from 'react';

import { Resizable } from 'react-resizable';

export function MultiDirectionResizable({
  children,
}: {
  children: React.ReactNode;
}) {
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleResize = useCallback((e: any, { size: newSize }: any) => {
    setSize(newSize);
  }, []);

  const handleResizeStop = useCallback(() => {
    setIsResizing(false);
  }, []);

  return (
    <Resizable
      width={size.width}
      height={size.height}
      onResizeStart={handleResizeStart}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
      minConstraints={[150, 100]}
      maxConstraints={[600, 400]}
    >
      <div
        className={`
          transition-shadow duration-200
          ${isResizing ? 'shadow-2xl ring-2 ring-blue-500' : 'shadow-md'}
        `}
        style={{
          width: size.width,
          height: size.height,
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        {children}
        <div className="absolute top-2 right-2 text-xs text-gray-500">
          {size.width} × {size.height}
        </div>
      </div>
    </Resizable>
  );
}
```

## 与 React Grid Layout 集成

### 网格中的可调整组件

```tsx
import { useState } from 'react';

import GridLayout, { Layout } from 'react-grid-layout';
import { ResizableBox } from 'react-resizable';

interface GridItemWithResizableProps {
  children: React.ReactNode;
  itemKey: string;
}

function GridItemWithResizable({
  children,
  itemKey,
}: GridItemWithResizableProps) {
  const [contentSize, setContentSize] = useState({ width: 180, height: 120 });

  return (
    <div key={itemKey} className="grid-item-container">
      {/* 网格布局处理外层调整 */}
      <div className="p-4 bg-white rounded-lg shadow-md h-full">
        {/* 内容区域可独立调整 */}
        <ResizableBox
          width={contentSize.width}
          height={contentSize.height}
          minConstraints={[100, 80]}
          maxConstraints={[300, 200]}
          onResize={(e, { size }) => setContentSize(size)}
          resizeHandles={['se']}
        >
          <div
            style={{
              width: contentSize.width,
              height: contentSize.height,
              border: '2px dashed #ccc',
              padding: '8px',
              overflow: 'hidden',
            }}
          >
            {children}
          </div>
        </ResizableBox>
      </div>
    </div>
  );
}

// 使用示例
export function GridWithResizableContent() {
  const [layout, setLayout] = useState<Layout[]>([
    { i: 'chart1', x: 0, y: 0, w: 4, h: 3 },
    { i: 'chart2', x: 4, y: 0, w: 4, h: 3 },
    { i: 'table1', x: 0, y: 3, w: 8, h: 4 },
  ]);

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={60}
      width={1200}
      onLayoutChange={setLayout}
    >
      <GridItemWithResizable itemKey="chart1">
        <div>图表组件内容可调整大小</div>
      </GridItemWithResizable>

      <GridItemWithResizable itemKey="chart2">
        <div>另一个可调整的图表</div>
      </GridItemWithResizable>

      <GridItemWithResizable itemKey="table1">
        <div>表格组件也可以调整内容大小</div>
      </GridItemWithResizable>
    </GridLayout>
  );
}
```

### 自定义调整手柄样式

```tsx
import { useState } from 'react';

import { Resizable } from 'react-resizable';

// 自定义调整手柄组件
function CustomResizeHandle({ handleAxis }: { handleAxis: string }) {
  const getHandleStyles = (axis: string) => {
    const baseStyles =
      'absolute bg-blue-500 opacity-0 hover:opacity-100 transition-opacity duration-200';

    switch (axis) {
      case 'se':
        return `${baseStyles} bottom-0 right-0 w-3 h-3 cursor-se-resize`;
      case 's':
        return `${baseStyles} bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-2 cursor-s-resize`;
      case 'e':
        return `${baseStyles} right-0 top-1/2 transform -translate-y-1/2 w-2 h-6 cursor-e-resize`;
      default:
        return baseStyles;
    }
  };

  return (
    <div className={getHandleStyles(handleAxis)}>
      {handleAxis === 'se' && (
        <div className="w-full h-full flex items-end justify-end">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        </div>
      )}
    </div>
  );
}

export function ResizableWithCustomHandles({
  children,
}: {
  children: React.ReactNode;
}) {
  const [size, setSize] = useState({ width: 250, height: 180 });

  return (
    <Resizable
      width={size.width}
      height={size.height}
      onResize={(e, { size: newSize }) => setSize(newSize)}
      resizeHandles={['se', 's', 'e']}
      handle={(axis, ref) => (
        <div
          ref={ref}
          className={`react-resizable-handle react-resizable-handle-${axis}`}
        >
          <CustomResizeHandle handleAxis={axis} />
        </div>
      )}
    >
      <div
        className="relative bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-lg p-4 overflow-hidden"
        style={{
          width: size.width,
          height: size.height,
        }}
      >
        {children}
        <div className="absolute top-2 right-2 text-xs text-blue-600 font-mono">
          {size.width}×{size.height}
        </div>
      </div>
    </Resizable>
  );
}
```

## 高级功能实现

### 锁定宽高比调整

```tsx
import { useCallback, useState } from 'react';

import { Resizable } from 'react-resizable';

interface AspectRatioResizableProps {
  children: React.ReactNode;
  aspectRatio?: number; // 宽高比，如 16/9
  initialSize?: { width: number; height: number };
}

export function AspectRatioResizable({
  children,
  aspectRatio = 16 / 9,
  initialSize = { width: 320, height: 180 },
}: AspectRatioResizableProps) {
  const [size, setSize] = useState(initialSize);

  const handleResize = useCallback(
    (e: any, { size: newSize }: any) => {
      // 根据宽高比调整尺寸
      const { width, height } = newSize;
      const targetRatio = aspectRatio;

      let adjustedWidth = width;
      let adjustedHeight = height;

      if (width / height > targetRatio) {
        // 宽度过大，以高度为准
        adjustedWidth = height * targetRatio;
      } else {
        // 高度过大，以宽度为准
        adjustedHeight = width / targetRatio;
      }

      setSize({ width: adjustedWidth, height: adjustedHeight });
    },
    [aspectRatio]
  );

  return (
    <Resizable
      width={size.width}
      height={size.height}
      onResize={handleResize}
      lockAspectRatio={true}
      minConstraints={[160, 90]} // 最小 16:9
      maxConstraints={[640, 360]} // 最大 16:9
    >
      <div
        className="bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center"
        style={{
          width: size.width,
          height: size.height,
        }}
      >
        {children}
        <div className="absolute bottom-2 left-2 text-xs text-gray-600 bg-white px-2 py-1 rounded">
          {Math.round(size.width)}×{Math.round(size.height)} (
          {aspectRatio.toFixed(2)}:1)
        </div>
      </div>
    </Resizable>
  );
}
```

### 带网格对齐的调整

```tsx
import { useCallback, useState } from 'react';

import { Resizable } from 'react-resizable';

interface GridAlignedResizableProps {
  children: React.ReactNode;
  gridSize?: number; // 网格大小
}

export function GridAlignedResizable({
  children,
  gridSize = 20,
}: GridAlignedResizableProps) {
  const [size, setSize] = useState({ width: 200, height: 160 });

  // 对齐到网格
  const snapToGrid = useCallback(
    (value: number) => {
      return Math.round(value / gridSize) * gridSize;
    },
    [gridSize]
  );

  const handleResize = useCallback(
    (e: any, { size: newSize }: any) => {
      setSize({
        width: snapToGrid(newSize.width),
        height: snapToGrid(newSize.height),
      });
    },
    [snapToGrid]
  );

  return (
    <div className="relative">
      {/* 网格背景 */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      <Resizable
        width={size.width}
        height={size.height}
        onResize={handleResize}
        minConstraints={[gridSize * 4, gridSize * 3]} // 最小 4x3 网格
        maxConstraints={[gridSize * 20, gridSize * 15]} // 最大 20x15 网格
      >
        <div
          className="bg-white border-2 border-blue-400 rounded-lg shadow-lg flex items-center justify-center relative"
          style={{
            width: size.width,
            height: size.height,
          }}
        >
          {children}
          <div className="absolute top-2 left-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {size.width / gridSize}×{size.height / gridSize} 网格
          </div>
        </div>
      </Resizable>
    </div>
  );
}
```

## 样式集成

### Tailwind CSS 样式

```css
/* 全局调整手柄样式 */
.react-resizable-handle {
  @apply absolute;
  background-color: transparent;
}

.react-resizable-handle-se {
  @apply bottom-0 right-0 w-3 h-3 cursor-se-resize;
  background-image: linear-gradient(
    -45deg,
    transparent 40%,
    theme('colors.blue.500') 40%,
    theme('colors.blue.500') 60%,
    transparent 60%
  );
}

.react-resizable-handle-s {
  @apply bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-2 cursor-s-resize;
  background-color: theme('colors.blue.500');
  opacity: 0;
  transition: opacity 0.2s ease;
}

.react-resizable:hover .react-resizable-handle-s {
  @apply opacity-100;
}

.react-resizable-handle-e {
  @apply right-0 top-1/2 transform -translate-y-1/2 w-2 h-6 cursor-e-resize;
  background-color: theme('colors.blue.500');
  opacity: 0;
  transition: opacity 0.2s ease;
}

.react-resizable:hover .react-resizable-handle-e {
  @apply opacity-100;
}
```

### 响应式调整

```tsx
import { useEffect, useState } from 'react';

import { Resizable } from 'react-resizable';

export function ResponsiveResizable({
  children,
}: {
  children: React.ReactNode;
}) {
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 移动端禁用调整功能
  if (isMobile) {
    return (
      <div className="w-full bg-white border border-gray-300 rounded-lg p-4">
        {children}
      </div>
    );
  }

  return (
    <Resizable
      width={size.width}
      height={size.height}
      onResize={(e, { size: newSize }) => setSize(newSize)}
      minConstraints={[200, 120]}
      maxConstraints={[600, 400]}
    >
      <div
        className="bg-white border border-gray-300 rounded-lg p-4"
        style={{
          width: size.width,
          height: size.height,
        }}
      >
        {children}
      </div>
    </Resizable>
  );
}
```

## 性能优化建议

### 1. 使用 useCallback 缓存事件处理函数

```tsx
const handleResize = useCallback((e: any, { size }: any) => {
  setSize(size);
}, []);

const handleResizeStop = useCallback(
  (e: any, { size }: any) => {
    // 调整结束后的操作
    onSizeChange?.(size);
  },
  [onSizeChange]
);
```

### 2. 防抖更新

```tsx
import { useMemo } from 'react';

import { debounce } from 'lodash-es';

const debouncedResize = useMemo(
  () =>
    debounce((size: { width: number; height: number }) => {
      onSizeChange?.(size);
    }, 300),
  [onSizeChange]
);
```

### 3. 组件记忆化

```tsx
export const MemoizedResizable = React.memo(ResizableBox);
```

## 最佳实践总结

1. **样式导入**: 始终导入必要的 CSS 样式文件
2. **约束设置**: 合理设置最小/最大尺寸约束
3. **事件优化**: 使用 useCallback 优化事件处理函数
4. **响应式考虑**: 在移动端考虑禁用或调整调整功能
5. **性能优化**: 对于复杂组件使用防抖和记忆化
6. **可访问性**: 确保调整手柄有适当的 aria 标签
7. **网格对齐**: 在需要精确对齐时使用网格捕捉功能

通过合理使用 React Resizable，可以为用户提供灵活的界面调整能力，提升用户体验。
