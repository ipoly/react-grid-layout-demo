# React Grid Layout 文档

React-Grid-Layout 是一个专为 React 设计的响应式网格布局系统，支持断点和用户定义或自动生成的布局。

## 核心特性

- 🎯 **响应式设计** - 基于断点的自适应布局
- 🖱️ **拖拽支持** - 完全可拖拽的网格项
- 📏 **调整大小** - 灵活的大小调整功能
- ⚡ **高性能** - 使用 CSS Transform 优化渲染
- 🔧 **高度可配置** - 丰富的配置选项

## 安装

```bash
npm install react-grid-layout
```

## 必需的样式文件

```javascript
// 导入必要的样式文件
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
```

## 基本使用

### 静态布局

```javascript
import GridLayout from 'react-grid-layout';

class MyFirstGrid extends React.Component {
  render() {
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
      >
        <div key="a">a</div>
        <div key="b">b</div>
        <div key="c">c</div>
      </GridLayout>
    );
  }
}
```

### 响应式布局

```javascript
import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

class MyResponsiveGrid extends React.Component {
  render() {
    const layouts = getLayoutsFromSomewhere();
    return (
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      >
        <div key="1">1</div>
        <div key="2">2</div>
        <div key="3">3</div>
      </ResponsiveGridLayout>
    );
  }
}
```

## 版本信息

- 当前项目使用版本：**v1.5.2**
- 代码示例数量：**14个**
- 信任度评分：**6.7/10**

## 相关文档

- [API 参考](./api-reference.md)
- [最佳实践](./best-practices.md)
- [示例代码](./examples.md)
