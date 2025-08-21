# React Grid Layout API 参考

## 组件属性

### 基础属性

#### ReactGridLayout

```javascript
// 基础设置
width: number,                    // 容器宽度（必需，除非使用 WidthProvider）
autoSize: boolean = true,         // 容器高度自动适应内容
cols: number = 12,                // 网格列数
rowHeight: number = 150,          // 行高（像素）

// 布局配置
layout: Array<{
  i?: string,     // 项目唯一标识符
  x: number,      // X 坐标（网格单位）
  y: number,      // Y 坐标（网格单位）
  w: number,      // 宽度（网格单位）
  h: number       // 高度（网格单位）
}> = null,

// 间距和边距
margin: [number, number] = [10, 10],           // 项目间距 [x, y]
containerPadding: [number, number] = margin,   // 容器内边距 [x, y]
```

#### 交互控制

```javascript
// 拖拽和调整大小
isDraggable: boolean = true,      // 是否可拖拽
isResizable: boolean = true,      // 是否可调整大小
isBounded: boolean = false,       // 是否限制在容器内

// 拖拽控制
draggableCancel: string = '',     // 不可拖拽元素选择器
draggableHandle: string = '',     // 拖拽手柄选择器

// 布局行为
compactType: 'vertical' | 'horizontal' | null = 'vertical', // 压缩类型
allowOverlap: boolean = false,    // 是否允许重叠
preventCollision: boolean = false, // 是否防止碰撞
```

#### 性能优化

```javascript
useCSSTransforms: boolean = true,  // 使用 CSS Transform（6倍性能提升）
transformScale: number = 1,        // Transform 缩放系数

// 拖放支持
isDroppable: boolean = false,      // 是否支持外部拖放
droppingItem: {                    // 拖放元素配置
  i: string,
  w: number,
  h: number
}
```

#### 调整大小手柄

```javascript
resizeHandles: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'> = ['se'],
// 's'  - 南（下中）
// 'w'  - 西（左中）
// 'e'  - 东（右中）
// 'n'  - 北（上中）
// 'sw' - 西南（左下）
// 'nw' - 西北（左上）
// 'se' - 东南（右下）
// 'ne' - 东北（右上）

resizeHandle: ReactElement | Function, // 自定义调整大小手柄
```

### 响应式属性

#### ResponsiveGridLayout 独有属性

```javascript
// 断点配置
breakpoints: Object = {
  lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0
},

// 列数配置
cols: Object = {
  lg: 12, md: 10, sm: 6, xs: 4, xxs: 2
},

// 响应式布局
layouts: {
  [breakpoint: string]: Layout[]
},

// 响应式间距和边距（可选）
margin: [number, number] | {
  [breakpoint: string]: [number, number]
},
containerPadding: [number, number] | {
  [breakpoint: string]: [number, number]
}
```

## 回调函数

### 布局变化回调

```javascript
// 基础布局变化
onLayoutChange: (layout: Layout) => void,

// 响应式布局变化
onLayoutChange: (currentLayout: Layout, allLayouts: Object) => void,

// 断点变化
onBreakpointChange: (newBreakpoint: string, newCols: number) => void,

// 容器宽度变化
onWidthChange: (containerWidth: number, margin: [number, number], cols: number, containerPadding: [number, number]) => void
```

### 交互回调

```javascript
type ItemCallback = (
  layout: Layout,
  oldItem: LayoutItem,
  newItem: LayoutItem,
  placeholder: LayoutItem,
  e: MouseEvent,
  element: HTMLElement
) => void;

// 拖拽回调
onDragStart: ItemCallback,  // 拖拽开始
onDrag: ItemCallback,       // 拖拽过程
onDragStop: ItemCallback,   // 拖拽结束

// 调整大小回调
onResizeStart: ItemCallback, // 调整开始
onResize: ItemCallback,      // 调整过程
onResizeStop: ItemCallback,  // 调整结束

// 拖放回调
onDrop: (layout: Layout, item: LayoutItem, e: Event) => void,
onDropDragOver: (e: DragOverEvent) => ?({w?: number, h?: number} | false)
```

## 网格项属性

### LayoutItem 对象结构

```javascript
{
  i: string,                    // 唯一标识符（必需）
  x: number,                    // X 坐标
  y: number,                    // Y 坐标
  w: number,                    // 宽度
  h: number,                    // 高度

  // 尺寸约束
  minW: number = 0,             // 最小宽度
  maxW: number = Infinity,      // 最大宽度
  minH: number = 0,             // 最小高度
  maxH: number = Infinity,      // 最大高度

  // 行为控制
  static: boolean = false,      // 是否静态（不可移动/调整）
  isDraggable: boolean = true,  // 是否可拖拽
  isResizable: boolean = true,  // 是否可调整大小
  isBounded: boolean = false,   // 是否限制在容器内

  // 调整手柄
  resizeHandles: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'> = ['se']
}
```

### data-grid 属性使用

也可以直接在子元素上使用 `data-grid` 属性：

```javascript
<div
  key="item1"
  data-grid={{
    x: 0,
    y: 0,
    w: 2,
    h: 2,
    minW: 1,
    maxW: 4,
    static: true,
  }}
>
  内容
</div>
```

## 特殊属性

### innerRef

```javascript
innerRef: {
  current: null | HTMLDivElement;
} // 直接访问 DOM 元素的引用
```

### 自定义网格项组件

当创建自定义网格项组件时，必须转发以下属性：

```javascript
const CustomGridItemComponent = React.forwardRef(
  (
    {
      style,
      className,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        style={{ ...style }}
        className={className}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </div>
    );
  }
);
```

## 类型定义

```typescript
type Layout = Array<LayoutItem>;

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  resizeHandles?: ResizeHandle[];
  isBounded?: boolean;
}

type ResizeHandle = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

type Breakpoints = { [key: string]: number };
type Cols = { [key: string]: number };
type Layouts = { [key: string]: Layout };
```
