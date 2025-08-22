import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Layout } from 'react-grid-layout';

import { STORAGE_KEYS } from '../config/storage';
import { Activities } from './business/activities/Activities';
import { Events } from './business/widgets/Events';
import { RecentPlans } from './business/widgets/RecentPlans';
import { Tasks } from './business/widgets/Tasks';
import { Workflows } from './business/widgets/Workflows';
import { DualPaneLayout } from './layouts/DualPaneLayout';
import { SidebarLayout } from './layouts/SidebarLayout';
import type { SidebarWidget } from './layouts/SidebarLayout';

interface WorkspaceLayoutProps {
  isDragging: boolean;
  isResizing: boolean;
  isMobile: boolean;
  onDragStart: () => void;
  onDragStop: () => void;
  onResizeStart: () => void;
  onResizeStop: () => void;
}

export const WorkspaceLayout = ({
  isDragging,
  isResizing,
  isMobile,
  onDragStart,
  onDragStop,
  onResizeStart,
  onResizeStop,
}: WorkspaceLayoutProps) => {
  // Activities 的宽度（列数）
  const getInitialActivitiesWidth = () => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES_COLUMNS);
    if (saved) {
      const width = parseInt(saved, 10);
      if (width >= 4 && width <= 10) {
        return width;
      }
    }
    return 8; // 默认 8 列
  };

  const [activitiesWidth, setActivitiesWidth] = useState(
    getInitialActivitiesWidth()
  );

  // 侧边栏小部件配置
  const sidebarWidgets: SidebarWidget[] = useMemo(
    () => [
      {
        id: 'recent-plans',
        component: <RecentPlans />,
        defaultHeight: 7,
        minHeight: 2,
        maxHeight: 10,
      },
      {
        id: 'tasks',
        component: <Tasks />,
        defaultHeight: 6,
        minHeight: 2,
        maxHeight: 8,
      },
      {
        id: 'events',
        component: <Events />,
        defaultHeight: 6,
        minHeight: 2,
        maxHeight: 8,
      },
      {
        id: 'workflows',
        component: <Workflows />,
        defaultHeight: 6,
        minHeight: 2,
        maxHeight: 8,
      },
    ],
    []
  );

  // 动态计算默认高度
  const defaultSidebarHeight = useMemo(
    () =>
      sidebarWidgets.reduce(
        (sum, widget) => sum + (widget.defaultHeight || 6),
        0
      ),
    [sidebarWidgets]
  );

  // 侧边栏高度（用于同步主布局高度）
  const [sidebarHeight, setSidebarHeight] = useState(defaultSidebarHeight);

  // 计算侧边栏宽度（总列数 - Activities宽度）
  const sidebarWidth = 12 - activitiesWidth;

  // 处理侧边栏布局变化
  const handleSidebarLayoutChange = useCallback((layout: Layout[]) => {
    // 使用第一个参数 layout（当前实际布局）来计算高度
    const maxBottom = layout.reduce((max, item) => {
      const bottom = item.y + item.h;
      return Math.max(max, bottom);
    }, 0);

    const newHeight = maxBottom || 1;

    // 更新侧边栏高度
    setSidebarHeight(newHeight);
    console.log('Sidebar height updated:', newHeight);
  }, []);

  // 处理 Activities 宽度变化
  const handleWidthChange = useCallback((width: number) => {
    const newActivitiesWidth = 12 - width; // 因为传入的是左面板宽度
    setActivitiesWidth(newActivitiesWidth);

    // 保存到 localStorage
    localStorage.setItem(
      STORAGE_KEYS.ACTIVITIES_COLUMNS,
      newActivitiesWidth.toString()
    );
  }, []);

  // 重置布局（通过 window 全局方法调用）
  useEffect(() => {
    const resetWorkspaceLayout = () => {
      setActivitiesWidth(8); // 重置Activities宽度
      setSidebarHeight(25); // 重置高度

      // 删除 localStorage 中的数据
      localStorage.removeItem(STORAGE_KEYS.SIDE_LAYOUTS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES_COLUMNS);

      // 重置子组件布局
      const windowWithReset = window as Window & {
        __resetSidebarLayout?: { [key: string]: () => void };
        __resetDualPaneLayout?: { [key: string]: () => void };
      };

      // 触发侧边栏重置
      if (windowWithReset.__resetSidebarLayout?.['sidebar-layout']) {
        windowWithReset.__resetSidebarLayout['sidebar-layout']();
      }

      // 触发双面板重置
      if (windowWithReset.__resetDualPaneLayout?.['workspace-dual-pane']) {
        windowWithReset.__resetDualPaneLayout['workspace-dual-pane']();
      }
    };

    // 将重置函数挂载到 window 对象
    const windowWithReset = window as Window & {
      __resetWorkspaceLayout?: () => void;
    };
    windowWithReset.__resetWorkspaceLayout = resetWorkspaceLayout;

    return () => {
      delete windowWithReset.__resetWorkspaceLayout;
    };
  }, []);

  // 移动端使用简单的垂直布局
  if (isMobile) {
    return (
      <div className="w-full space-y-4">
        {/* 先显示 Activities */}
        <div className="bg-transparent">
          <Activities />
        </div>
        {/* 然后显示侧边栏小部件（折叠状态） */}
        <SidebarLayout
          widgets={sidebarWidgets}
          width={1}
          storageKey={STORAGE_KEYS.SIDE_LAYOUTS}
          collapsible
          defaultCollapsed
          reorderable={false}
          resizable={false}
          isMobile={true}
          className="w-full"
        />
      </div>
    );
  }

  // 桌面端使用双面板布局
  return (
    <DualPaneLayout
      // 布局配置
      leftPaneWidth={sidebarWidth}
      minLeftWidth={2}
      maxLeftWidth={8}
      totalColumns={12}
      // 内容
      leftContent={
        <SidebarLayout
          widgets={sidebarWidgets}
          width={1}
          storageKey={STORAGE_KEYS.SIDE_LAYOUTS}
          reorderable={true}
          resizable={!isMobile}
          onLayoutChange={handleSidebarLayoutChange}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          isDragging={isDragging}
          isResizing={isResizing}
          isMobile={isMobile}
        />
      }
      rightContent={<Activities />}
      // 交互控制
      resizable={!isMobile}
      resizeHandlePosition="right"
      onWidthChange={handleWidthChange}
      // 响应式
      breakpoint={1200}
      stackedOnTablet={false}
      stackedOrder="left-first"
      // 持久化
      storageKey="workspace-dual-pane"
      // 状态
      isDragging={isDragging}
      isResizing={isResizing}
      isMobile={isMobile}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      // 高度管理
      height={sidebarHeight}
      defaultHeight={defaultSidebarHeight}
      // 样式
      className="w-full"
    />
  );
};
