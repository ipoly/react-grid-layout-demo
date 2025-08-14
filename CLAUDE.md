# React Grid Layout Demo - Project Documentation

## 项目概述

基于 React Grid Layout + Untitled UI 的响应式网格布局演示项目，展示拖拽、调整大小等交互功能。

## 技术栈

- **构建工具**: Vite 7.1.2 + React 19.1 + TypeScript 5.8
- **包管理**: pnpm 9.15.0 (通过 Proto 管理)
- **样式**: Tailwind CSS v4.1 (CSS-first 配置)
- **UI组件**: Untitled UI React (免费开源，MIT 许可)
- **网格布局**: react-grid-layout 1.5.2
- **代码质量**: ESLint + Prettier + Stylelint + Husky

## 开发命令

```bash
# 开发服务器
pnpm run dev

# 代码检查和格式化
pnpm run lint          # ESLint 检查
pnpm run lint:fix      # 自动修复 ESLint 错误
pnpm run format        # Prettier 格式化
pnpm run format:check  # 检查格式化
pnpm run style         # Stylelint 检查
pnpm run style:fix     # 自动修复样式错误

# 构建和预览
pnpm run build         # 生产构建
pnpm run preview       # 预览构建结果
```

## React Grid Layout 最佳实践

### 性能优化

- **组件记忆化**: 使用 `React.memo()` 包装网格项组件，避免不必要的重渲染
- **布局配置缓存**: 使用 `useMemo` 缓存布局配置，减少计算开销
- **回调函数稳定**: 使用 `useCallback` 确保 `onLayoutChange` 等回调函数引用稳定

```tsx
// 推荐的网格项组件写法
const GridItem = React.memo<GridItemProps>(({ children, ...props }) => {
  return <div {...props}>{children}</div>;
});

// 布局配置缓存
const layouts = useMemo(
  () => ({
    lg: [{ i: 'item1', x: 0, y: 0, w: 6, h: 4 }],
    // ...
  }),
  []
);

// 稳定的回调函数
const handleLayoutChange = useCallback((layout: Layout[], layouts: Layouts) => {
  // 处理布局变化
}, []);
```

### 响应式配置

```tsx
// 推荐的断点配置
breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
```

### 布局持久化

```tsx
// 本地存储布局
const saveLayout = (layouts: Layouts) => {
  localStorage.setItem('grid-layouts', JSON.stringify(layouts));
};

// 加载已保存的布局
const loadLayout = (): Layouts => {
  const saved = localStorage.getItem('grid-layouts');
  return saved ? JSON.parse(saved) : defaultLayouts;
};
```

## Untitled UI React 最佳实践

### 组件开发原则 🔥重要

**⚠️ 优先使用官方组件原则**

- **必须优先**: 如果 Untitled UI 官方库中存在相同功能的组件，必须使用官方版本，不得自行创建
- **安装方式**: 使用 `npx untitledui@latest add <component>` 安装官方组件
- **组件路径**: 官方组件统一放置在 `src/components/base/` 目录下
- **导入规范**: 从 `../components/base/<category>/<component>` 路径导入使用

**📋 官方可用组件清单**
基础组件包括：`button`, `badge`, `featured-icon`, `dropdown`, `input`, `textarea`, `toggle`, `checkbox`, `radio`, `avatar`, `tooltip`, `progress`, `slider` 等

**✅ 仅在以下情况下允许自定义组件**

1. Untitled UI 官方库中不存在该功能组件
2. 需要特殊业务逻辑集成的复合组件（如 GridItem）
3. 项目特定的数据展示组件（如 MetricCard）

### 组件特点

- **免费开源**: MIT 许可，可用于商业项目
- **无依赖锁定**: Copy-paste 方式，源码直接加入项目
- **现代技术栈**: 基于 React 19 + Tailwind CSS v4 + React Aria
- **完全可访问**: 遵循 WAI-ARIA 标准
- **原生暗色模式**: 通过 CSS 变量支持主题切换

### 组件使用

```tsx
// 官方 Button 组件示例（已安装）
import { Button } from '../components/base/buttons/button';

<Button color="primary" size="sm" iconLeading={Plus}>
  Add Widget
</Button>
<Button color="secondary" size="md">Secondary Button</Button>
<Button color="tertiary" size="lg">Tertiary Button</Button>

// Card 组件示例（自定义，因官方无此组件）
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
  </CardHeader>
  <CardContent>
    内容区域
  </CardContent>
</Card>
```

### 组件使用检查清单

**🔍 添加新组件前必须检查**

1. 在 [Untitled UI 组件库](https://www.untitledui.com/react/components) 中搜索是否存在
2. 如果存在，使用 `npx untitledui@latest add <component>` 安装
3. 如果不存在，才可以创建自定义组件
4. 自定义组件放在 `src/components/ui/` 目录下

### 主题自定义

使用 Tailwind CSS v4 的 `@theme` 指令：

```css
@theme {
  --color-primary: 222.2 47.4% 11.2%;
  --color-primary-foreground: 210 40% 98%;
  /* 自定义颜色变量 */
}
```

## Tailwind CSS v4 新特性

### CSS-First 配置

- ❌ 不再需要 `tailwind.config.js`
- ✅ 使用 `@import "tailwindcss"` 导入
- ✅ 使用 `@theme` 指令配置主题
- ✅ 自动内容检测，无需手动配置 content 路径

### 新指令

```css
@import 'tailwindcss';

@theme {
  --color-brand: 220 100% 50%;
  --font-size-huge: 10rem;
}

@utility tab-size {
  tab-size: theme(--tab-size);
}
```

## 项目架构

```
src/
├── components/
│   ├── base/                    # 官方 Untitled UI 组件
│   │   └── buttons/
│   │       └── button.tsx       # 官方 Button 组件
│   ├── ui/                      # 自定义 UI 组件
│   │   ├── badge.tsx            # Badge 组件
│   │   ├── card.tsx             # Card 组件 (官方无此组件)
│   │   ├── featured-icon.tsx    # Featured Icon 组件
│   │   ├── grid-item.tsx        # 自定义网格项包装器
│   │   └── metric-card.tsx      # 指标卡片组件
│   ├── GridLayout.tsx           # 网格布局容器
│   └── GridItems.tsx            # 演示网格项组件
├── lib/
│   └── utils.ts                 # 工具函数 (cn 等)
├── utils/                       # Untitled UI 工具函数
│   ├── cx.ts                    # 样式合并工具
│   └── is-react-component.ts    # React 组件检测工具
└── App.tsx                     # 主应用
```

### 目录说明

- `src/components/base/` - 存放官方 Untitled UI 组件
- `src/components/ui/` - 存放自定义 UI 组件
- `src/utils/` - 存放 Untitled UI 所需的工具函数

## 代码质量工具

### 自动格式化

- **保存时格式化**: VSCode 配置自动格式化
- **预提交钩子**: Husky + lint-staged 确保代码质量
- **导入排序**: Prettier 插件自动排序 imports

### 配置文件

- `.prettierrc` - Prettier 配置
- `eslint.config.js` - ESLint 配置 (ESLint 9.x 扁平配置)
- `.stylelintrc.json` - Stylelint 配置
- `.vscode/settings.json` - 编辑器配置

## GitHub Pages 部署

### 自动部署

- **触发**: 推送到 `main` 分支
- **检查**: 运行 lint + format 检查
- **构建**: 生产环境构建
- **部署**: 自动部署到 GitHub Pages

### Vite 配置

```typescript
export default defineConfig({
  base:
    process.env.NODE_ENV === 'production' ? '/react-grid-layout-demo/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
```

## 开发建议

1. **组件设计**: 每个网格项应该是独立的组件，便于复用和测试
2. **状态管理**: 复杂布局考虑使用 Context 或状态管理库
3. **性能监控**: 大量网格项时使用 React DevTools Profiler 监控性能
4. **用户体验**: 提供布局重置、模板选择等功能
5. **移动端优化**: 考虑移动设备上的触摸交互体验

## 故障排除

### 常见问题

- **CSS 样式不生效**: 确保导入了 `react-grid-layout/css/styles.css`
- **拖拽不响应**: 检查 `isDraggable` 和 `isResizable` 属性
- **布局重叠**: 调整 `margin` 和 `containerPadding` 设置
- **响应式问题**: 检查断点配置和列数设置

### 调试技巧

```tsx
// 开启调试模式查看网格线
<GridLayout
  onLayoutChange={(layout, layouts) => {
    console.log('Layout changed:', layouts);
  }}
  // 其他属性...
/>
```

## Featured Icons 最佳实践

### 组件使用方式

```tsx
// 推荐: 使用 icon 属性 (官方标准用法)
<FeaturedIcon
  color="brand"
  theme="light"
  size="lg"
  icon={CheckCircle}
/>

// 也支持: 使用 children (兼容性用法)
<FeaturedIcon color="brand" theme="light" size="lg">
  <CheckCircle className="h-5 w-5" />
</FeaturedIcon>
```

### 官方 API 支持

- **color**: `brand`, `gray`, `success`, `warning`, `destructive`
- **theme**: `light`, `gradient`, `dark`, `outline`, `modern`, `modern-neue`
- **size**: `sm`, `md`, `lg`, `xl`, `2xl`

### 使用要点

#### 推荐的使用模式

**优先使用 icon 属性**: 符合 Untitled UI 官方标准

```tsx
// ✅ 官方标准 (推荐)
<FeaturedIcon color="brand" theme="light" size="lg" icon={CheckCircle} />

// ✅ 兼容方式 (也可以)
<FeaturedIcon color="brand" theme="light" size="lg">
  <CheckCircle className="h-5 w-5" />
</FeaturedIcon>
```

## TypeScript 类型设计模式

### 避免 HTML 属性冲突

```typescript
// 处理与 HTML 原生属性的冲突
interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  color?: 'brand' | 'gray'; // 自定义 color 属性
}
```

### 复合变体类型

```typescript
// 使用 compoundVariants 实现复杂样式组合
const variants = cva('base', {
  variants: {
    color: { brand: '', gray: '' },
    theme: { light: '', dark: '' },
  },
  compoundVariants: [
    { color: 'brand', theme: 'light', className: 'bg-primary/10' },
  ],
});
```

## React Grid Layout 官方 API 文档

### 核心 Props

#### GridLayout 组件

```tsx
interface GridLayoutProps {
  // 布局配置
  layout: Layout[]; // 网格项位置配置数组
  cols: number; // 网格列数 (默认: 12)
  rowHeight: number; // 行高 (默认: 150)
  width: number; // 容器宽度

  // 交互控制
  isDraggable: boolean; // 是否可拖拽 (默认: true)
  isResizable: boolean; // 是否可调整大小 (默认: true)
  isBounded: boolean; // 是否限制在容器内 (默认: false)

  // 间距和边距
  margin: [number, number]; // 网格项间距 [x, y] (默认: [10, 10])
  containerPadding: [number, number]; // 容器内边距 [x, y] (默认: [10, 10])

  // 约束
  maxRows: number; // 最大行数 (默认: Infinity)
  preventCollision: boolean; // 防止重叠 (默认: false)
  compactType: 'vertical' | 'horizontal' | null; // 压缩方向

  // 事件回调
  onLayoutChange: (layout: Layout[]) => void;
  onDragStart: (
    layout: Layout[],
    oldItem: Layout,
    newItem: Layout,
    placeholder: Layout,
    e: MouseEvent,
    element: HTMLElement
  ) => void;
  onDrag: (
    layout: Layout[],
    oldItem: Layout,
    newItem: Layout,
    placeholder: Layout,
    e: MouseEvent,
    element: HTMLElement
  ) => void;
  onDragStop: (
    layout: Layout[],
    oldItem: Layout,
    newItem: Layout,
    placeholder: Layout,
    e: MouseEvent,
    element: HTMLElement
  ) => void;
  onResizeStart: (
    layout: Layout[],
    oldItem: Layout,
    newItem: Layout,
    placeholder: Layout,
    e: MouseEvent,
    element: HTMLElement
  ) => void;
  onResize: (
    layout: Layout[],
    oldItem: Layout,
    newItem: Layout,
    placeholder: Layout,
    e: MouseEvent,
    element: HTMLElement
  ) => void;
  onResizeStop: (
    layout: Layout[],
    oldItem: Layout,
    newItem: Layout,
    placeholder: Layout,
    e: MouseEvent,
    element: HTMLElement
  ) => void;

  // 样式控制
  className: string; // 容器 CSS 类名
  style: CSSProperties; // 容器内联样式
  draggableCancel: string; // 不可拖拽元素选择器
  draggableHandle: string; // 拖拽手柄选择器

  // 性能优化
  useCSSTransforms: boolean; // 使用 CSS Transform (默认: true)
  transformScale: number; // Transform 缩放系数 (默认: 1)
}
```

#### Layout 配置对象

```tsx
interface Layout {
  i: string; // 唯一标识符 (必须与子元素 key 匹配)
  x: number; // 网格 x 坐标 (0 开始)
  y: number; // 网格 y 坐标 (0 开始)
  w: number; // 网格宽度 (占用列数)
  h: number; // 网格高度 (占用行数)

  // 约束属性
  minW?: number; // 最小宽度
  maxW?: number; // 最大宽度
  minH?: number; // 最小高度
  maxH?: number; // 最大高度

  // 控制属性
  static?: boolean; // 静态元素 (不可拖拽/调整)
  isDraggable?: boolean; // 单独控制拖拽
  isResizable?: boolean; // 单独控制调整大小
  resizeHandles?: ('s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne')[]; // 调整大小手柄位置
  isBounded?: boolean; // 是否限制在容器内
}
```

### ResponsiveGridLayout 组件

```tsx
interface ResponsiveGridLayoutProps
  extends Omit<GridLayoutProps, 'layout' | 'cols' | 'width'> {
  // 响应式配置
  breakpoints: { [breakpoint: string]: number }; // 断点配置
  cols: { [breakpoint: string]: number }; // 各断点列数
  layouts: { [breakpoint: string]: Layout[] }; // 各断点布局

  // 响应式回调
  onBreakpointChange: (newBreakpoint: string, newCols: number) => void;
  onWidthChange: (
    containerWidth: number,
    margin: [number, number],
    cols: number,
    containerPadding: [number, number]
  ) => void;
}
```

### 官方使用示例

#### 基础网格

```tsx
import GridLayout from 'react-grid-layout';

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

function BasicGrid() {
  const layout = [
    { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
    { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: 'c', x: 4, y: 0, w: 1, h: 2 },
  ];

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
      onLayoutChange={(layout) => saveToLS('layout', layout)}
    >
      <div key="a">a</div>
      <div key="b">b</div>
      <div key="c">c</div>
    </GridLayout>
  );
}
```

#### 响应式网格

```tsx
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';

function ResponsiveGrid() {
  const layouts = {
    lg: [
      { i: 'a', x: 0, y: 0, w: 4, h: 2 },
      { i: 'b', x: 4, y: 0, w: 4, h: 2 },
      { i: 'c', x: 8, y: 0, w: 4, h: 2 },
    ],
    md: [
      { i: 'a', x: 0, y: 0, w: 3, h: 2 },
      { i: 'b', x: 3, y: 0, w: 3, h: 2 },
      { i: 'c', x: 6, y: 0, w: 4, h: 2 },
    ],
    sm: [
      { i: 'a', x: 0, y: 0, w: 6, h: 2 },
      { i: 'b', x: 0, y: 2, w: 6, h: 2 },
      { i: 'c', x: 0, y: 4, w: 6, h: 2 },
    ],
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={60}
      onLayoutChange={(layout, layouts) => setLayouts(layouts)}
    >
      <div key="a">a</div>
      <div key="b">b</div>
      <div key="c">c</div>
    </ResponsiveGridLayout>
  );
}
```

### 高级特性

#### 动态添加/删除项目

```tsx
const [items, setItems] = useState(['a', 'b', 'c']);

const addItem = () => {
  setItems([...items, `item-${Date.now()}`]);
};

const removeItem = (i: string) => {
  setItems(items.filter((key) => key !== i));
};
```

#### 自定义调整大小手柄

```tsx
const layout = [
  {
    i: 'a',
    x: 0,
    y: 0,
    w: 4,
    h: 2,
    resizeHandles: ['se', 'sw', 'ne', 'nw'], // 四角调整
  },
];
```

#### 网格线显示 (调试)

```tsx
<GridLayout
  // 其他属性...
  style={{
    background: 'linear-gradient(to right, #f0f0f0 1px, transparent 1px)',
    backgroundSize: `${(width - margin[0] * 2) / cols}px ${rowHeight + margin[1]}px`,
  }}
/>
```

### CSS 样式自定义

#### 基础样式

```css
.react-grid-layout {
  position: relative;
}

.react-grid-item {
  transition: all 200ms ease;
  transition-property: left, top;
}

.react-grid-item.cssTransforms {
  transition-property: transform;
}

.react-grid-item > .react-resizable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 0;
  right: 0;
  background: url('data:image/svg+xml;...') no-repeat;
  cursor: se-resize;
}
```

#### 占位符样式

```css
.react-grid-placeholder {
  background: red;
  opacity: 0.2;
  transition-duration: 100ms;
  z-index: 2;
  user-select: none;
}
```

### 性能优化建议

1. **大量网格项**: 超过 100 个项目时考虑虚拟化
2. **复杂子组件**: 使用 `React.memo` 防止不必要重渲染
3. **布局缓存**: 使用 `useMemo` 缓存布局配置
4. **回调优化**: 使用 `useCallback` 稳定事件处理函数
5. **CSS Transform**: 启用 `useCSSTransforms` (默认已开启)

### 已知限制

- 网格项必须是 DOM 元素，不能是 React Fragment
- 子元素的 `key` 必须与 layout 中的 `i` 匹配
- 不支持嵌套网格布局
- 移动端触摸事件可能需要额外配置

## 扩展功能建议

1. **布局模板**: 预设多种布局模板供用户选择
2. **组件库集成**: 集成更多图表库 (Chart.js, Recharts)
3. **导出功能**: 支持导出布局配置为 JSON
4. **主题切换**: 实现亮色/暗色主题切换
5. **动画效果**: 添加布局变化的过渡动画
