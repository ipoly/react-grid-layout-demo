# React Aria Components 文档

React Aria 是一个提供无样式、可访问性和功能完整的 React Hooks 库，用于构建现代 React 应用程序的 UI 组件。

## 核心特性

- 🎯 **无样式设计** - 完全控制组件样式，不受预设样式限制
- ♿ **内置可访问性** - 遵循 WAI-ARIA 标准，支持辅助技术
- 🔄 **复杂交互处理** - 处理键盘、鼠标、触摸等多种输入
- 🌍 **国际化支持** - 内置 i18n，支持多语言和地区
- 📱 **响应式设计** - 适配各种设备和屏幕尺寸

## 安装和使用

### 安装

```bash
npm install react-aria-components
```

### 基本使用

```jsx
import { useButton } from '@react-aria/button';

function MyButton(props) {
  let ref = React.useRef();
  let { buttonProps } = useButton(props, ref);
  return (
    <button {...buttonProps} ref={ref}>
      {props.children}
    </button>
  );
}
```

## 组件分类

### 按钮组件

```jsx
import { useButton, useToggleButton } from '@react-aria/button';

// 基础按钮
function BasicButton(props) {
  let ref = React.useRef();
  let { buttonProps } = useButton(props, ref);
  return (
    <button {...buttonProps} ref={ref}>
      {props.children}
    </button>
  );
}

// 切换按钮
function ToggleButton(props) {
  let ref = React.useRef();
  let { isPressed, buttonProps } = useToggleButton(props, ref);
  return (
    <button
      {...buttonProps}
      ref={ref}
      style={{ backgroundColor: isPressed ? 'lightgray' : 'white' }}
    >
      {props.children}
    </button>
  );
}
```

### 表单组件

- **Checkbox** - 复选框组件
- **CheckboxGroup** - 复选框组
- **Form** - 表单容器
- **NumberField** - 数字输入
- **RadioGroup** - 单选按钮组
- **SearchField** - 搜索输入
- **Slider** - 滑块组件
- **Switch** - 开关组件
- **TextField** - 文本输入

### 导航组件

- **Breadcrumbs** - 面包屑导航
- **Link** - 链接组件
- **Tabs** - 标签页组件

### 覆盖层组件

- **Dialog** - 对话框
- **Modal** - 模态框
- **Popover** - 弹出框
- **Tooltip** - 工具提示

### 选择器组件

- **ComboBox** - 组合框
- **Select** - 选择器
- **Autocomplete** - 自动完成（测试版）

### 状态组件

- **Meter** - 进度表
- **ProgressBar** - 进度条
- **Toast** - 提示消息

## 可访问性属性

### 基础 ARIA 属性

```jsx
// 基础可访问性属性
const accessibilityProps = {
  id: 'unique-identifier',
  'aria-label': 'Button description',
  'aria-labelledby': 'label-element-id',
  'aria-describedby': 'description-element-id',
  'aria-details': 'detailed-description-id',
};
```

### 状态和控制属性

```jsx
// 状态控制属性
const stateProps = {
  'aria-expanded': true, // 展开/折叠状态
  'aria-controls': 'controlled-element-id', // 控制的元素
  'aria-pressed': 'mixed', // 按钮按下状态
  'aria-haspopup': 'menu', // 弹出元素类型
};

// 焦点控制
const focusProps = {
  excludeFromTabOrder: false, // 是否排除在 Tab 序列外
  preventFocusOnPress: false, // 是否防止按压时聚焦
  autoFocus: true, // 是否自动聚焦
};
```

## 高级示例

### 自定义开关组件

```jsx
import { VisuallyHidden, useFocusRing, useSwitch } from 'react-aria';
import { useToggleState } from 'react-stately';

function CustomSwitch(props) {
  let state = useToggleState(props);
  let ref = React.useRef(null);
  let { inputProps } = useSwitch(props, state, ref);
  let { isFocusVisible, focusProps } = useFocusRing();

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        opacity: props.isDisabled ? 0.4 : 1,
      }}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <svg width={40} height={24} aria-hidden="true" style={{ marginRight: 4 }}>
        <rect
          x={4}
          y={4}
          width={32}
          height={16}
          rx={8}
          fill={state.isSelected ? 'orange' : 'gray'}
        />
        <circle cx={state.isSelected ? 28 : 12} cy={12} r={5} fill="white" />
        {isFocusVisible && (
          <rect
            x={1}
            y={1}
            width={38}
            height={22}
            rx={11}
            fill="none"
            stroke="orange"
            strokeWidth={2}
          />
        )}
      </svg>
      {props.children}
    </label>
  );
}
```

### 地标组件示例

```jsx
import { useLandmark } from 'react-aria';

function Navigation(props) {
  let ref = React.useRef(null);
  let { landmarkProps } = useLandmark({ ...props, role: 'navigation' }, ref);
  return (
    <nav ref={ref} {...props} {...landmarkProps}>
      {props.children}
    </nav>
  );
}

function SearchForm(props) {
  let ref = React.useRef(null);
  let { landmarkProps } = useLandmark({ ...props, role: 'search' }, ref);
  return (
    <form ref={ref} {...props} {...landmarkProps}>
      <h2 id="search-header">搜索</h2>
      <input aria-labelledby="search-header" type="search" />
    </form>
  );
}
```

### 对话框组件

```jsx
import { useDialog } from 'react-aria';

interface DialogProps {
  title?: React.ReactNode;
  children: React.ReactNode;
}

function Dialog({ title, children, ...props }: DialogProps) {
  let ref = React.useRef(null);
  let { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <div {...dialogProps} ref={ref} style={{ padding: 30 }}>
      {title && (
        <h3 {...titleProps} style={{ marginTop: 0 }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
```

## Hook 分类

### 交互 Hooks

- `useFocus` - 焦点管理
- `useFocusVisible` - 键盘焦点可见性
- `useFocusWithin` - 焦点区域检测
- `useHover` - 悬停交互
- `useKeyboard` - 键盘事件
- `useLongPress` - 长按交互
- `useMove` - 移动交互
- `usePress` - 按压交互

### 拖拽 Hooks

- `useClipboard` - 剪贴板操作
- `useDrag` - 拖拽源
- `useDraggableCollection` - 可拖拽集合
- `useDrop` - 拖放目标
- `useDroppableCollection` - 可拖放集合

### 焦点管理

- `FocusRing` - 焦点环组件
- `FocusScope` - 焦点范围
- `useFocusRing` - 焦点环 Hook

### 国际化 Hooks

- `I18nProvider` - 国际化提供者
- `useCollator` - 文本排序
- `useDateFormatter` - 日期格式化
- `useFilter` - 过滤功能
- `useLocale` - 语言区域
- `useNumberFormatter` - 数字格式化

### 工具 Hooks

- `PortalProvider` - 门户提供者
- `VisuallyHidden` - 视觉隐藏
- `mergeProps` - 属性合并
- `useField` - 字段管理
- `useId` - 唯一 ID 生成
- `useLabel` - 标签关联
- `useObjectRef` - 对象引用

## 服务端渲染支持

```jsx
import { SSRProvider, useIsSSR } from 'react-aria';

function App() {
  return (
    <SSRProvider>
      <MyApplication />
    </SSRProvider>
  );
}

function MyComponent() {
  let isSSR = useIsSSR();

  if (isSSR) {
    return <div>服务端渲染中...</div>;
  }

  return <div>客户端已加载</div>;
}
```

## 版本信息

- 当前项目使用版本：**v1.11.0**
- 代码示例数量：**27个**
- 信任度评分：**7.5/10**

## 相关文档

- [API 参考](./api-reference.md)
- [最佳实践](./best-practices.md)
- [示例代码](./examples.md)
