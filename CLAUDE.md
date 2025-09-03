# React Grid Layout Demo - Project Documentation

## 项目概述

基于 React Grid Layout + Untitled UI 的固定宽度网格布局演示项目，专为 1280-1680px 桌面端优化，展示拖拽、调整大小等交互功能。

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

### 固定宽度配置

```tsx
// 固定宽度布局配置（1280-1680px）
export interface BreakpointConfig {
  id: string;
  name: string;
  description: string;
  cols: number; // 固定 12 列
  containerConfig: {
    minWidth: 1280;
    maxWidth: 1680;
    adaptive: true;
  };
}
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
- **独立目录管理**: 官方 Untitled UI 组件库位于 `/untitled-ui/` 独立目录
- **导入规范**: 从 `@untitled-ui/components/` 路径导入官方组件
- **清晰分离**: 项目自定义组件在 `src/components/`，官方组件在 `untitled-ui/`

**📦 组件库管理策略**

为避免 CLI 工具的路径限制和混乱，我们采用独立目录管理：

- **官方组件库**: `/untitled-ui/` - 包含完整的 Untitled UI 组件库
- **项目组件**: `/src/components/` - 项目特定的业务组件
- **优势**:
  - 避免路径冲突和混乱
  - 便于整体更新或替换
  - 清晰的代码组织结构
  - 独立的版本管理

**🚫 重要管理规则**

- **禁止修改**: `/untitled-ui/` 目录下的文件 **严禁修改**
- **跳过格式化**: 该目录已配置排除在 lint 和格式化流程之外
  - `.prettierignore` - 跳过 Prettier 格式化
  - `.eslintignore` - 跳过 ESLint 检查
  - `.stylelintrc.json` - 跳过 Stylelint 样式检查
- **保持原样**: 确保将来能够无冲突地更新官方组件库
- **自定义方式**: 如需定制，通过 **拷贝** 到 `src/components/` 目录进行

**🔧 组件使用方式**

```typescript
// 导入官方 Untitled UI 组件
import { Badge } from '@untitled-ui/components/base/badges/badges';
import { Button } from '@untitled-ui/components/base/buttons/button';
import { FeaturedIcon } from '@untitled-ui/components/foundations/featured-icon/featured-icons';
// 导入 Hooks（从 untitled-ui 导入）
import { useBreakpoint } from '@untitled-ui/hooks/use-breakpoint';
import { useClipboard } from '@untitled-ui/hooks/use-clipboard';
import { useResizeObserver } from '@untitled-ui/hooks/use-resize-observer';
// 导入工具函数（从 untitled-ui 导入）
import { cx, sortCx } from '@untitled-ui/utils/cx';

// 导入项目自定义组件（如果将来需要使用 @src 路径）
// import { MetricCard } from '@src/components/MetricCard';
// import { GridItem } from '@src/components/ui/GridItem';
```

**📋 官方可用组件清单**
基础组件包括：`button`, `badge`, `featured-icon`, `dropdown`, `input`, `textarea`, `toggle`, `checkbox`, `radio`, `avatar`, `tooltip`, `progress`, `slider` 等

**✅ 自定义组件创建策略**

1. **直接使用**: 优先从 `/untitled-ui/` 中导入使用官方组件
2. **拷贝定制**: 如需修改官方组件，拷贝到 `src/components/` 后自定义
3. **全新组件**: 创建 Untitled UI 中不存在的功能组件
4. **业务组件**: 项目特定的数据展示和业务逻辑组件

**📋 组件拷贝定制流程**

```bash
# 1. 拷贝官方组件到项目目录
cp untitled-ui/components/base/buttons/button.tsx src/components/ui/custom-button.tsx

# 2. 重命名组件和相关引用
# 3. 根据需求进行自定义修改
# 4. 从自定义路径导入使用
```

### 组件特点

- **免费开源**: MIT 许可，可用于商业项目
- **无依赖锁定**: Copy-paste 方式，源码直接加入项目
- **现代技术栈**: 基于 React 19 + Tailwind CSS v4 + React Aria
- **完全可访问**: 遵循 WAI-ARIA 标准
- **原生暗色模式**: 通过 CSS 变量支持主题切换

### 组件使用

```tsx
// 导入官方 Untitled UI 组件
import { Button } from '@untitled-ui/components/base/buttons/button';
import { Badge } from '@untitled-ui/components/base/badges/badges';
import { Avatar } from '@untitled-ui/components/base/avatar/avatar';
import { FeaturedIcon } from '@untitled-ui/components/foundations/featured-icon/featured-icons';

// 使用官方组件
<Button color="primary" size="sm" iconLeading={Plus}>
  Add Widget
</Button>
<Badge color="brand" size="md">New</Badge>
<Avatar size="lg" src="/avatar.jpg" />
<FeaturedIcon color="brand" theme="light" size="lg" icon={CheckCircle} />
```

### 组件使用检查清单

**🔍 添加新组件前必须检查**

1. 检查 `/untitled-ui/components/` 目录中是否已有该组件
2. 如果存在，直接从 `@untitled-ui/components/` 导入使用
3. 如果不存在，才可以创建自定义组件
4. 自定义组件放在 `src/components/` 或 `src/components/ui/` 目录下

**💡 工具函数说明**

- **cx**: 替代 `cn` 函数，用于合并 Tailwind CSS 类名，支持自定义的 display 类
- **sortCx**: 帮助在样式对象中排序类名，支持 Tailwind IntelliSense
- **useBreakpoint**: 检查 Tailwind CSS 断点是否激活
- **useClipboard**: 管理剪贴板操作
- **useResizeObserver**: 监听元素大小变化

**📝 导入路径速查**

| 组件类型 | 导入路径示例                                                 |
| -------- | ------------------------------------------------------------ |
| 基础组件 | `@untitled-ui/components/base/<category>/<component>`        |
| 应用组件 | `@untitled-ui/components/application/<category>/<component>` |
| 基础元素 | `@untitled-ui/components/foundations/<category>/<component>` |
| 营销组件 | `@untitled-ui/components/marketing/<category>/<component>`   |
| 工具函数 | `@untitled-ui/utils/<util>`                                  |
| Hooks    | `@untitled-ui/hooks/<hook>`                                  |

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
/
├── untitled-ui/                 # 独立的 Untitled UI 组件库
│   ├── components/
│   │   ├── application/         # 应用级组件
│   │   │   ├── app-navigation/ # 导航组件
│   │   │   ├── date-picker/    # 日期选择器
│   │   │   ├── modals/         # 模态框
│   │   │   ├── table/          # 表格
│   │   │   └── ...
│   │   ├── base/                # 基础组件
│   │   │   ├── avatar/         # 头像
│   │   │   ├── buttons/        # 按钮
│   │   │   ├── badges/         # 徽章
│   │   │   ├── input/          # 输入框
│   │   │   └── ...
│   │   ├── foundations/        # 基础元素
│   │   │   ├── featured-icon/  # 特色图标
│   │   │   ├── social-icons/   # 社交图标
│   │   │   └── ...
│   │   └── marketing/          # 营销组件
│   ├── hooks/                   # React Hooks
│   ├── utils/                   # 工具函数
│   └── styles/                  # 样式文件
├── src/
│   ├── components/              # 项目自定义组件
│   │   ├── ui/                  # UI 组件
│   │   │   ├── ViewAllLink.tsx # 查看全部链接
│   │   │   └── ...
│   │   ├── MetricCard.tsx      # 指标卡片
│   │   ├── Header.tsx          # 页头
│   │   ├── Tasks.tsx           # 任务组件
│   │   └── ...
│   └── App.tsx                 # 主应用
└── ...
```

### 目录说明

- `/untitled-ui/` - 独立的官方 Untitled UI 组件库目录
  - `components/` - 所有官方组件（application、base、foundations、marketing）
  - `hooks/` - 官方提供的 React Hooks（如 useBreakpoint、useClipboard 等）
  - `utils/` - 官方工具函数（如 cx、sortCx 等）
  - `styles/` - 官方样式文件
- `/src/components/` - 项目自定义业务组件
  - `ui/` - 项目特定的 UI 组件
  - 其他业务组件文件

### 路径别名配置

- **@untitled-ui**: 映射到 `/untitled-ui/` 目录，用于导入官方组件
- **@src**: 映射到 `/src/` 目录，用于导入项目自定义组件（可选）

**注意**:

- untitled-ui 内部使用 `@untitled-ui/` 作为路径前缀，避免与主项目冲突
- 项目不再维护独立的 `src/lib/`、`src/utils/` 和 `src/hooks/` 目录，统一使用 `untitled-ui/` 中的工具函数和 Hooks

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
- **固定宽度问题**: 检查容器宽度配置和列数设置

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

### 固定宽度布局组件

```tsx
// 针对固定宽度设计，使用标准 GridLayout
interface FixedGridLayoutProps extends GridLayoutProps {
  // 固定配置
  cols: 12; // 始终使用 12 列网格
  width: number; // 固定宽度 (1280-1680px 范围内)

  // 布局配置
  layout: Layout[]; // 单一布局配置

  // 容器配置
  containerConfig?: {
    minWidth: 1280;
    maxWidth: 1680;
    adaptive: true;
  };
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

#### 固定宽度网格

```tsx
import GridLayout from 'react-grid-layout';

function FixedWidthGrid() {
  const layout = [
    { i: 'a', x: 0, y: 0, w: 4, h: 2 },
    { i: 'b', x: 4, y: 0, w: 4, h: 2 },
    { i: 'c', x: 8, y: 0, w: 4, h: 2 },
  ];

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12} // 固定 12 列
      rowHeight={60}
      width={1400} // 固定宽度，适用于 1280-1680px 范围
      onLayoutChange={(layout) => setLayout(layout)}
    >
      <div key="a">a</div>
      <div key="b">b</div>
      <div key="c">c</div>
    </GridLayout>
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
