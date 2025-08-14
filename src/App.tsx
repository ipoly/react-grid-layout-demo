import { useCallback, useEffect, useMemo, useState } from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';

import { Activities } from './components/Activities';
import { AssetsMetric } from './components/AssetsMetric';
import { ClientsMetric } from './components/ClientsMetric';
import { Events } from './components/Events';
import { Header } from './components/Header';
import { PlansMetric } from './components/PlansMetric';
import { RecentPlans } from './components/RecentPlans';
import { Tasks } from './components/Tasks';
import { TasksMetric } from './components/TasksMetric';
import { WelcomeSection } from './components/WelcomeSection';
import { getBreakpointPreset } from './config/breakpointPresets';

const ResponsiveGridLayout = WidthProvider(Responsive);

function App() {
  // 断点预设状态
  const [currentPreset, setCurrentPreset] = useState('default');

  // 动态获取当前断点配置
  const currentBreakpointConfig = useMemo(
    () => getBreakpointPreset(currentPreset),
    [currentPreset]
  );

  // 默认布局配置 - 使用12列布局
  const defaultLayouts: Layouts = useMemo(
    () => ({
      lg: [
        // 顶部4个指标卡片，每个占3列
        {
          i: 'clients-metric',
          x: 0,
          y: 0,
          w: 3,
          h: 2,
          minW: 2,
          maxW: 6,
          minH: 2,
          maxH: 4,
        },
        {
          i: 'tasks-metric',
          x: 3,
          y: 0,
          w: 3,
          h: 2,
          minW: 2,
          maxW: 6,
          minH: 2,
          maxH: 4,
        },
        {
          i: 'assets-metric',
          x: 6,
          y: 0,
          w: 3,
          h: 2,
          minW: 2,
          maxW: 6,
          minH: 2,
          maxH: 4,
        },
        {
          i: 'plans-metric',
          x: 9,
          y: 0,
          w: 3,
          h: 2,
          minW: 2,
          maxW: 6,
          minH: 2,
          maxH: 4,
        },

        // 左列：Recent Plans, Tasks, Events (与设计图一致)
        {
          i: 'recent-plans',
          x: 0,
          y: 3,
          w: 4,
          h: 7,
          minW: 3,
          maxW: 5,
          minH: 6,
          maxH: 10,
        },
        {
          i: 'tasks',
          x: 0,
          y: 10,
          w: 4,
          h: 6,
          minW: 3,
          maxW: 5,
          minH: 5,
          maxH: 8,
        },
        {
          i: 'events',
          x: 0,
          y: 16,
          w: 4,
          h: 6,
          minW: 3,
          maxW: 5,
          minH: 5,
          maxH: 8,
        },

        // 右侧大区域：Activities (与设计图一致)
        {
          i: 'activities',
          x: 4,
          y: 3,
          w: 8,
          h: 10,
          minW: 6,
          maxW: 12,
          minH: 6,
          maxH: 25,
        },
      ],
      md: [
        // 平板：指标卡片2x2布局
        { i: 'clients-metric', x: 0, y: 0, w: 5, h: 3 },
        { i: 'tasks-metric', x: 5, y: 0, w: 5, h: 3 },
        { i: 'assets-metric', x: 0, y: 3, w: 5, h: 3 },
        { i: 'plans-metric', x: 5, y: 3, w: 5, h: 3 },

        // 平板端：左右分栏布局
        { i: 'recent-plans', x: 0, y: 6, w: 4, h: 7 },
        { i: 'tasks', x: 0, y: 13, w: 4, h: 6 },
        { i: 'events', x: 0, y: 19, w: 4, h: 6 },
        { i: 'activities', x: 4, y: 6, w: 6, h: 19 },
      ],
      sm: [
        // 移动端：单列堆叠
        { i: 'clients-metric', x: 0, y: 0, w: 6, h: 3 },
        { i: 'tasks-metric', x: 0, y: 3, w: 6, h: 3 },
        { i: 'assets-metric', x: 0, y: 6, w: 6, h: 3 },
        { i: 'plans-metric', x: 0, y: 9, w: 6, h: 3 },

        { i: 'recent-plans', x: 0, y: 12, w: 6, h: 7 },
        { i: 'tasks', x: 0, y: 19, w: 6, h: 5 },
        { i: 'events', x: 0, y: 24, w: 6, h: 5 },
        { i: 'activities', x: 0, y: 29, w: 6, h: 8 },
      ],
    }),
    []
  );

  // 从 localStorage 加载布局
  const loadSavedLayouts = (): Layouts => {
    try {
      const saved = localStorage.getItem('dashboard-layouts');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Loaded saved layout:', parsed);
        return parsed.lg ? parsed : defaultLayouts;
      }
    } catch (error) {
      console.warn('Failed to load saved layouts:', error);
    }
    return defaultLayouts;
  };

  const [layouts, setLayouts] = useState<Layouts>(loadSavedLayouts);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 处理断点预设切换
  const handleBreakpointPresetChange = useCallback(
    (presetId: string) => {
      setCurrentPreset(presetId);
      // 切换预设时重置布局
      setLayouts(defaultLayouts);
      localStorage.setItem('dashboard-layouts', JSON.stringify(defaultLayouts));
      localStorage.setItem('dashboard-breakpoint-preset', presetId);
      console.log('Breakpoint preset changed to:', presetId);
    },
    [defaultLayouts]
  );

  // 从 localStorage 加载预设
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-breakpoint-preset');
    if (saved) {
      setCurrentPreset(saved);
    }
  }, []);

  // 检测移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 布局变化处理
  const handleLayoutChange = useCallback(
    (_layout: Layout[], layouts: Layouts) => {
      setLayouts(layouts);
      try {
        localStorage.setItem('dashboard-layouts', JSON.stringify(layouts));
        console.log('Layout saved to localStorage:', layouts);
      } catch (error) {
        console.error('Failed to save layout:', error);
      }
    },
    []
  );

  // 重置布局
  const resetLayout = useCallback(() => {
    setLayouts(defaultLayouts);
    localStorage.setItem('dashboard-layouts', JSON.stringify(defaultLayouts));
    
    // 重置 Activities 组件状态
    if ((window as any).__resetActivities) {
      (window as any).__resetActivities();
    }
    
    console.log('Layout reset to default');
  }, [defaultLayouts]);

  // 拖拽事件处理
  const handleDragStart = useCallback(() => setIsDragging(true), []);
  const handleDragStop = useCallback(() => setIsDragging(false), []);
  const handleResizeStart = useCallback(() => setIsResizing(true), []);
  const handleResizeStop = useCallback(() => setIsResizing(false), []);

  // 动态断点配置 - 根据选择的预设
  const breakpoints = useMemo(
    () => currentBreakpointConfig.breakpoints,
    [currentBreakpointConfig]
  );
  const cols = useMemo(
    () => currentBreakpointConfig.cols,
    [currentBreakpointConfig]
  );

  // 动态容器样式
  const containerStyle = useMemo(() => {
    const config = currentBreakpointConfig.containerConfig;
    if (!config || !config.adaptive) {
      return {}; // 使用默认的 max-w-7xl
    }

    return {
      minWidth: config.minWidth ? `${config.minWidth}px` : undefined,
      maxWidth: config.maxWidth ? `${config.maxWidth}px` : undefined,
      width: config.adaptive ? '100%' : undefined,
    };
  }, [currentBreakpointConfig]);

  // 动态容器类名
  const containerClassName = useMemo(() => {
    const config = currentBreakpointConfig.containerConfig;
    const baseClasses = 'mx-auto px-4 sm:px-6 py-4 sm:py-8';

    if (!config || !config.adaptive) {
      return `max-w-7xl ${baseClasses}`;
    }

    return baseClasses;
  }, [currentBreakpointConfig]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <Header
          currentBreakpointPreset={currentPreset}
          onBreakpointPresetChange={handleBreakpointPresetChange}
        />
      </div>

      <main className={containerClassName} style={containerStyle}>
        <WelcomeSection
          onResetLayout={resetLayout}
          isDragging={isDragging}
          isResizing={isResizing}
          isMobile={isMobile}
        />

        <div
          className={`transition-all duration-200 ${isDragging || isResizing ? 'select-none' : ''}`}
        >
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={68}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            onLayoutChange={handleLayoutChange}
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
            isDraggable={!isMobile}
            isResizable={!isMobile}
            compactType="vertical"
            preventCollision={false}
          >
            {/* 4个独立的指标卡片 */}
            <div key="clients-metric" className="bg-transparent h-full">
              <ClientsMetric />
            </div>

            <div key="tasks-metric" className="bg-transparent h-full">
              <TasksMetric />
            </div>

            <div key="assets-metric" className="bg-transparent h-full">
              <AssetsMetric />
            </div>

            <div key="plans-metric" className="bg-transparent h-full">
              <PlansMetric />
            </div>

            {/* 其他面板组件 */}
            <div key="recent-plans" className="bg-transparent h-full">
              <RecentPlans />
            </div>

            <div key="tasks" className="bg-transparent h-full">
              <Tasks />
            </div>

            <div key="events" className="bg-transparent h-full">
              <Events />
            </div>

            <div key="activities" className="bg-transparent h-full">
              <Activities onReset={resetLayout} />
            </div>
          </ResponsiveGridLayout>
        </div>
      </main>
    </div>
  );
}

export default App;
