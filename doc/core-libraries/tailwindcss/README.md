# Tailwind CSS 文档

Tailwind CSS 是一个实用优先的 CSS 框架，用于快速构建自定义用户界面。v4 版本引入了 CSS-first 配置方式，无需 JavaScript 配置文件。

## 核心特性

- 🚀 **实用优先** - 组合式 CSS 类，快速构建界面
- 📱 **响应式设计** - 移动优先的响应式工具类
- 🎨 **高度可定制** - CSS-first 主题配置
- ⚡ **无运行时** - 构建时生成，零运行时开销
- 🔧 **开发体验** - 自动内容检测，无需手动配置

## 版本特性 (v4.1.11)

### CSS-First 配置

不再需要 `tailwind.config.js`，使用 CSS 原生语法配置：

```css
@import 'tailwindcss';

@theme {
  --color-brand: 220 100% 50%;
  --color-primary: 222.2 47.4% 11.2%;
  --color-primary-foreground: 210 40% 98%;
  --font-size-huge: 10rem;
}

@utility tab-size {
  tab-size: theme(--tab-size);
}
```

### 自动内容检测

无需配置 `content` 路径，自动扫描项目文件：

```css
/* 自动检测所有 .html, .js, .ts, .jsx, .tsx 文件 */
@import 'tailwindcss';
```

## 安装和配置

### 安装

```bash
npm install tailwindcss
```

### 基础配置

在你的主 CSS 文件中：

```css
/* styles/globals.css */
@import 'tailwindcss';
```

### 项目特定配置

```css
@import 'tailwindcss';

@theme {
  /* 自定义颜色 */
  --color-brand-50: 240 249 255;
  --color-brand-500: 59 130 246;
  --color-brand-900: 30 58 138;

  /* 自定义字体 */
  --font-sans: Inter, sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* 自定义间距 */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;

  /* 断点配置 */
  --breakpoint-3xl: 1600px;
}

/* 自定义工具类 */
@utility glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## 常用工具类

### 布局

```html
<!-- Flexbox -->
<div class="flex items-center justify-between">
  <span>左侧内容</span>
  <span>右侧内容</span>
</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-4">
  <div>项目 1</div>
  <div>项目 2</div>
  <div>项目 3</div>
</div>

<!-- 定位 -->
<div class="relative">
  <div class="absolute top-0 right-0">绝对定位</div>
</div>
```

### 响应式设计

```html
<!-- 响应式网格 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <div>响应式网格项</div>
</div>

<!-- 响应式文字 -->
<h1 class="text-2xl md:text-4xl lg:text-6xl">响应式标题</h1>

<!-- 响应式间距 -->
<div class="p-4 md:p-8 lg:p-12">响应式内边距</div>
```

### 颜色和样式

```html
<!-- 背景和文字颜色 -->
<div class="bg-blue-500 text-white">蓝色背景白字</div>
<div class="bg-gradient-to-r from-purple-500 to-pink-500">渐变背景</div>

<!-- 边框和圆角 -->
<div class="border border-gray-300 rounded-lg">圆角边框</div>
<div class="border-2 border-dashed border-red-500">虚线边框</div>

<!-- 阴影 -->
<div class="shadow-lg hover:shadow-xl transition-shadow">阴影效果</div>
```

### 交互状态

```html
<!-- 悬停状态 -->
<button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  悬停变色按钮
</button>

<!-- 焦点状态 -->
<input
  class="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
/>

<!-- 激活状态 -->
<button class="bg-green-500 active:bg-green-700 px-4 py-2 rounded">
  点击效果
</button>
```

## React Grid Layout 集成

### 网格项样式

```jsx
// 基础网格项样式
const gridItemClass = `
  bg-white 
  rounded-lg 
  shadow-md 
  border 
  border-gray-200 
  p-4 
  hover:shadow-lg 
  transition-shadow
`;

function GridItem({ children }) {
  return <div className={gridItemClass}>{children}</div>;
}
```

### 响应式网格容器

```jsx
const gridContainerClass = `
  min-h-screen 
  bg-gray-50 
  p-4 
  md:p-6 
  lg:p-8
`;

function GridContainer({ children }) {
  return <div className={gridContainerClass}>{children}</div>;
}
```

### 拖拽状态样式

```jsx
// 使用 CSS-in-JS 或 CSS 变量
const draggingStyles = {
  '--tw-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '--tw-scale-x': '1.02',
  '--tw-scale-y': '1.02',
};

function DraggableGridItem({ children, isDragging }) {
  const className = `
    transition-all 
    duration-200 
    ${isDragging ? 'shadow-2xl scale-102 z-50' : 'shadow-md'}
  `;

  return (
    <div className={className} style={isDragging ? draggingStyles : {}}>
      {children}
    </div>
  );
}
```

## 自定义组件样式

### 使用 @apply 指令

```css
@import 'tailwindcss';

@layer components {
  .btn {
    @apply px-4 py-2 rounded font-medium transition-colors;
  }

  .btn-primary {
    @apply bg-blue-500 text-white hover:bg-blue-600;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-900 hover:bg-gray-300;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6 border border-gray-200;
  }

  .grid-item {
    @apply card hover:shadow-lg transition-shadow cursor-move;
  }
}
```

### 组件变体（配合 CVA）

```tsx
import { type VariantProps, cva } from 'class-variance-authority';

const gridItemVariants = cva(
  // 基础样式
  'rounded-lg border p-4 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white border-gray-200 shadow-md',
        primary: 'bg-blue-50 border-blue-200 shadow-md',
        success: 'bg-green-50 border-green-200 shadow-md',
        warning: 'bg-yellow-50 border-yellow-200 shadow-md',
      },
      size: {
        sm: 'p-2 text-sm',
        md: 'p-4 text-base',
        lg: 'p-6 text-lg',
      },
      state: {
        idle: '',
        dragging: 'shadow-2xl scale-105 z-50',
        resizing: 'shadow-xl border-blue-400',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'idle',
    },
  }
);
```

## 性能优化

### 类名优化

```jsx
// ❌ 动态类名（难以优化）
const dynamicClass = `bg-${color}-500 text-${size}`;

// ✅ 预定义类名（可优化）
const classMap = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  sm: 'text-sm',
  lg: 'text-lg',
};

const optimizedClass = `${classMap[color]} ${classMap[size]}`;
```

### 条件样式

```jsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 组合工具函数
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// 使用
const className = cn(
  'base-styles',
  isActive && 'active-styles',
  isDisabled && 'disabled-styles',
  customClassName
);
```

## 版本信息

- 当前项目使用版本：**v4.1.11**
- 代码示例数量：**4768个**
- 信任度评分：**7.5/10**

## v4 新特性

- ✨ **CSS-first 配置** - 原生 CSS 语法配置主题
- 🚀 **自动内容检测** - 无需手动配置扫描路径
- 📦 **更小包体积** - 优化的构建输出
- 🔧 **更好的工具** - 改进的开发工具支持

## 相关文档

- [配置参考](./api-reference.md)
- [最佳实践](./best-practices.md)
- [示例代码](./examples.md)
- [与网格系统集成](../../integration-guides/grid-layout-with-tailwind.md)
