# DualPaneLayout

双面板布局组件，提供左右两个面板的布局管理，支持宽度调整和高度同步。

## 功能定义

DualPaneLayout 是一个可复用的布局组件，专注于：

- **维护左右两个面板的等高布局** - 核心职责是确保两个面板始终保持相同高度
- **支持宽度比例调整** - 通过拖拽调整左右面板的宽度分配
- **响应式布局** - 在移动端自动切换为垂直堆叠
- **布局持久化** - 记住用户的宽度偏好设置

## API

```typescript
interface DualPaneLayoutProps {
  // 布局配置
  leftPaneWidth?: number; // 左面板宽度（列数），默认 4
  minLeftWidth?: number; // 最小宽度，默认 2
  maxLeftWidth?: number; // 最大宽度，默认 10
  totalColumns?: number; // 总列数，默认 12

  // 内容
  leftContent: ReactNode; // 左面板内容
  rightContent: ReactNode; // 右面板内容

  // 交互控制
  resizable?: boolean; // 是否可调整宽度，默认 true
  resizeHandlePosition?: 'left' | 'right'; // 调整手柄位置，默认 'right'
  onWidthChange?: (width: number) => void; // 宽度变化回调

  // 响应式
  breakpoint?: number; // 切换为垂直布局的断点，默认 1200
  stackedOnTablet?: boolean; // 平板端是否堆叠，默认 true
  stackedOrder?: 'left-first' | 'right-first'; // 堆叠顺序，默认 'left-first'

  // 样式
  className?: string; // 容器类名
  leftPaneClassName?: string; // 左面板类名
  rightPaneClassName?: string; // 右面板类名
  gap?: number; // 面板间距

  // 持久化
  storageKey?: string; // localStorage key

  // 状态
  isDragging?: boolean; // 是否正在拖拽
  isResizing?: boolean; // 是否正在调整大小
  isMobile?: boolean; // 是否为移动端
  onResizeStart?: () => void; // 开始调整大小
  onResizeStop?: () => void; // 结束调整大小
  onDragStart?: () => void; // 开始拖拽
  onDragStop?: () => void; // 结束拖拽

  // 高度管理
  height?: number; // 当前高度（行数）
  defaultHeight?: number; // 默认高度，默认 1
}
```

## 使用示例

### 基础用法

```tsx
import { DualPaneLayout } from './layouts/DualPaneLayout';

function BasicExample() {
  return (
    <DualPaneLayout leftContent={<Sidebar />} rightContent={<MainContent />} />
  );
}
```

### 高级用法 - 高度同步

```tsx
function AdvancedExample() {
  const [height, setHeight] = useState(25);
  const [leftWidth, setLeftWidth] = useState(4);

  // 监听左侧内容高度变化
  const handleLeftContentHeightChange = (newHeight: number) => {
    setHeight(newHeight);
  };

  // 监听宽度变化
  const handleWidthChange = (width: number) => {
    setLeftWidth(width);
    localStorage.setItem('left-pane-width', width.toString());
  };

  return (
    <DualPaneLayout
      leftPaneWidth={leftWidth}
      minLeftWidth={2}
      maxLeftWidth={8}
      totalColumns={12}
      leftContent={
        <SidebarLayout
          widgets={widgets}
          onLayoutChange={(layout) => {
            const maxHeight = calculateMaxHeight(layout);
            handleLeftContentHeightChange(maxHeight);
          }}
        />
      }
      rightContent={<Activities />}
      height={height}
      defaultHeight={25}
      resizable={true}
      resizeHandlePosition="right"
      onWidthChange={handleWidthChange}
      storageKey="workspace-dual-pane"
      breakpoint={1200}
      stackedOnTablet={false}
    />
  );
}
```

### 响应式配置

```tsx
function ResponsiveExample() {
  return (
    <DualPaneLayout
      leftContent={<Sidebar />}
      rightContent={<Content />}
      breakpoint={768} // 768px 以下切换为垂直布局
      stackedOnTablet={true} // 平板端堆叠
      stackedOrder="right-first" // 移动端右侧内容优先
      isMobile={window.innerWidth < 768}
    />
  );
}
```

## 技术实现

### 核心技术

- 基于 `react-grid-layout` 的 `ResponsiveGridLayout`
- 使用 `WidthProvider` 自动处理容器宽度
- 通过 CSS Grid 的列系统实现比例调整

### 布局机制

```typescript
// 主布局配置示例
const mainLayouts: Layouts = {
  lg: [
    {
      i: 'left-pane',
      x: 0,
      y: 0,
      w: leftWidth, // 左面板宽度
      h: actualHeight, // 统一高度
      resizeHandles: resizeHandlePosition === 'left' ? ['e'] : [],
    },
    {
      i: 'right-pane',
      x: leftWidth, // 紧邻左面板
      y: 0,
      w: rightWidth, // 右面板宽度 = totalColumns - leftWidth
      h: actualHeight, // 统一高度
      resizeHandles: resizeHandlePosition === 'right' ? ['w'] : [],
    },
  ],
};
```

### 高度同步策略

组件通过 `height` 属性接收外部计算的高度，确保两个面板保持一致：

1. 外部组件（如 SidebarLayout）计算实际内容高度
2. 通过回调传递高度值
3. DualPaneLayout 应用统一高度到两个面板

### 宽度调整机制

- 支持从左侧或右侧调整（通过 `resizeHandlePosition` 配置）
- 调整时实时显示列数提示
- 自动保存到 localStorage（如果提供了 `storageKey`）

## 样式

### CSS 文件：DualPaneLayout.css

```css
@layer components {
  /* 主面板透明无边框 */
  .dual-pane-layout > .react-grid-item {
    background: transparent;
    border: none;
    box-shadow: none;
  }
}

@layer overrides {
  /* 禁用不必要的动画 */
  .dual-pane-layout > .react-grid-item.react-draggable-dragging {
    transition: none;
  }
}
```

### 样式特点

- 主面板本身无视觉样式，作为纯布局容器
- 不影响嵌套内容的样式
- 使用 CSS layers 管理样式优先级

## 最佳实践

### 1. 高度管理

```tsx
// 推荐：从内容组件获取实际高度
const handleContentHeightChange = useCallback(
  (layout) => {
    const maxBottom = layout.reduce((max, item) => {
      return Math.max(max, item.y + item.h);
    }, 0);
    setHeight(maxBottom || defaultHeight);
  },
  [defaultHeight]
);
```

### 2. 宽度互补计算

```tsx
// 使用总列数减法确保宽度互补
const rightWidth = totalColumns - leftWidth;
```

### 3. 响应式处理

```tsx
// 移动端降级为简单布局
if (isMobile) {
  return (
    <div className="space-y-4">
      {stackedOrder === 'left-first' ? (
        <>
          {leftContent}
          {rightContent}
        </>
      ) : (
        <>
          {rightContent}
          {leftContent}
        </>
      )}
    </div>
  );
}
```

### 4. 自定义调整手柄

```tsx
// 使用自定义调整手柄组件
<DualPaneLayout resizeHandle={<CustomResizeHandle handleAxis="x" />} />
```

## 注意事项

1. **高度控制**：组件不会自动计算高度，需要外部传入
2. **最小/最大宽度**：确保 `minLeftWidth + minRightWidth <= totalColumns`
3. **持久化**：使用版本化的 storage key 避免旧数据冲突
4. **性能**：大量嵌套内容时考虑使用 React.memo 优化

## 常见问题

### Q: 为什么需要手动传入高度？

A: DualPaneLayout 作为布局容器，不应该关心内容的具体实现。高度由内容组件（如 SidebarLayout）计算并传递，保持了组件的单一职责。

### Q: 如何实现更复杂的调整行为？

A: 可以通过 `onWidthChange` 回调实现自定义逻辑，如限制比例、联动其他组件等。

### Q: 移动端为什么不支持调整？

A: 移动端屏幕空间有限，固定布局能提供更好的用户体验。如需移动端调整，可设置 `isMobile={false}`。

## 相关组件

- [SidebarLayout](./SidebarLayout.md) - 常用于左面板的侧边栏布局
- [CustomResizeHandle](../ui/CustomResizeHandle.tsx) - 自定义调整手柄

## 更新日志

### v1.0.0 (2025-08-22)

- 初始版本
- 支持左右面板宽度调整
- 支持高度同步
- 支持响应式布局
- 支持布局持久化
