import { useCallback, useEffect, useMemo, useState } from 'react';

import { WorkspaceLayout } from './components/WorkspaceLayout';
import { Header, getNavigationItems } from './components/business/Header';
import { WelcomeSection } from './components/business/WelcomeSection';
import { AssetsMetric } from './components/business/metrics/AssetsMetric';
import { ClientsMetric } from './components/business/metrics/ClientsMetric';
import { PlansMetric } from './components/business/metrics/PlansMetric';
import { TasksMetric } from './components/business/metrics/TasksMetric';
import { MetricsBar } from './components/layouts/MetricsBar';
import type { MetricConfig } from './components/layouts/MetricsBar';
import { SidebarLayoutWrapper } from './components/layouts/SidebarLayoutWrapper';
import { SidebarModeLayout } from './components/layouts/SidebarModeLayout';
import { STORAGE_KEYS, cleanupOldVersions } from './config/storage';
import type { NavigationState } from './types/navigation';
import { NavigationUtils } from './types/navigation';

function App() {
  // 断点预设状态
  const [currentPreset, setCurrentPreset] = useState('experimental');

  // 导航状态
  const [activeMainNav, setActiveMainNav] = useState('Planning');
  const [activeSubNav, setActiveSubNav] = useState('Models');
  const [activeThirdNav, setActiveThirdNav] = useState('Portfolios');

  // 右侧图标状态
  const [activeRightIcon, setActiveRightIcon] = useState('');
  const [activeRightSubNav, setActiveRightSubNav] = useState('');

  // 导航模式状态
  const [navigationMode, setNavigationMode] = useState<
    'horizontal' | 'hover' | 'sidebar'
  >('horizontal');

  // 状态管理
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // 统一导航处理函数
  const handleNavigationChange = useCallback((navigation: NavigationState) => {
    const navSubDefaults: { [key: string]: string } = {
      ChubbyIntel: 'Dashboard',
      ChubbyFlows: 'Tasks',
      ChubbyPay: 'Plans',
      Risk: 'Summary',
      Models: 'Portfolios',
      Planning: 'Clients',
    };

    const thirdNavDefaults: { [key: string]: string } = {
      Models: 'Portfolios',
    };

    if (navigation.type === 'main') {
      const [mainNav, subNav, thirdNav] =
        NavigationUtils.toMainNavigation(navigation);

      setActiveMainNav(mainNav);
      // 清除右侧图标的激活状态，确保互斥
      setActiveRightIcon('');
      setActiveRightSubNav('');

      // 如果有子导航参数，设置子导航；否则清除子导航
      if (subNav !== undefined) {
        setActiveSubNav(subNav);
      } else {
        // 当切换主导航时，设置默认的子导航
        setActiveSubNav(navSubDefaults[mainNav] || '');
      }

      // 处理第三级导航
      if (thirdNav !== undefined) {
        setActiveThirdNav(thirdNav);
      } else if (subNav !== undefined) {
        // 当切换子导航时，设置默认的第三级导航
        setActiveThirdNav(thirdNavDefaults[subNav] || '');
      } else {
        setActiveThirdNav('');
      }

      console.log('Main navigation changed:', {
        mainNav,
        subNav: subNav || navSubDefaults[mainNav],
        thirdNav: thirdNav || thirdNavDefaults[subNav || ''],
        source: navigation.source,
      });
    } else if (navigation.type === 'icon') {
      const [iconId, subNav] =
        NavigationUtils.toRightIconNavigation(navigation);

      setActiveRightIcon(iconId);
      // 清除主导航的激活状态，确保互斥
      setActiveMainNav('');
      setActiveSubNav('');
      setActiveThirdNav('');

      // 设置右侧图标的子导航
      if (subNav !== undefined) {
        setActiveRightSubNav(subNav);
      } else {
        // 当切换右侧图标时，自动选择第一个子项
        const getFirstSubItem = (id: string) => {
          const iconConfigs = {
            more: ['Models'], // More 下的第一项是 Models (navigationItems.slice(6))
            sso: ['Goldman Sachs'], // SSO 下的第一项
            vault: [], // Vault 没有子项
            notifications: ['Notifications'], // Notifications 下的第一项
            settings: ['Account'], // Settings 下的第一项
          };
          return iconConfigs[id as keyof typeof iconConfigs]?.[0] || '';
        };
        setActiveRightSubNav(getFirstSubItem(iconId));
      }

      console.log('Icon navigation changed:', {
        iconId,
        subNav: subNav || 'auto-selected',
      });
    }
  }, []);

  // 向后兼容的旧接口函数已移除，Header组件现在直接使用统一的onNavigationChange回调

  // 处理导航模式变更
  const handleNavigationModeChange = useCallback(
    (mode: 'horizontal' | 'hover' | 'sidebar') => {
      setNavigationMode(mode);
      localStorage.setItem(STORAGE_KEYS.NAVIGATION_MODE, mode);
      console.log('Navigation mode changed to:', mode);
    },
    []
  );

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

    const savedPreset = localStorage.getItem(STORAGE_KEYS.BREAKPOINT_PRESET);
    if (savedPreset) {
      setCurrentPreset(savedPreset);
    }

    const savedNavigationMode = localStorage.getItem(
      STORAGE_KEYS.NAVIGATION_MODE
    );
    if (
      savedNavigationMode === 'horizontal' ||
      savedNavigationMode === 'hover' ||
      savedNavigationMode === 'sidebar'
    ) {
      setNavigationMode(savedNavigationMode);
    }
  }, []);

  // 重置布局
  const resetLayout = useCallback(() => {
    console.log('🔄 resetLayout function called');
    console.log('📦 Before clear localStorage:', {
      topLayouts: localStorage.getItem(STORAGE_KEYS.TOP_LAYOUTS),
      sideLayouts: localStorage.getItem(STORAGE_KEYS.SIDE_LAYOUTS),
      activitiesColumns: localStorage.getItem(STORAGE_KEYS.ACTIVITIES_COLUMNS),
      navigationMode: localStorage.getItem(STORAGE_KEYS.NAVIGATION_MODE),
    });

    // 清除本地存储
    localStorage.removeItem(STORAGE_KEYS.TOP_LAYOUTS);
    localStorage.removeItem(STORAGE_KEYS.SIDE_LAYOUTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES_COLUMNS);
    localStorage.removeItem(STORAGE_KEYS.NAVIGATION_MODE);

    // 重置导航模式到默认值
    setNavigationMode('horizontal');

    console.log('🗑️ After clear localStorage:', {
      topLayouts: localStorage.getItem(STORAGE_KEYS.TOP_LAYOUTS),
      sideLayouts: localStorage.getItem(STORAGE_KEYS.SIDE_LAYOUTS),
      activitiesColumns: localStorage.getItem(STORAGE_KEYS.ACTIVITIES_COLUMNS),
      navigationMode: localStorage.getItem(STORAGE_KEYS.NAVIGATION_MODE),
    });

    // 重置各种布局组件
    const windowWithReset = window as Window & {
      __resetLayouts?: { [key: string]: () => void };
      __resetWorkspaceLayout?: () => void;
    };

    console.log('🪟 Window reset callbacks availability:', {
      resetLayouts: typeof windowWithReset.__resetLayouts,
      resetWorkspace: typeof windowWithReset.__resetWorkspaceLayout,
    });

    // 重置 GridLayout (用于 MetricsBar)
    if (windowWithReset.__resetLayouts) {
      const topLayoutsKey = STORAGE_KEYS.TOP_LAYOUTS;
      if (windowWithReset.__resetLayouts[topLayoutsKey]) {
        console.log('📊 Calling __resetLayouts for', topLayoutsKey);
        windowWithReset.__resetLayouts[topLayoutsKey]();
      } else {
        console.warn('⚠️ __resetLayouts not available for', topLayoutsKey);
      }
    } else {
      console.warn('⚠️ __resetLayouts not available');
    }

    // 重置 WorkspaceLayout
    if (windowWithReset.__resetWorkspaceLayout) {
      console.log('🏢 Calling __resetWorkspaceLayout');
      windowWithReset.__resetWorkspaceLayout();
    } else {
      console.warn('⚠️ __resetWorkspaceLayout not available');
    }

    console.log('✅ Layout reset completed');
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

  // Main content component that both layouts will use - memoized to prevent unnecessary re-renders
  const MainContent = useMemo(
    () => (
      <main className="flex-1 max-w-[1680px] min-w-[1280px] w-full mx-auto px-6 py-8">
        <WelcomeSection isDragging={isDragging} isResizing={isResizing} />

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
    ),
    [
      isDragging,
      isResizing,
      metricsConfig,
      breakpoints,
      handleDragStart,
      handleDragStop,
      handleResizeStart,
      handleResizeStop,
    ]
  );

  // For sidebar mode, use Header + SidebarLayoutWrapper
  if (navigationMode === 'sidebar') {
    return (
      <SidebarLayoutWrapper
        navigationItems={getNavigationItems()}
        activeMainNav={activeMainNav}
        activeSubNav={activeSubNav}
        activeThirdNav={activeThirdNav}
        activeRightIcon={activeRightIcon}
        activeRightSubNav={activeRightSubNav}
        onNavigationChange={handleNavigationChange}
        onResetLayout={resetLayout}
        navigationMode={navigationMode}
        onNavigationModeChange={handleNavigationModeChange}
      >
        <div className="min-h-screen bg-gray-100">
          {/* Sticky Header */}
          <div className="sticky top-0 z-50">
            <Header
              activeMainNav={activeMainNav}
              activeSubNav={activeSubNav}
              activeThirdNav={activeThirdNav}
              activeRightIcon={activeRightIcon}
              activeRightSubNav={activeRightSubNav}
              onNavigationChange={handleNavigationChange}
              onResetLayout={resetLayout}
              navigationMode={navigationMode}
              onNavigationModeChange={handleNavigationModeChange}
              containerClassName="w-full"
            />
          </div>

          {/* Main content with sidebar space consideration */}
          <SidebarModeLayout
            navigationItems={getNavigationItems()}
            onNavigationChange={handleNavigationChange}
            activeMainNav={activeMainNav}
            activeSubNav={activeSubNav}
            activeThirdNav={activeThirdNav}
            activeRightIcon={activeRightIcon}
            activeRightSubNav={activeRightSubNav}
          >
            {MainContent}
          </SidebarModeLayout>
        </div>
      </SidebarLayoutWrapper>
    );
  }

  // For horizontal and hover modes, use traditional header layout
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-50">
        <Header
          currentBreakpointPreset={currentPreset}
          onBreakpointPresetChange={handleBreakpointPresetChange}
          activeMainNav={activeMainNav}
          activeSubNav={activeSubNav}
          activeThirdNav={activeThirdNav}
          activeRightIcon={activeRightIcon}
          activeRightSubNav={activeRightSubNav}
          onNavigationChange={handleNavigationChange}
          onResetLayout={resetLayout}
          navigationMode={navigationMode}
          onNavigationModeChange={handleNavigationModeChange}
          containerClassName="w-full"
        />
      </div>

      {MainContent}
    </div>
  );
}

export default App;
