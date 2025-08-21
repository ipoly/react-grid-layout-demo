# TypeScript 文档

TypeScript 是 JavaScript 的超集，为应用级别的 JavaScript 开发添加了静态类型，支持大规模 JavaScript 应用的工具和错误检查。

## 核心特性

- 🔒 **静态类型** - 编译时类型检查，减少运行时错误
- 💡 **智能提示** - 增强的 IDE 支持和自动补全
- 🔧 **渐进式采用** - 与现有 JavaScript 代码完全兼容
- 🎯 **目标灵活** - 可编译到多种 JavaScript 版本
- 📦 **丰富生态** - 大量类型定义和工具支持

## 安装和配置

### 全局安装

```bash
npm install -g typescript
```

### 项目安装

```bash
# 作为开发依赖安装
npm install --save-dev typescript

# 同时安装 Node.js 类型定义
npm install --save-dev @types/node
```

### 初始化配置

```bash
# 生成 tsconfig.json
tsc --init
```

## 基本类型

### 基础类型

```typescript
// 基本类型
let isDone: boolean = false;
let count: number = 42;
let message: string = 'Hello World';

// 数组
let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];

// 元组
let x: [string, number];
x = ['hello', 10];

// 枚举
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;

// Any 和 Unknown
let notSure: any = 4;
let value: unknown = 42;

// Void 和 Null
function warnUser(): void {
  console.log('This is a warning message');
}
```

## 接口和类型

### 接口定义

```typescript
// 基本接口
interface User {
  name: string;
  age: number;
  email?: string; // 可选属性
  readonly id: number; // 只读属性
}

// 函数接口
interface SearchFunc {
  (source: string, subString: string): boolean;
}

// 可索引的接口
interface StringArray {
  [index: number]: string;
}

// 类接口
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}
```

### 泛型接口

```typescript
// 基本泛型接口
interface GenericInterface<T> {
  value: T;
  getValue(): T;
}

// 约束泛型
interface Lengthwise {
  length: number;
}

interface ConstrainedGeneric<T extends Lengthwise> {
  data: T;
}

// 默认泛型类型
interface DefaultGeneric<T = string> {
  data: T;
}
```

### 类型别名

```typescript
// 基本类型别名
type StringOrNumber = string | number;
type StringArray = Array<string>;

// 对象类型别名
type Point = {
  x: number;
  y: number;
};

// 函数类型别名
type Handler = (event: Event) => void;

// 泛型类型别名
type Container<T> = { value: T };

// 条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
```

## 高级类型

### 映射类型

```typescript
// Partial - 所有属性可选
type PartialUser = Partial<User>;

// Required - 所有属性必需
type RequiredUser = Required<User>;

// Readonly - 所有属性只读
type ReadonlyUser = Readonly<User>;

// Pick - 选择部分属性
type UserBasicInfo = Pick<User, 'name' | 'age'>;

// Omit - 排除部分属性
type UserWithoutId = Omit<User, 'id'>;

// Record - 创建记录类型
type UserRoles = Record<string, User>;
```

### 条件类型

```typescript
// 基本条件类型
type IsString<T> = T extends string ? true : false;

// 复杂条件类型
type ApiResponse<T> = T extends { success: true }
  ? { data: T['data'] }
  : { error: string };

// 内置条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

## React 中的 TypeScript

### 组件类型

```typescript
import React from 'react';

// 函数组件
interface Props {
    name: string;
    age?: number;
    children?: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ name, age, children }) => {
    return <div>{name} is {age} years old</div>;
};

// 类组件
interface State {
    count: number;
}

class Counter extends React.Component<Props, State> {
    state = { count: 0 };

    render() {
        return <div>Count: {this.state.count}</div>;
    }
}
```

### 事件处理

```typescript
// 事件处理器类型
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Button clicked');
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log('Input value:', event.target.value);
};

// 表单提交
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  // 处理表单提交
};
```

### Ref 类型

```typescript
import { useRef } from 'react';

// DOM 元素引用
const inputRef = useRef<HTMLInputElement>(null);

// 组件引用
const componentRef = useRef<MyComponent>(null);

// 可变值引用
const countRef = useRef<number>(0);
```

## 配置文件

### tsconfig.json 基本配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

### 项目特定配置

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/utils/*": ["src/utils/*"]
    },
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

## 性能优化建议

### 接口 vs 类型别名

```typescript
// ✅ 推荐：使用接口进行对象类型组合
interface Foo {
  prop: string;
}
interface FooExtended extends Foo {
  someProp: string;
}

// ❌ 避免：使用交叉类型
type FooIntersection = Foo & {
  someProp: string;
};
```

### 条件类型优化

```typescript
// ❌ 复杂的条件类型会影响性能
interface SomeType<T> {
  foo<U>(
    x: U
  ): U extends TypeA<T>
    ? ProcessTypeA<U, T>
    : U extends TypeB<T>
      ? ProcessTypeB<U, T>
      : U extends TypeC<T>
        ? ProcessTypeC<U, T>
        : U;
}

// ✅ 简化条件类型或使用重载
interface SomeType<T> {
  foo<U extends TypeA<T>>(x: U): ProcessTypeA<U, T>;
  foo<U extends TypeB<T>>(x: U): ProcessTypeB<U, T>;
  foo<U extends TypeC<T>>(x: U): ProcessTypeC<U, T>;
  foo<U>(x: U): U;
}
```

## 版本信息

- 当前项目使用版本：**v5.8.3**
- 代码示例数量：**19177个**
- 信任度评分：**9.9/10**

## 相关文档

- [配置参考](./api-reference.md)
- [最佳实践](./best-practices.md)
- [示例代码](./examples.md)
