# React Grid Layout 断点配置预设说明

## 概述

本仪表板支持 2 种断点配置预设，您可以通过右上角的齿轮图标 ⚙️ 快速切换不同的响应式布局配置，以适应不同的使用场景和设备类型。

## 可用预设

### 1. 🖥️ Default (Bootstrap-like)

**默认配置，适合大多数场景**

- **断点**: `lg: 1200px`, `md: 996px`, `sm: 768px`
- **列数**: `lg: 12列`, `md: 10列`, `sm: 6列`
- **容器**: 响应式容器，最大宽度适应视窗
- **特点**: 经典的响应式断点，与 Bootstrap 框架类似
- **适用场景**: 通用网站、传统企业应用、各种屏幕尺寸

### 2. 🎨 Fixed Layout (Original Design)

**原设计稿方案，固定布局**

- **断点**: `lg: 1200px`, `md: 996px`, `sm: 768px` (继承默认设置)
- **列数**: `lg: 12列`, `md: 10列`, `sm: 6列`
- **容器**: 固定宽度 1280-1680px，不随视窗改变
- **特点**: 固定容器宽度，布局稳定，适合设计稿还原
- **适用场景**: 设计稿精确还原、大屏显示、演示环境

## 配置详情

### Default 配置

```typescript
{
  id: 'default',
  name: 'Default (Bootstrap-like)',
  description: 'Classic responsive breakpoints, suitable for most scenarios',
  breakpoints: { lg: 1200, md: 996, sm: 768 },
  cols: { lg: 12, md: 10, sm: 6 }
}
```

### Fixed Layout 配置

```typescript
{
  id: 'experimental',
  name: 'Fixed Layout (Original Design)',
  description: 'Container width 1280-1680px, layout does not change with viewport',
  breakpoints: { lg: 1200, md: 996, sm: 768 },
  cols: { lg: 12, md: 10, sm: 6 },
  containerConfig: {
    minWidth: 1280,
    maxWidth: 1680,
    adaptive: true
  }
}
```

## 使用方法

### 切换预设

1. 点击右上角的齿轮图标 ⚙️
2. 在下拉菜单中选择 2 种可用预设之一
3. 点击预设名称即可切换
4. 布局会自动重置并应用新的断点配置

### 预设信息

每个预设显示：

- **名称**: Default (Bootstrap-like) 或 Fixed Layout (Original Design)
- **描述**: 详细的使用场景说明
- **断点标签**: 显示 LG/MD/SM 的像素值和列数

### 持久化

- 选择的预设会自动保存到浏览器本地存储
- 页面刷新后保持您的选择
- 每次切换预设时布局会重置到默认状态

## 技术实现

### 配置结构

```typescript
interface BreakpointConfig {
  id: string;
  name: string;
  description: string;
  breakpoints: { lg: number; md: number; sm: number };
  cols: { lg: number; md: number; sm: number };
  containerConfig?: {
    minWidth?: number; // 最小容器宽度
    maxWidth?: number; // 最大容器宽度
    adaptive?: boolean; // 是否自适应宽度
  };
}
```

### 容器宽度控制

- **默认模式**: 使用 Tailwind 的 `max-w-7xl` 类
- **自适应模式**: 使用 CSS 的 `minWidth` 和 `maxWidth` 属性
- **动态切换**: 根据预设自动应用相应的容器样式

## 最佳实践

### 选择建议

- **通用应用**: 使用 `Default` 配置，适合大多数场景
- **设计稿还原**: 选择 `Fixed Layout`，确保布局精确一致
- **大屏显示**: `Fixed Layout` 适合大屏显示器和演示环境

### 测试建议

1. **多设备测试**: 在不同尺寸的设备上测试各个预设
2. **窗口拖拽**: 拖拽浏览器窗口观察响应式变化
3. **内容适配**: 确保内容在所有断点下都能正常显示
4. **性能监控**: 注意不同配置下的渲染性能

### 自定义扩展

如需添加新的预设配置，请编辑 `src/config/breakpointPresets.ts` 文件：

```typescript
{
  id: 'custom',
  name: 'Custom Configuration',
  description: '自定义配置说明',
  breakpoints: { lg: 1200, md: 800, sm: 600 },
  cols: { lg: 12, md: 8, sm: 4 },
  containerConfig: {
    minWidth: 1000,
    maxWidth: 1400,
    adaptive: true
  }
}
```

## 更新日志

- **v1.0.0**: 初始版本，包含 6 个基础预设
- **v1.1.0**: 新增 `Experimental` 试验配置，支持容器宽度自适应
- **v1.1.1**: 优化设置菜单 UI，添加容器配置信息显示

---

💡 **提示**: 更改断点配置会重置当前布局，请在切换前保存重要的布局调整。
