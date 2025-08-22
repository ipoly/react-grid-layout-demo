/**
 * 网格系统统一配置
 * 所有使用网格布局的组件都应该使用这些配置，以保持一致性
 * 包括 React Grid Layout 和 CSS Grid 组件
 */

export const GRID_CONFIG = {
  // 行高（像素）
  // 用于 React Grid Layout 的 rowHeight 属性
  ROW_HEIGHT: 68,

  // 间距 [水平, 垂直]（像素）
  // 用于 React Grid Layout 的 margin 属性
  MARGIN: [16, 16] as [number, number],

  // 容器内边距 [水平, 垂直]（像素）
  // 用于 React Grid Layout 的 containerPadding 属性
  CONTAINER_PADDING: [0, 0] as [number, number],

  // CSS Grid 的 gap 值
  // 对应 Tailwind 的 gap-4 (16px)
  GAP: 4,

  // CSS 值（用于 CSS 变量）
  CSS_GAP: '16px',
  CSS_ROW_HEIGHT: '68px',

  // 断点配置
  // 用于响应式网格布局
  BREAKPOINTS: {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
  },

  // 主布局列数配置
  // 12列网格系统，移动端单列
  MAIN_COLS: {
    lg: 12,
    md: 12,
    sm: 12,
    xs: 1,
    xxs: 1,
  },

  // 嵌套布局列数配置
  // 单列垂直排列
  NESTED_COLS: {
    lg: 1,
    md: 1,
    sm: 1,
    xs: 1,
    xxs: 1,
  },

  // TopPane 列数配置
  TOP_COLS: {
    lg: 4,
    md: 4,
    sm: 2,
    xs: 1,
    xxs: 1,
  },
} as const;

// 类型导出
export type GridBreakpoints = typeof GRID_CONFIG.BREAKPOINTS;
export type GridCols = typeof GRID_CONFIG.MAIN_COLS;
