import { useCallback, useEffect, useMemo, useState } from 'react';

import { WorkspaceLayout } from './components/WorkspaceLayout';
import { Header } from './components/business/Header';
import { WelcomeSection } from './components/business/WelcomeSection';
import { AssetsMetric } from './components/business/metrics/AssetsMetric';
import { ClientsMetric } from './components/business/metrics/ClientsMetric';
import { PlansMetric } from './components/business/metrics/PlansMetric';
import { TasksMetric } from './components/business/metrics/TasksMetric';
import { MetricsBar } from './components/layouts/MetricsBar';
import type { MetricConfig } from './components/layouts/MetricsBar';
import { getBreakpointPreset } from './config/breakpointPresets';
import { STORAGE_KEYS, cleanupOldVersions } from './config/storage';

function App() {
  // 断点预设状态
  const [currentPreset, setCurrentPreset] = useState('experimental');

  // 导航状态
  const [activeMainNav, setActiveMainNav] = useState('Planning');
  const [activeSubNav, setActiveSubNav] = useState('Clients');

  // 动态获取当前断点配置
  const currentBreakpointConfig = useMemo(
    () => getBreakpointPreset(currentPreset),
    [currentPreset]
  );

  // 状态管理
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // 处理导航变更
  const handleNavChange = useCallback((mainNav: string, subNav?: string) => {
    const navSubDefaults: { [key: string]: string } = {
      ChubbyIntel: 'Dashboard',
      ChubbyFlows: 'Tasks',
      ChubbyPay: 'Plans',
      Risk: 'Summary',
      Models: 'Portfolios',
      Planning: 'Clients',
    };

    setActiveMainNav(mainNav);
    // 如果有子导航参数，设置子导航；否则清除子导航
    if (subNav !== undefined) {
      setActiveSubNav(subNav);
    } else {
      // 当切换主导航时，设置默认的子导航
      setActiveSubNav(navSubDefaults[mainNav] || '');
    }

    console.log('Navigation changed:', {
      mainNav,
      subNav: subNav || navSubDefaults[mainNav],
    });
  }, []);

  // 处理断点预设切换
  const handleBreakpointPresetChange = useCallback((presetId: string) => {
    setCurrentPreset(presetId);
    // 切换预设时重置布局
    localStorage.removeItem(STORAGE_KEYS.TOP_LAYOUTS);
    localStorage.removeItem(STORAGE_KEYS.SIDE_LAYOUTS);
    localStorage.setItem(STORAGE_KEYS.BREAKPOINT_PRESET, presetId);

    // 重置两个面板的布局
    const windowWithReset = window as Window & {
      __resetTopPaneLayout?: () => void;
      __resetWorkspaceLayout?: () => void;
    };
    if (windowWithReset.__resetTopPaneLayout) {
      windowWithReset.__resetTopPaneLayout();
    }
    if (windowWithReset.__resetWorkspaceLayout) {
      windowWithReset.__resetWorkspaceLayout();
    }

    console.log('Breakpoint preset changed to:', presetId);
  }, []);

  // 从 localStorage 加载预设，并清理旧版本数据
  useEffect(() => {
    // 清理旧版本的 localStorage 数据
    cleanupOldVersions();

    const saved = localStorage.getItem(STORAGE_KEYS.BREAKPOINT_PRESET);
    if (saved) {
      setCurrentPreset(saved);
    }
  }, []);

  // 重置布局
  const resetLayout = useCallback(() => {
    // 清除本地存储
    localStorage.removeItem(STORAGE_KEYS.TOP_LAYOUTS);
    localStorage.removeItem(STORAGE_KEYS.SIDE_LAYOUTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES_COLUMNS);

    // 重置两个面板的布局
    const windowWithReset = window as Window & {
      __resetTopPaneLayout?: () => void;
      __resetWorkspaceLayout?: () => void;
    };

    if (windowWithReset.__resetTopPaneLayout) {
      windowWithReset.__resetTopPaneLayout();
    }
    if (windowWithReset.__resetWorkspaceLayout) {
      windowWithReset.__resetWorkspaceLayout();
    }

    console.log('Layout reset to default');
  }, []);

  // 拖拽事件处理
  const handleDragStart = useCallback(() => setIsDragging(true), []);
  const handleDragStop = useCallback(() => setIsDragging(false), []);
  const handleResizeStart = useCallback(() => setIsResizing(true), []);
  const handleResizeStop = useCallback(() => setIsResizing(false), []);

  // 固定断点配置 - 针对固定宽度设计
  const breakpoints = useMemo(
    () => ({ lg: 1200 }), // 单一断点，适用于固定宽度
    []
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
    const baseClasses = 'mx-auto px-6 py-8';

    if (!config || !config.adaptive) {
      return `max-w-7xl ${baseClasses}`;
    }

    return baseClasses;
  }, [currentBreakpointConfig]);

  // 指标配置
  const metricsConfig: MetricConfig[] = useMemo(
    () => [
      {
        id: 'clients-metric',
        component: <ClientsMetric />,
        size: 'medium',
        priority: 1,
      },
      {
        id: 'tasks-metric',
        component: <TasksMetric />,
        size: 'medium',
        priority: 2,
      },
      {
        id: 'assets-metric',
        component: <AssetsMetric />,
        size: 'medium',
        priority: 3,
      },
      {
        id: 'plans-metric',
        component: <PlansMetric />,
        size: 'medium',
        priority: 4,
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <Header
          currentBreakpointPreset={currentPreset}
          onBreakpointPresetChange={handleBreakpointPresetChange}
          activeMainNav={activeMainNav}
          activeSubNav={activeSubNav}
          onNavChange={handleNavChange}
        />
      </div>

      <main className={containerClassName} style={containerStyle}>
        <WelcomeSection
          onResetLayout={resetLayout}
          isDragging={isDragging}
          isResizing={isResizing}
        />

        {/* 顶部指标栏 */}
        <div className="mb-6">
          <div
            className={`transition-all duration-200 ${isDragging || isResizing ? 'select-none' : ''}`}
          >
            <MetricsBar
              metrics={metricsConfig}
              columns={{ desktop: 4, tablet: 2 }}
              tabletBehavior="grid"
              breakpoints={breakpoints}
              reorderable={true}
              draggable={true}
              resizable={false}
              storageKey={STORAGE_KEYS.TOP_LAYOUTS}
              autoSave={true}
              onDragStart={handleDragStart}
              onDragStop={handleDragStop}
              onResizeStart={handleResizeStart}
              onResizeStop={handleResizeStop}
              compact={false}
            />
          </div>
        </div>

        {/* 工作区布局 - 侧边栏小部件 + Activities面板 */}
        <WorkspaceLayout
          isDragging={isDragging}
          isResizing={isResizing}
          onDragStart={handleDragStart}
          onDragStop={handleDragStop}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
        />
      </main>
    </div>
  );
}

export default App;
