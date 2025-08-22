# SidebarLayout

侧边栏布局组件，管理垂直排列的小部件列表，支持拖拽排序和高度调整。

## 功能定义

SidebarLayout 是一个专注于垂直单列布局的组件，提供：

- **垂直单列排列** - 所有小部件在单列中垂直堆叠
- **拖拽排序** - 支持通过拖拽改变小部件顺序
- **高度调整** - 每个小部件可独立调整高度
- **自动压缩** - 自动消除小部件之间的空隙
- **布局持久化** - 记住小部件的位置和大小

## API

### SidebarWidget 接口

```typescript
interface SidebarWidget {
  // 基础配置
  id: string; // 唯一标识符
  title?: string; // 标题（可选）
  component: ReactNode; // 小部件内容

  // 布局配置
  defaultHeight?: number; // 默认高度（行数），默认 6
  minHeight?: number; // 最小高度，默认 2
  maxHeight?: number; // 最大高度，默认 10

  // 功能配置
  collapsible?: boolean; // 是否可折叠
  defaultCollapsed?: boolean; // 默认折叠状态
  removable?: boolean; // 是否可移除

  // 样式
  className?: string; // 小部件容器类名
  headerClassName?: string; // 标题区域类名
}
```

### SidebarLayoutProps 接口

```typescript
interface SidebarLayoutProps {
  // 核心配置
  widgets: SidebarWidget[]; // 小部件列表
  width?: number; // 宽度（列数），默认 1

  // 功能控制
  collapsible?: boolean; // 整体是否可折叠，默认 false
  defaultCollapsed?: boolean; // 默认折叠状态，默认 false
  reorderable?: boolean; // 是否可拖拽排序，默认 false
  resizable?: boolean; // 是否可调整高度，默认 true

  // 持久化
  storageKey?: string; // localStorage 保存键名

  // 回调函数
  onReorder?: (widgets: SidebarWidget[]) => void; // 排序变化
  onHeightChange?: (id: string, height: number) => void; // 高度变化
  onLayoutChange?: (layout: Layout[]) => void; // 布局变化

  // 样式
  className?: string; // 容器类名
  gap?: number; // 小部件间距

  // 状态管理
  isDragging?: boolean; // 是否正在拖拽
  isResizing?: boolean; // 是否正在调整大小
  isMobile?: boolean; // 是否为移动端
  onDragStart?: () => void; // 开始拖拽
  onDragStop?: () => void; // 结束拖拽
  onResizeStart?: () => void; // 开始调整大小
  onResizeStop?: () => void; // 结束调整大小
}
```

## 使用示例

### 基础用法

```tsx
import { SidebarLayout, SidebarWidget } from './layouts/SidebarLayout';

function BasicSidebar() {
  const widgets: SidebarWidget[] = [
    {
      id: 'widget-1',
      component: <Widget1 />,
      defaultHeight: 5,
    },
    {
      id: 'widget-2',
      component: <Widget2 />,
      defaultHeight: 8,
    },
  ];

  return <SidebarLayout widgets={widgets} />;
}
```

### 完整功能示例

```tsx
function AdvancedSidebar() {
  const [sidebarHeight, setSidebarHeight] = useState(25);

  const widgets: SidebarWidget[] = useMemo(
    () => [
      {
        id: 'recent-plans',
        component: <RecentPlans />,
        defaultHeight: 7,
        minHeight: 2,
        maxHeight: 10,
        className: 'recent-plans-widget',
      },
      {
        id: 'tasks',
        component: <Tasks />,
        defaultHeight: 6,
        minHeight: 2,
        maxHeight: 8,
      },
      {
        id: 'events',
        component: <Events />,
        defaultHeight: 6,
        minHeight: 2,
        maxHeight: 8,
      },
      {
        id: 'workflows',
        component: <Workflows />,
        defaultHeight: 6,
        minHeight: 2,
        maxHeight: 8,
      },
    ],
    []
  );

  // 监听布局变化，计算总高度
  const handleLayoutChange = useCallback((layout: Layout[]) => {
    const maxBottom = layout.reduce((max, item) => {
      const bottom = item.y + item.h;
      return Math.max(max, bottom);
    }, 0);

    setSidebarHeight(maxBottom || 1);
    console.log('Sidebar height updated:', maxBottom);
  }, []);

  // 监听排序变化
  const handleReorder = useCallback((reorderedWidgets: SidebarWidget[]) => {
    console.log(
      'Widgets reordered:',
      reorderedWidgets.map((w) => w.id)
    );
  }, []);

  // 监听高度变化
  const handleHeightChange = useCallback((id: string, height: number) => {
    console.log(`Widget ${id} height changed to ${height}`);
  }, []);

  return (
    <SidebarLayout
      widgets={widgets}
      width={1}
      reorderable={true}
      resizable={true}
      onLayoutChange={handleLayoutChange}
      onReorder={handleReorder}
      onHeightChange={handleHeightChange}
      storageKey="sidebar-layout"
      className="sidebar-container"
    />
  );
}
```

### 移动端配置

```tsx
function MobileSidebar() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <SidebarLayout
      widgets={widgets}
      collapsible={true}
      defaultCollapsed={isMobile}
      reorderable={!isMobile} // 移动端禁用拖拽
      resizable={!isMobile} // 移动端禁用调整
      isMobile={isMobile}
      className="mobile-sidebar"
    />
  );
}
```

## 技术实现

### 为什么使用 GridLayout 而非 ResponsiveGridLayout

**问题背景**：
最初使用 `ResponsiveGridLayout` 时，发现当容器宽度变化（如调整相邻面板宽度）时，会触发断点切换，导致加载不同的布局配置，造成小部件意外重排。

**解决方案**：
改用 `GridLayout` + `WidthProvider` 的组合：

- `GridLayout`：提供基础的网格布局功能，不包含响应式断点
- `WidthProvider`：自动处理容器宽度变化，但不触发布局切换

```tsx
import GridLayout, { WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(GridLayout);
```

### 布局生成机制

```typescript
const generateDefaultLayout = useCallback((): Layout[] => {
  let currentY = 0;
  const layout: Layout[] = [];

  widgets.forEach((widget) => {
    const height = widget.defaultHeight || 6;
    layout.push({
      i: widget.id,
      x: 0, // 始终在第一列
      y: currentY, // 垂直累加
      w: width, // 占满宽度
      h: height, // 使用指定高度
      minW: width, // 宽度不可调整
      maxW: width,
      minH: widget.minHeight || 2,
      maxH: widget.maxHeight || 10,
      resizeHandles: resizable ? ['s'] : [], // 只允许底部调整
    });
    currentY += height;
  });

  return layout;
}, [widgets, width, resizable]);
```

### 布局持久化

```typescript
// 保存布局（新格式：单一数组）
localStorage.setItem(storageKey, JSON.stringify(layout));

// 加载布局（兼容旧格式）
const loadSavedLayout = () => {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    const parsed = JSON.parse(saved);

    // 新格式：直接是数组
    if (Array.isArray(parsed)) {
      return parsed;
    }

    // 旧格式：包含断点的对象
    if (parsed.lg) {
      return parsed.lg; // 迁移旧数据
    }
  }
  return generateDefaultLayout();
};
```

## 样式

### CSS 文件：SidebarLayout.css

```css
@layer components {
  /* 小部件视觉样式 */
  .sidebar-layout > .react-grid-item {
    backdrop-filter: blur(8px);
    background: rgb(255 255 255 / 80%);
    border: 1px solid rgb(59 130 246 / 10%);
    border-radius: 0.75rem;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* 悬停效果 */
  .sidebar-layout > .react-grid-item:hover {
    box-shadow: 0 0 0 1px rgb(59 130 246 / 40%);
    transform: translateY(-1px);
  }

  /* 拖拽状态 */
  .sidebar-layout > .react-grid-item.react-draggable-dragging {
    box-shadow: 0 0 0 2px rgb(16 185 129 / 70%);
    transform: scale(1.05) rotate(1deg);
  }
}

@layer overrides {
  /* 调整手柄指示器 */
  .sidebar-layout > .react-grid-item > .react-resizable-handle::after {
    content: '';
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 5px;
    height: 5px;
    border-right: 2px solid rgb(156 163 175 / 40%);
    border-bottom: 2px solid rgb(156 163 175 / 40%);
  }
}
```

### 视觉特性

- 毛玻璃背景效果
- 悬停、拖拽、调整大小的视觉反馈
- 平滑的过渡动画
- 清晰的调整手柄指示器

## 最佳实践

### 1. 动态高度计算

```tsx
// 从布局计算总高度，用于同步父组件
const calculateTotalHeight = (layout: Layout[]) => {
  return layout.reduce((max, item) => {
    return Math.max(max, item.y + item.h);
  }, 0);
};
```

### 2. 性能优化

```tsx
// 使用 useMemo 缓存小部件配置
const widgets = useMemo(
  () => [
    { id: 'widget-1', component: <Widget1 />, defaultHeight: 5 },
    // ...
  ],
  []
);

// 使用 useCallback 稳定回调函数
const handleLayoutChange = useCallback((layout) => {
  // 处理逻辑
}, []);
```

### 3. 版本化存储

```tsx
// 使用版本化的 storage key 避免旧数据干扰
const STORAGE_VERSION = 'v3-2025-8-22';
const storageKey = `sidebar-layout-${STORAGE_VERSION}`;
```

### 4. 折叠状态管理

```tsx
// 折叠时显示简化视图
if (collapsible && isCollapsed) {
  return (
    <div className="collapsed-sidebar" onClick={() => setIsCollapsed(false)}>
      <div>展开侧边栏 ({widgets.length})</div>
    </div>
  );
}
```

## 注意事项

1. **单列布局**：所有小部件宽度固定为 1，不支持多列
2. **垂直压缩**：`compactType="vertical"` 会自动消除空隙
3. **调整手柄**：只在底部显示（`resizeHandles: ['s']`）
4. **移动端**：建议禁用拖拽和调整功能

## 常见问题

### Q: 为什么小部件会在调整容器宽度时重排？

A: 这是使用 `ResponsiveGridLayout` 时的问题。已通过改用 `GridLayout` 解决。

### Q: 如何重置布局？

A: 组件会在 window 对象上注册重置函数：

```javascript
window.__resetSidebarLayout?.['sidebar-layout']?.();
```

### Q: 如何实现小部件的展开/折叠？

A: 目前组件不直接支持单个小部件的折叠，但可以通过控制 `component` 的内容实现：

```tsx
{
  id: 'collapsible-widget',
  component: isExpanded ? <FullWidget /> : <CollapsedWidget />,
  defaultHeight: isExpanded ? 8 : 2,
}
```

### Q: 布局数据迁移如何处理？

A: 组件自动处理旧格式（多断点）到新格式（单一布局）的迁移，无需手动干预。

## 相关组件

- [DualPaneLayout](./DualPaneLayout.md) - 常用作父容器
- [GridLayout](https://github.com/react-grid-layout/react-grid-layout) - 底层布局库

## 更新日志

### v3.0.0 (2025-08-22)

- 从 ResponsiveGridLayout 迁移到 GridLayout
- 修复容器宽度变化导致的重排问题
- 简化布局存储格式
- 支持旧数据自动迁移

### v2.0.0 (2025-08-22)

- 初始重构版本
- 支持拖拽排序
- 支持高度调整
- 支持布局持久化
