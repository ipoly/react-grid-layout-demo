import { useCallback, useEffect, useMemo, useState } from 'react';

import { Activities } from './components/Activities';
import { Header } from './components/Header';
import { SidePane } from './components/SidePane';
import { TopPane } from './components/TopPane';
import { WelcomeSection } from './components/WelcomeSection';
import { getBreakpointPreset } from './config/breakpointPresets';

function App() {
  // 断点预设状态
  const [currentPreset, setCurrentPreset] = useState('default');

  // 动态获取当前断点配置
  const currentBreakpointConfig = useMemo(
    () => getBreakpointPreset(currentPreset),
    [currentPreset]
  );

  // 状态管理
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 处理断点预设切换
  const handleBreakpointPresetChange = useCallback((presetId: string) => {
    setCurrentPreset(presetId);
    // 切换预设时重置布局
    localStorage.removeItem('dashboard-top-layouts');
    localStorage.removeItem('dashboard-side-layouts');
    localStorage.setItem('dashboard-breakpoint-preset', presetId);

    // 重置两个面板的布局
    const windowWithReset = window as Window & {
      __resetTopPaneLayout?: () => void;
      __resetSidePaneLayout?: () => void;
    };
    if (windowWithReset.__resetTopPaneLayout) {
      windowWithReset.__resetTopPaneLayout();
    }
    if (windowWithReset.__resetSidePaneLayout) {
      windowWithReset.__resetSidePaneLayout();
    }

    console.log('Breakpoint preset changed to:', presetId);
  }, []);

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

  // 重置布局
  const resetLayout = useCallback(() => {
    // 清除本地存储
    localStorage.removeItem('dashboard-top-layouts');
    localStorage.removeItem('dashboard-side-layouts');

    // 重置两个面板的布局和 Activities 组件状态
    const windowWithReset = window as Window & {
      __resetTopPaneLayout?: () => void;
      __resetSidePaneLayout?: () => void;
      __resetActivities?: () => void;
    };

    if (windowWithReset.__resetTopPaneLayout) {
      windowWithReset.__resetTopPaneLayout();
    }
    if (windowWithReset.__resetSidePaneLayout) {
      windowWithReset.__resetSidePaneLayout();
    }
    if (windowWithReset.__resetActivities) {
      windowWithReset.__resetActivities();
    }

    console.log('Layout reset to default');
  }, []);

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

        {/* 顶部面板 - 独立的网格布局 */}
        <TopPane
          isDragging={isDragging}
          isResizing={isResizing}
          isMobile={isMobile}
          onDragStart={handleDragStart}
          onDragStop={handleDragStop}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          breakpoints={breakpoints}
        />

        {/* 主内容区域 - 侧边栏和活动面板 */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 侧边面板 - 独立的网格布局 */}
          <SidePane
            isDragging={isDragging}
            isResizing={isResizing}
            isMobile={isMobile}
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
          />

          {/* 活动面板 - 静态，不可拖动 */}
          <div className="flex-1">
            <Activities onReset={resetLayout} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
