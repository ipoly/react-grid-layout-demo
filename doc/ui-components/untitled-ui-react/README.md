# Untitled UI React 文档

Untitled UI React 是世界上最大的开源 React 组件集合，使用 Tailwind CSS 和 React Aria 构建，专为快速开发现代、美观的界面而设计。

## 核心特性

- 🎨 **像素完美** - 高质量设计，注重细节
- ♿ **完全可访问** - 基于 React Aria，遵循 WCAG 标准
- 🚀 **生产就绪** - 经过测试的组件，可直接用于生产
- 📦 **MIT 许可** - 免费开源，可用于商业项目
- 🔧 **无依赖锁定** - Copy-paste 方式，源码直接集成
- 🌙 **原生暗色模式** - CSS 变量支持主题切换

## 安装和使用

### 安装方式

```bash
# 使用官方 CLI 安装组件
npx untitledui@latest add button
npx untitledui@latest add badge
npx untitledui@latest add dropdown
```

### 组件路径约定

```
src/
├── components/
│   └── base/           # Untitled UI 官方组件
│       ├── buttons/
│       │   └── button.tsx
│       ├── display/
│       │   └── badge.tsx
│       └── overlays/
│           └── dropdown.tsx
```

### 导入和使用

```tsx
import { Button } from '../components/base/buttons/button';
import { Badge } from '../components/base/display/badge';

function App() {
  return (
    <div>
      <Button color="primary" size="md">
        主要按钮
      </Button>
      <Badge color="success" size="sm">
        成功状态
      </Badge>
    </div>
  );
}
```

## 核心组件

### 按钮组件

```tsx
import { Button } from '../components/base/buttons/button';
import { Plus } from '@untitledui/icons';

// 基础按钮
<Button color="primary" size="md">
  主要按钮
</Button>

// 带图标的按钮
<Button
  color="secondary"
  size="lg"
  iconLeading={Plus}
>
  添加项目
</Button>

// 不同变体
<Button color="tertiary" size="sm">
  次要按钮
</Button>

<Button color="destructive" size="xl">
  危险操作
</Button>
```

**可用配置:**

- **colors**: `primary`, `secondary`, `tertiary`, `destructive`
- **sizes**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
- **variants**: `solid`, `outline`, `ghost`, `link`

### 徽章组件

```tsx
import { Badge } from '../components/base/display/badge';

// 状态徽章
<Badge color="success">成功</Badge>
<Badge color="warning">警告</Badge>
<Badge color="error">错误</Badge>
<Badge color="gray">默认</Badge>

// 不同尺寸
<Badge size="sm" color="primary">小徽章</Badge>
<Badge size="md" color="primary">中徽章</Badge>
<Badge size="lg" color="primary">大徽章</Badge>

// 带图标
<Badge color="success" iconLeading={CheckCircle}>
  已完成
</Badge>
```

### 特色图标组件

```tsx
import { FeaturedIcon } from '../components/base/display/featured-icon';
import { CheckCircle, AlertTriangle } from '@untitledui/icons';

// 使用 icon 属性（推荐）
<FeaturedIcon
  color="brand"
  theme="light"
  size="lg"
  icon={CheckCircle}
/>

// 使用 children（兼容）
<FeaturedIcon color="warning" theme="modern" size="md">
  <AlertTriangle className="h-5 w-5" />
</FeaturedIcon>
```

**主题选项:**

- `light` - 浅色背景
- `gradient` - 渐变背景
- `dark` - 深色背景
- `outline` - 轮廓样式
- `modern` - 现代风格
- `modern-neue` - 新现代风格

### 下拉菜单

```tsx
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from '../components/base/overlays/dropdown';

<Dropdown>
  <DropdownTrigger>
    <Button>打开菜单</Button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem>编辑</DropdownItem>
    <DropdownItem>复制</DropdownItem>
    <DropdownItem color="destructive">删除</DropdownItem>
  </DropdownContent>
</Dropdown>;
```

## 表单组件

### 输入框组件

```tsx
import { Input } from '../components/base/forms/input';
import { Search } from '@untitledui/icons';

// 基础输入框
<Input
  placeholder="请输入内容"
  label="用户名"
/>

// 带图标的输入框
<Input
  placeholder="搜索..."
  iconLeading={Search}
/>

// 不同状态
<Input
  placeholder="错误状态"
  state="error"
  helperText="请输入正确的格式"
/>

<Input
  placeholder="成功状态"
  state="success"
  helperText="格式正确"
/>
```

### 文本域组件

```tsx
import { Textarea } from '../components/base/forms/textarea';

<Textarea
  label="描述"
  placeholder="请输入详细描述..."
  rows={4}
  helperText="最多 500 个字符"
/>;
```

### 切换开关

```tsx
import { Toggle } from '../components/base/forms/toggle';

<Toggle label="启用通知" description="接收重要更新和提醒" />;
```

## 网格系统中的应用

### 网格项卡片

```tsx
import { Button } from '../components/base/buttons/button';
import { Badge } from '../components/base/display/badge';
import { Card, CardContent, CardHeader } from '../components/ui/card';

function MetricCard({ title, value, trend, color = 'primary' }) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <Badge color={trend === 'up' ? 'success' : 'error'}>
          {trend === 'up' ? '↑' : '↓'} {Math.abs(change)}%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <Button size="sm" color="secondary" className="mt-4 w-full">
          查看详情
        </Button>
      </CardContent>
    </Card>
  );
}
```

### 工具栏组件

```tsx
import { Download, Filter, MoreHorizontal, Plus } from '@untitledui/icons';

import { Button } from '../components/base/buttons/button';

function GridToolbar() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <Button color="primary" size="md" iconLeading={Plus}>
          添加组件
        </Button>
        <Button color="secondary" size="md" iconLeading={Filter}>
          筛选
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button color="tertiary" size="md" iconLeading={Download}>
          导出
        </Button>
        <Button color="tertiary" size="md" iconOnly>
          <MoreHorizontal />
        </Button>
      </div>
    </div>
  );
}
```

## 可用组件清单

### 基础组件

- ✅ `button` - 按钮组件
- ✅ `badge` - 徽章组件
- ✅ `featured-icon` - 特色图标
- ✅ `avatar` - 头像组件
- ✅ `tooltip` - 工具提示
- ✅ `progress` - 进度条
- ✅ `slider` - 滑块

### 表单组件

- ✅ `input` - 输入框
- ✅ `textarea` - 文本域
- ✅ `toggle` - 切换开关
- ✅ `checkbox` - 复选框
- ✅ `radio` - 单选按钮
- ✅ `select` - 选择器

### 导航组件

- ✅ `dropdown` - 下拉菜单
- ✅ `tabs` - 标签页
- ✅ `breadcrumb` - 面包屑
- ✅ `pagination` - 分页器

### 反馈组件

- ✅ `alert` - 警告提示
- ✅ `toast` - 消息通知
- ✅ `modal` - 模态框
- ✅ `dialog` - 对话框

## 主题定制

### CSS 变量定制

```css
@theme {
  /* 品牌色彩 */
  --color-brand-50: 240 249 255;
  --color-brand-500: 59 130 246;
  --color-brand-900: 30 58 138;

  /* 成功色彩 */
  --color-success-50: 240 253 244;
  --color-success-500: 34 197 94;
  --color-success-900: 20 83 45;

  /* 错误色彩 */
  --color-error-50: 254 242 242;
  --color-error-500: 239 68 68;
  --color-error-900: 127 29 29;

  /* 字体 */
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* 圆角 */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
}
```

### 暗色模式

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: 0 0% 3.9%;
    --color-foreground: 0 0% 98%;

    --color-card: 0 0% 3.9%;
    --color-card-foreground: 0 0% 98%;

    --color-border: 0 0% 14.9%;
    --color-input: 0 0% 14.9%;
  }
}
```

## 优先使用原则

根据项目文档 `CLAUDE.md`，必须遵循以下原则：

### ✅ 优先使用官方组件

```tsx
// ✅ 正确 - 使用官方 Button
import { Button } from '../components/base/buttons/button';

// ❌ 错误 - 不要自创 Button（如果官方存在）
const CustomButton = () => {
  /* ... */
};
```

### ✅ 正确的安装和导入

```bash
# 安装官方组件
npx untitledui@latest add button
npx untitledui@latest add badge
```

```tsx
// 从正确路径导入
import { Button } from '../components/base/buttons/button';
import { Badge } from '../components/base/display/badge';
```

### ✅ 仅在必要时自定义

```tsx
// ✅ 允许 - 官方不存在的组件
const MetricCard = () => {
  /* 自定义业务组件 */
};

// ✅ 允许 - 复合组件
const GridItemWithToolbar = () => {
  return (
    <div>
      <Button /> {/* 使用官方组件 */}
      {/* 自定义业务逻辑 */}
    </div>
  );
};
```

## 版本信息

- 当前项目使用版本：**v0.0.19** (Icons)
- 代码示例数量：**35个**
- 信任度评分：**7.5/10**
- 许可证：**MIT**

## 特色优势

- **免费开源** - MIT 许可，可商用
- **源码直接集成** - Copy-paste 方式，无依赖锁定
- **现代技术栈** - React 19 + Tailwind CSS v4 + React Aria
- **完全可访问** - WCAG 标准，支持辅助技术
- **原生暗色模式** - CSS 变量无缝切换

## 相关文档

- [组件 API](./api-reference.md)
- [使用指南](./best-practices.md)
- [示例集合](./examples.md)
- [官方网站](https://www.untitledui.com/react/components)
