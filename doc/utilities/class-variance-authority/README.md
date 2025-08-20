# Class Variance Authority (CVA) 文档

Class Variance Authority 是一个用于构建设计系统和组件库的实用工具，专注于类型安全和开发体验，特别适合与 Tailwind CSS 配合使用。

## 核心特性

- 🎯 **类型安全** - 完整的 TypeScript 支持和类型推断
- 🧩 **变体管理** - 声明式组件变体定义
- 🔗 **复合变体** - 支持多变体组合条件样式
- 📦 **零运行时** - 编译时优化，生产环境零开销
- ⚡ **开发体验** - 优秀的 IntelliSense 和错误提示

## 安装

```bash
npm install class-variance-authority
```

## 基本用法

### 创建简单变体

```typescript
import { cva } from 'class-variance-authority';

const button = cva(['font-semibold', 'border', 'rounded'], {
  variants: {
    intent: {
      primary: ['bg-blue-500', 'text-white', 'border-transparent'],
      secondary: ['bg-white', 'text-gray-900', 'border-gray-300'],
    },
    size: {
      small: ['text-sm', 'py-1', 'px-2'],
      medium: ['text-base', 'py-2', 'px-4'],
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'medium',
  },
});

// 使用
button(); // 使用默认变体
button({ intent: 'secondary', size: 'small' });
```

### 在 React 中使用

```tsx
import { type VariantProps, cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white hover:bg-slate-800',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'bg-transparent border border-slate-200 hover:bg-slate-100',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
        ghost: 'bg-transparent hover:bg-slate-100',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  ...props
}) => {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
};
```

## 复合变体

处理多个变体组合的特殊情况：

```typescript
const button = cva('base-styles', {
  variants: {
    variant: {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-500',
    },
    size: {
      small: 'px-2 py-1',
      large: 'px-4 py-2',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
    },
  },
  compoundVariants: [
    // 主要按钮 + 大尺寸 = 特殊样式
    {
      variant: 'primary',
      size: 'large',
      className: 'shadow-lg',
    },
    // 禁用状态 + 主要按钮 = 特殊禁用样式
    {
      variant: 'primary',
      disabled: true,
      className: 'bg-blue-300',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'small',
  },
});
```

## 网格组件中的应用

### 网格项变体

```tsx
import { type VariantProps, cva } from 'class-variance-authority';

const gridItemVariants = cva(
  // 基础样式
  [
    'relative',
    'overflow-hidden',
    'rounded-lg',
    'border',
    'transition-all',
    'duration-200',
    'cursor-move',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-white',
          'border-gray-200',
          'shadow-sm',
          'hover:shadow-md',
        ],
        primary: [
          'bg-blue-50',
          'border-blue-200',
          'shadow-blue-100/50',
          'shadow-sm',
        ],
        success: [
          'bg-green-50',
          'border-green-200',
          'shadow-green-100/50',
          'shadow-sm',
        ],
        warning: [
          'bg-yellow-50',
          'border-yellow-200',
          'shadow-yellow-100/50',
          'shadow-sm',
        ],
        danger: [
          'bg-red-50',
          'border-red-200',
          'shadow-red-100/50',
          'shadow-sm',
        ],
      },
      size: {
        sm: ['p-2', 'min-h-16'],
        md: ['p-4', 'min-h-24'],
        lg: ['p-6', 'min-h-32'],
        xl: ['p-8', 'min-h-40'],
      },
      state: {
        idle: '',
        dragging: ['scale-105', 'shadow-2xl', 'z-50', 'rotate-1'],
        resizing: ['shadow-lg', 'border-blue-400', 'border-2'],
        selected: ['ring-2', 'ring-blue-500', 'ring-offset-2'],
      },
    },
    compoundVariants: [
      // 拖拽状态 + 主要变体
      {
        variant: 'primary',
        state: 'dragging',
        className: 'shadow-blue-500/25',
      },
      // 成功变体 + 选中状态
      {
        variant: 'success',
        state: 'selected',
        className: 'ring-green-500',
      },
      // 大尺寸 + 拖拽状态
      {
        size: ['lg', 'xl'],
        state: 'dragging',
        className: 'scale-102', // 更小的缩放
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'idle',
    },
  }
);

// 组件接口
interface GridItemProps extends VariantProps<typeof gridItemVariants> {
  children: React.ReactNode;
  className?: string;
  isDragging?: boolean;
  isResizing?: boolean;
  isSelected?: boolean;
}

// 网格项组件
export const GridItem: React.FC<GridItemProps> = ({
  variant,
  size,
  state,
  className,
  children,
  isDragging,
  isResizing,
  isSelected,
  ...props
}) => {
  // 根据状态自动确定 state 变体
  const computedState = isDragging
    ? 'dragging'
    : isResizing
      ? 'resizing'
      : isSelected
        ? 'selected'
        : state || 'idle';

  return (
    <div
      className={gridItemVariants({
        variant,
        size,
        state: computedState,
        className,
      })}
      {...props}
    >
      {children}
    </div>
  );
};
```

### 指标卡片变体

```tsx
const metricCardVariants = cva(
  ['rounded-xl', 'border', 'p-6', 'transition-all', 'duration-200'],
  {
    variants: {
      theme: {
        default: 'bg-white border-gray-200',
        dark: 'bg-gray-800 border-gray-700 text-white',
        gradient:
          'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200',
      },
      trend: {
        up: '',
        down: '',
        neutral: '',
      },
      size: {
        sm: 'p-4 text-sm',
        md: 'p-6 text-base',
        lg: 'p-8 text-lg',
      },
    },
    compoundVariants: [
      {
        theme: 'default',
        trend: 'up',
        className: 'border-green-200 bg-green-50',
      },
      {
        theme: 'default',
        trend: 'down',
        className: 'border-red-200 bg-red-50',
      },
      {
        theme: 'dark',
        trend: 'up',
        className: 'border-green-700 bg-green-900/20',
      },
      {
        theme: 'dark',
        trend: 'down',
        className: 'border-red-700 bg-red-900/20',
      },
    ],
    defaultVariants: {
      theme: 'default',
      trend: 'neutral',
      size: 'md',
    },
  }
);
```

## 工具函数组合

### 与 clsx 和 tailwind-merge 结合

```typescript
import { cva } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 通用类名合并工具
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// CVA 与工具函数结合
const alertVariants = cva(
  'relative w-full rounded-lg border p-4',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface AlertProps extends VariantProps<typeof alertVariants> {
  className?: string;
}

const Alert = ({ className, variant, ...props }: AlertProps) => (
  <div
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
);
```

## 最佳实践

### 1. 组织变体结构

```typescript
// ✅ 好的实践 - 清晰的变体分组
const componentVariants = cva('base-classes', {
  variants: {
    // 外观变体
    variant: {
      /* 样式选项 */
    },

    // 尺寸变体
    size: {
      /* 尺寸选项 */
    },

    // 状态变体
    state: {
      /* 状态选项 */
    },

    // 布尔变体
    disabled: {
      true: 'disabled-classes',
    },
  },
  compoundVariants: [
    // 复合变体逻辑
  ],
  defaultVariants: {
    variant: 'default',
    size: 'medium',
  },
});
```

### 2. 类型安全的属性

```tsx
// 提取变体属性类型
type ButtonVariants = VariantProps<typeof buttonVariants>;

// 扩展 HTML 属性
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  // 额外的自定义属性
  loading?: boolean;
}
```

### 3. 性能优化

```typescript
// ✅ 在组件外部定义变体（避免重复创建）
const itemVariants = cva(/* ... */);

function MyComponent() {
  // ❌ 避免在组件内部定义
  // const variants = cva(/* ... */);

  return <div className={itemVariants({ variant: 'primary' })} />;
}
```

## 版本信息

- 当前项目使用版本：**v0.7.1**
- 代码示例数量：**67个**
- 信任度评分：**9.1/10**

## 使用优势

- **类型安全**: 完整的 TypeScript 类型推断
- **性能优秀**: 编译时优化，零运行时开销
- **开发体验**: IntelliSense 支持和错误提示
- **维护性强**: 声明式变体管理
- **可扩展性**: 支持复杂的变体组合逻辑

## 相关文档

- [API 参考](./api-reference.md)
- [最佳实践](./best-practices.md)
- [示例代码](./examples.md)
- [与 Tailwind CSS 集成](../../integration-guides/styling-with-cva.md)
