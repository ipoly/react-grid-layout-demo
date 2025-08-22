import { useCallback, useEffect, useMemo, useState } from 'react';

import { TopPane } from './components/TopPane';
import { WorkspaceLayout } from './components/WorkspaceLayout';
import { Header } from './components/business/Header';
import { WelcomeSection } from './components/business/WelcomeSection';
import { getBreakpointPreset } from './config/breakpointPresets';
import { STORAGE_KEYS, cleanupOldVersions } from './config/storage';

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

        {/* 顶部面板 - 指标卡片 */}
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

        {/* 工作区布局 - 侧边栏小部件 + Activities面板 */}
        <WorkspaceLayout
          isDragging={isDragging}
          isResizing={isResizing}
          isMobile={isMobile}
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
