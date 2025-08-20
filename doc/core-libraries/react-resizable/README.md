# React Resizable 文档

React Resizable 是一个简单的 React 组件，允许元素通过一个或多个拖拽手柄进行大小调整，提供原始组件和便捷的盒子组件用于基本使用场景。

## 核心特性

- 🎯 **灵活调整** - 支持多个调整手柄位置
- 🖱️ **拖拽调整** - 流畅的鼠标拖拽体验
- 📏 **尺寸约束** - 支持最小/最大尺寸限制
- ⚡ **高性能** - CSS Transform 优化
- 🔧 **高度可配置** - 丰富的配置选项

## 安装

```bash
npm install react-resizable
```

## 必需样式

```javascript
// 导入必要的样式
import '/node_modules/react-resizable/css/styles.css';
```

## 基本使用

### 简单可调整大小的盒子

```javascript
import { Resizable } from 'react-resizable';

function ResizableBox() {
  const [size, setSize] = useState({ width: 200, height: 200 });

  return (
    <Resizable
      width={size.width}
      height={size.height}
      onResize={(e, { size }) => setSize(size)}
    >
      <div style={{ width: size.width, height: size.height }}>
        可调整大小的内容
      </div>
    </Resizable>
  );
}
```

### 带约束的调整

```javascript
import { Resizable } from 'react-resizable';

function ConstrainedResizable() {
  const [size, setSize] = useState({ width: 200, height: 200 });

  return (
    <Resizable
      width={size.width}
      height={size.height}
      minConstraints={[100, 100]}
      maxConstraints={[400, 300]}
      onResize={(e, { size }) => setSize(size)}
    >
      <div
        style={{
          width: size.width,
          height: size.height,
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        约束调整: 100x100 到 400x300
      </div>
    </Resizable>
  );
}
```

### 自定义调整手柄

```javascript
import { Resizable } from 'react-resizable';

function CustomHandleResizable() {
  const [size, setSize] = useState({ width: 200, height: 200 });

  return (
    <Resizable
      width={size.width}
      height={size.height}
      resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
      onResize={(e, { size }) => setSize(size)}
    >
      <div
        style={{
          width: size.width,
          height: size.height,
          border: '2px solid #007bff',
          backgroundColor: '#f8f9fa',
        }}
      >
        八个方向调整
      </div>
    </Resizable>
  );
}
```

## 调整手柄位置

支持的调整手柄位置：

- `'s'` - 南（下中）
- `'w'` - 西（左中）
- `'e'` - 东（右中）
- `'n'` - 北（上中）
- `'sw'` - 西南（左下）
- `'nw'` - 西北（左上）
- `'se'` - 东南（右下）- 默认
- `'ne'` - 东北（右上）

## 与 React Grid Layout 集成

React Resizable 是 React Grid Layout 的核心依赖，也可以独立使用：

```javascript
// 在网格项中使用
function GridItemWithResize({ children }) {
  return (
    <div data-grid={{ x: 0, y: 0, w: 2, h: 2 }}>
      <Resizable width={200} height={200} onResize={handleResize}>
        <div>{children}</div>
      </Resizable>
    </div>
  );
}
```

## 高级用法

### ResizableBox 组件

```javascript
import { ResizableBox } from 'react-resizable';

function SimpleResizableBox() {
  return (
    <ResizableBox
      width={200}
      height={200}
      minConstraints={[150, 150]}
      maxConstraints={[500, 300]}
    >
      <div>便捷的 ResizableBox</div>
    </ResizableBox>
  );
}
```

### 锁定宽高比

```javascript
function AspectRatioResizable() {
  const [size, setSize] = useState({ width: 200, height: 200 });

  const onResize = (e, { size: newSize }) => {
    // 保持 1:1 宽高比
    const minSide = Math.min(newSize.width, newSize.height);
    setSize({ width: minSide, height: minSide });
  };

  return (
    <Resizable
      width={size.width}
      height={size.height}
      onResize={onResize}
      lockAspectRatio
    >
      <div style={{ width: size.width, height: size.height }}>锁定宽高比</div>
    </Resizable>
  );
}
```

## 事件处理

### 调整事件

```javascript
function ResizableWithEvents() {
  const [size, setSize] = useState({ width: 200, height: 200 });

  const handleResizeStart = () => {
    console.log('开始调整大小');
  };

  const handleResize = (e, { size }) => {
    console.log('调整中:', size);
    setSize(size);
  };

  const handleResizeStop = (e, { size }) => {
    console.log('调整结束:', size);
  };

  return (
    <Resizable
      width={size.width}
      height={size.height}
      onResizeStart={handleResizeStart}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
    >
      <div style={{ width: size.width, height: size.height }}>
        带事件处理的调整
      </div>
    </Resizable>
  );
}
```

## 版本信息

- 当前项目使用版本：**v3.0.5**
- 代码示例数量：**10个**
- 信任度评分：**6.7/10**

## 使用场景

- **独立调整组件** - 图片、视频、面板等大小调整
- **网格系统集成** - 作为 React Grid Layout 的底层支持
- **布局编辑器** - 所见即所得编辑器中的元素调整
- **仪表板组件** - 用户可自定义大小的小部件

## 相关文档

- [API 参考](./api-reference.md)
- [最佳实践](./best-practices.md)
- [示例代码](./examples.md)
- [与 React Grid Layout 集成](../../integration-guides/resizable-components-guide.md)
