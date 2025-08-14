# React Grid Layout Demo

> React Grid Layout + Untitled UI 仪表板演示项目

[![Deploy to GitHub Pages](https://github.com/ipoly/react-grid-layout-demo/actions/workflows/deploy.yml/badge.svg)](https://github.com/ipoly/react-grid-layout-demo/actions/workflows/deploy.yml)
[![在线演示](https://img.shields.io/badge/在线-演示-blue)](https://ipoly.github.io/react-grid-layout-demo/)

## 功能特点

- 拖拽式网格布局，支持调整组件位置和大小
- 响应式设计，适配桌面端、平板和移动端
- 布局配置持久化保存
- 7种断点预设配置
- 基于 Untitled UI React 组件库

## 技术栈

- **前端**: React 19.1 + TypeScript 5.8
- **构建**: Vite 7.1.2
- **样式**: Tailwind CSS v4
- **布局**: react-grid-layout 1.5.2
- **组件**: Untitled UI React
- **工具**: ESLint + Prettier + Husky

### 项目结构

```
src/
├── components/                 # 业务组件
│   ├── Activities.tsx          # 活动列表组件
│   ├── AssetsMetric.tsx        # 资产指标卡片
│   ├── ClientsMetric.tsx       # 客户指标卡片
│   ├── Events.tsx              # 事件列表
│   ├── Header.tsx              # 顶部导航栏
│   ├── MetricCard.tsx          # 通用指标卡片
│   ├── PlansMetric.tsx         # 计划指标卡片
│   ├── RecentPlans.tsx         # 最近计划
│   ├── SettingsMenu.tsx        # 设置菜单
│   ├── Tasks.tsx               # 任务列表
│   ├── TasksMetric.tsx         # 任务指标卡片
│   └── WelcomeSection.tsx      # 欢迎区块
├── config/
│   └── breakpointPresets.ts    # 断点预设配置
├── hooks/                      # 自定义 Hook
│   ├── use-breakpoint.ts       # 断点检测
│   ├── use-clipboard.ts        # 剪贴板操作
│   └── use-resize-observer.ts  # 元素大小监听
├── untitled_ui/                # Untitled UI 组件库
│   ├── base/                   # 基础组件
│   ├── application/            # 应用组件
│   ├── foundations/            # 基础元素
│   ├── marketing/              # 营销组件
│   └── shared-assets/          # 共享资源
├── lib/utils.ts                # 工具函数
├── utils/                      # 辅助工具
│   ├── cx.ts                   # 样式合并
│   └── is-react-component.ts   # 组件检测
└── App.tsx                     # 主应用入口
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 代码检查
pnpm lint
pnpm format
```

## 组件说明

### 仪表板组件

- 指标卡片：客户、任务、资产、计划
- 数据列表：任务列表、事件列表、最近计划
- 活动面板：用户活动日志
- 设置面板：断点预设切换

### 断点预设

支持 7 种预设配置：

- `default` - Bootstrap 风格 (1200/996/768)
- `tailwind` - Tailwind CSS (1024/768/640)
- `material` - Material Design (1280/960/600)
- `compact` - 紧凑模式 (1024/768/480)
- `wide` - 宽屏优化 (1440/1200/768)
- `mobile-first` - 移动优先 (992/576/320)
- `experimental` - 实验性配置

## 组件使用

### Untitled UI 组件

```tsx
import { Avatar } from '@/untitled_ui/base/avatar/avatar';
import { Badge } from '@/untitled_ui/base/badges/badges';
import { Button } from '@/untitled_ui/base/buttons/button';

<MetricCard
  title="客户总数"
  value="2,420"
  change={{
    value: '18%',
    type: 'positive',
    period: 'last month',
  }}
  icon={<Users className="w-5 h-5 text-blue-600" />}
/>;
```

## 配置说明

### Tailwind CSS v4

使用 CSS-first 配置，无需 `tailwind.config.js`：

```css
@import 'tailwindcss';

@theme {
  --color-brand: 220 100% 50%;
}
```

### 部署配置

通过 GitHub Actions 自动部署到 GitHub Pages，访问地址：
https://ipoly.github.io/react-grid-layout-demo/

## 使用说明

### 布局操作

- 拖拽组件调整位置（桌面端）
- 拖拽组件右下角调整大小
- 通过设置菜单切换断点预设
- 布局自动保存到 localStorage

### 相关链接

- [React Grid Layout](https://github.com/react-grid-layout/react-grid-layout)
- [Untitled UI React](https://www.untitledui.com/react)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

---

**维护者**: [ipoly](https://github.com/ipoly) | **许可证**: MIT
