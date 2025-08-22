import { useCallback, useEffect, useMemo, useState } from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';

import { GRID_CONFIG } from '../config/grid';
import { STORAGE_KEYS } from '../config/storage';
import { Activities } from './business/activities/Activities';
import { Events } from './business/widgets/Events';
import { RecentPlans } from './business/widgets/RecentPlans';
import { Tasks } from './business/widgets/Tasks';
import { Workflows } from './business/widgets/Workflows';
import { CustomResizeHandle } from './ui/CustomResizeHandle';

const ResponsiveGridLayout = WidthProvider(Responsive);

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
  // 使用统一的网格配置
  const mainCols = GRID_CONFIG.MAIN_COLS;
  const mainBreakpoints = GRID_CONFIG.BREAKPOINTS;
  const nestedCols = GRID_CONFIG.NESTED_COLS;

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
  const [isResizingMainpane, setIsResizingMainpane] = useState(false);

  // 计算侧边栏宽度（总列数 - Activities宽度）
  const sidebarWidth = 12 - activitiesWidth;

  // 计算嵌套网格的实际高度需求
  const calculateNestedGridHeight = useCallback((layouts: Layouts) => {
    // 获取当前断点的布局，优先使用 lg
    const currentLayout = layouts.lg || layouts.md || layouts.sm;
    if (!currentLayout || currentLayout.length === 0) return 1;

    // 计算最大的 y + h 值
    const maxBottom = currentLayout.reduce((max, item) => {
      const bottom = item.y + item.h;
      return Math.max(max, bottom);
    }, 0);

    return maxBottom || 1; // 返回总行数，至少为1
  }, []);

  // 临时使用25作为初始高度（稍后会从defaultNestedLayouts计算）
  const [sidepaneHeight, setSidepaneHeight] = useState(25);

  // 主布局配置 - 包含侧边栏（sidebar）和主面板（activities）
  const mainLayouts: Layouts = useMemo(
    () => ({
      lg: [
        {
          i: 'sidepane',
          x: 0,
          y: 0,
          w: sidebarWidth,
          h: sidepaneHeight, // 使用动态高度
          static: true, // 静态，不可拖拽或调整
        },
        {
          i: 'mainpane',
          x: sidebarWidth,
          y: 0,
          w: activitiesWidth,
          h: sidepaneHeight, // 使用动态高度
          isDraggable: false, // 不可拖拽位置
          isResizable: true, // 可调整大小
          resizeHandles: ['w'], // 只有左手柄
          minW: 4,
          maxW: 10,
        },
      ],
      md: [
        {
          i: 'sidepane',
          x: 0,
          y: 0,
          w: sidebarWidth,
          h: 1,
          static: true,
        },
        {
          i: 'mainpane',
          x: sidebarWidth,
          y: 0,
          w: activitiesWidth,
          h: 1,
          isDraggable: false,
          isResizable: true,
          resizeHandles: ['w'],
          minW: 4,
          maxW: 10,
        },
      ],
      sm: [
        {
          i: 'sidepane',
          x: 0,
          y: 0,
          w: sidebarWidth,
          h: 1,
          static: true,
        },
        {
          i: 'mainpane',
          x: sidebarWidth,
          y: 0,
          w: activitiesWidth,
          h: 1,
          isDraggable: false,
          isResizable: true,
          resizeHandles: ['w'],
          minW: 4,
          maxW: 10,
        },
      ],
    }),
    [activitiesWidth, sidebarWidth, sidepaneHeight]
  );

  // 嵌套布局配置 - 左侧小部件
  const defaultNestedLayouts: Layouts = useMemo(
    () => ({
      lg: [
        {
          i: 'recent-plans',
          x: 0,
          y: 0,
          w: 1,
          h: 7,
          minW: 1,
          maxW: 1,
          minH: 2,
          maxH: 10,
          resizeHandles: ['s'],
        },
        {
          i: 'tasks',
          x: 0,
          y: 7,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
          minH: 2,
          maxH: 8,
          resizeHandles: ['s'],
        },
        {
          i: 'events',
          x: 0,
          y: 13,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
          minH: 2,
          maxH: 8,
          resizeHandles: ['s'],
        },
        {
          i: 'workflows',
          x: 0,
          y: 19,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
          minH: 2,
          maxH: 8,
          resizeHandles: ['s'],
        },
      ],
      md: [
        {
          i: 'recent-plans',
          x: 0,
          y: 0,
          w: 1,
          h: 7,
          minW: 1,
          maxW: 1,
          minH: 2,
          maxH: 10,
          resizeHandles: ['s'],
        },
        {
          i: 'tasks',
          x: 0,
          y: 7,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
          minH: 2,
          maxH: 8,
          resizeHandles: ['s'],
        },
        {
          i: 'events',
          x: 0,
          y: 13,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
          minH: 2,
          maxH: 8,
          resizeHandles: ['s'],
        },
        {
          i: 'workflows',
          x: 0,
          y: 19,
          w: 1,
          h: 6,
          minW: 1,
          maxW: 1,
          minH: 2,
          maxH: 8,
          resizeHandles: ['s'],
        },
      ],
      sm: [
        {
          i: 'recent-plans',
          x: 0,
          y: 0,
          w: 1,
          h: 7,
          minW: 1,
          maxW: 1,
          minH: 2,
          maxH: 10,
          resizeHandles: ['s'],
        },
        {
          i: 'tasks',
          x: 0,
          y: 7,
          w: 1,
          h: 5,
          minW: 1,
          maxW: 1,
          minH: 2,
          maxH: 8,
          resizeHandles: ['s'],
        },
        {
          i: 'events',
          x: 0,
          y: 12,
          w: 1,
          h: 5,
          minW: 1,
          maxW: 1,
          minH: 2,
          maxH: 8,
          resizeHandles: ['s'],
        },
        {
          i: 'workflows',
          x: 0,
          y: 17,
          w: 1,
          h: 5,
          minW: 1,
          maxW: 1,
          minH: 2,
          maxH: 8,
          resizeHandles: ['s'],
        },
      ],
    }),
    []
  );

  // 从 localStorage 加载嵌套布局
  const loadSavedNestedLayouts = (): Layouts => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIDE_LAYOUTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lg) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load saved side pane layouts:', error);
    }
    return defaultNestedLayouts;
  };

  const [nestedLayouts, setNestedLayouts] = useState<Layouts>(
    loadSavedNestedLayouts
  );

  // 初始化时和布局加载后更新高度
  useEffect(() => {
    const initialHeight = calculateNestedGridHeight(nestedLayouts);
    if (initialHeight !== sidepaneHeight) {
      setSidepaneHeight(initialHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在组件挂载时运行一次，意图忽略依赖

  // 主布局变化处理 - 只处理 mainpane 的宽度调整
  const handleMainLayoutChange = useCallback(
    (layout: Layout[], _layouts: Layouts) => {
      const mainpaneItem = layout.find((item) => item.i === 'mainpane');
      if (mainpaneItem && mainpaneItem.w !== activitiesWidth) {
        const newWidth = mainpaneItem.w;
        setActivitiesWidth(newWidth);

        // 保存到 localStorage
        localStorage.setItem(
          STORAGE_KEYS.ACTIVITIES_COLUMNS,
          newWidth.toString()
        );
      }
    },
    [activitiesWidth]
  );

  // 嵌套布局变化处理 - 处理小部件的高度和顺序
  const handleNestedLayoutChange = useCallback(
    (layout: Layout[], layouts: Layouts) => {
      setNestedLayouts(layouts);

      // 使用第一个参数 layout 来计算高度（更准确的实时数据）
      const maxBottom = layout.reduce((max, item) => {
        const bottom = item.y + item.h;
        return Math.max(max, bottom);
      }, 0);

      const newHeight = maxBottom || 1;

      // 添加调试日志
      console.log('Layout changed, new height:', newHeight);

      // 直接设置新高度，React会处理相同值的情况
      setSidepaneHeight(newHeight);

      try {
        localStorage.setItem(
          STORAGE_KEYS.SIDE_LAYOUTS,
          JSON.stringify(layouts)
        );
      } catch (error) {
        console.error('Failed to save nested layouts:', error);
      }
    },
    [] // 移除依赖，避免闭包问题
  );

  // 处理 mainpane resize 开始
  const handleMainResizeStart = useCallback(() => {
    setIsResizingMainpane(true);
    onResizeStart();
  }, [onResizeStart]);

  // 处理 mainpane resize 结束
  const handleMainResizeStop = useCallback(() => {
    setIsResizingMainpane(false);
    onResizeStop();
  }, [onResizeStop]);

  // 重置布局（通过 window 全局方法调用）
  useEffect(() => {
    const resetWorkspaceLayout = () => {
      setActivitiesWidth(8); // 重置Activities宽度
      setNestedLayouts(defaultNestedLayouts);
      // 删除 localStorage 中的数据
      localStorage.removeItem(STORAGE_KEYS.SIDE_LAYOUTS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES_COLUMNS);
    };

    // 将重置函数挂载到 window 对象
    const windowWithReset = window as Window & {
      __resetWorkspaceLayout?: () => void;
    };
    windowWithReset.__resetWorkspaceLayout = resetWorkspaceLayout;

    return () => {
      delete windowWithReset.__resetWorkspaceLayout;
    };
  }, [defaultNestedLayouts]);

  // 移动端使用简单的垂直布局
  if (isMobile) {
    return (
      <div className="w-full">
        <div className="mb-4">
          <ResponsiveGridLayout
            className="layout"
            layouts={nestedLayouts}
            breakpoints={mainBreakpoints}
            cols={nestedCols}
            rowHeight={GRID_CONFIG.ROW_HEIGHT}
            margin={GRID_CONFIG.MARGIN}
            containerPadding={GRID_CONFIG.CONTAINER_PADDING}
            onLayoutChange={handleNestedLayoutChange}
            onDragStart={onDragStart}
            onDragStop={onDragStop}
            onResizeStart={onResizeStart}
            onResizeStop={onResizeStop}
            isDraggable={false}
            isResizable={false}
            compactType="vertical"
          >
            <div key="recent-plans" className="bg-transparent h-full">
              <RecentPlans />
            </div>
            <div key="tasks" className="bg-transparent h-full">
              <Tasks />
            </div>
            <div key="events" className="bg-transparent h-full">
              <Events />
            </div>
            <div key="workflows" className="bg-transparent h-full">
              <Workflows />
            </div>
          </ResponsiveGridLayout>
        </div>
        <div className="bg-transparent">
          <Activities />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className={`transition-all duration-200 ${
          isDragging || isResizing ? 'select-none' : ''
        }`}
      >
        <ResponsiveGridLayout
          className="main-layout"
          layouts={mainLayouts}
          breakpoints={mainBreakpoints}
          cols={mainCols}
          rowHeight={GRID_CONFIG.ROW_HEIGHT}
          margin={GRID_CONFIG.MARGIN}
          containerPadding={GRID_CONFIG.CONTAINER_PADDING}
          onLayoutChange={handleMainLayoutChange}
          onResizeStart={handleMainResizeStart}
          onResizeStop={handleMainResizeStop}
          isDraggable={false} // 主容器元素不可拖拽
          isResizable={!isMobile}
          compactType={null} // 不自动压缩
          allowOverlap={true} // 不允许重叠
          preventCollision={false}
          autoSize={true}
          resizeHandle={<CustomResizeHandle />}
        >
          {/* Sidepane - 静态区域，包含嵌套的 GridLayout */}
          <div key="sidepane" className="bg-transparent h-full">
            <ResponsiveGridLayout
              className="nested-layout"
              layouts={nestedLayouts}
              breakpoints={mainBreakpoints}
              cols={nestedCols}
              rowHeight={GRID_CONFIG.ROW_HEIGHT}
              margin={GRID_CONFIG.MARGIN}
              containerPadding={GRID_CONFIG.CONTAINER_PADDING}
              onLayoutChange={handleNestedLayoutChange}
              onDragStart={onDragStart}
              onDragStop={onDragStop}
              onResizeStart={onResizeStart}
              onResizeStop={onResizeStop}
              isDraggable={!isMobile}
              isResizable={!isMobile}
              compactType="vertical"
              preventCollision={false}
            >
              <div key="recent-plans" className="bg-transparent h-full">
                <RecentPlans />
              </div>
              <div key="tasks" className="bg-transparent h-full">
                <Tasks />
              </div>
              <div key="events" className="bg-transparent h-full">
                <Events />
              </div>
              <div key="workflows" className="bg-transparent h-full">
                <Workflows />
              </div>
            </ResponsiveGridLayout>
          </div>

          {/* Mainpane - Activities，可调整宽度 */}
          <div key="mainpane" className="bg-transparent relative h-full">
            {isResizingMainpane && (
              <div className="absolute -top-8 left-4 bg-gray-900 text-white px-2 py-1 rounded text-xs z-50">
                {activitiesWidth}/12 列
              </div>
            )}
            <div className="h-full">
              <Activities />
            </div>
          </div>
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};
