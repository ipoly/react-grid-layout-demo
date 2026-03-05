import { useCallback, useEffect, useRef, useState } from 'react';

import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Folder,
  GitPullRequest,
  User,
} from 'lucide-react';

interface ActivitiesProps {
  onReset?: () => void;
}

// 活动条目数据接口
interface ActivityItem {
  id: string;
  category: 'Client Activities' | 'Vault' | 'Tasks' | 'Workflow';
  user: string;
  action: string;
  target?: string;
  beneficiary?: string; // 用于 "step for" 场景
  date: string;
  details?: {
    description?: string;
    files?: Array<{ name: string; size: string; type: 'csv' | 'doc' | 'pdf' }>;
    badge?: { text: string; type: 'error' | 'gray' };
    progress?: { current: number; total: number };
  };
  state?: 'Default' | 'Completed';
}

export const Activities = ({ onReset }: ActivitiesProps) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 示例活动数据 - 根据最新Figma设计
  const activities: ActivityItem[] = [
    {
      id: '1',
      category: 'Tasks',
      user: 'George Wu',
      action: 'created a',
      target: 'One time task',
      beneficiary: 'John Smith',
      date: '11/17/2025',
      state: 'Default',
      details: {
        description:
          'Review documents in the folder titled Tax Statements. Reach out to John if the required files are missing or incomplete.',
        badge: { text: '09/10/2025', type: 'error' },
      },
    },
    {
      id: '2',
      category: 'Vault',
      user: 'John Smith',
      action: 'uploaded 3 files under folder Tax / Tax Statements',
      date: '11/17/2025',
      state: 'Default',
      details: {
        files: [
          { name: 'November2024Tax.csv', size: '720 KB', type: 'csv' },
          { name: 'November2024Tax.doc', size: '720 KB', type: 'doc' },
          { name: 'November2024Tax.pdf', size: '720 KB', type: 'pdf' },
        ],
      },
    },
    {
      id: '3',
      category: 'Client Activities',
      user: 'John Smith',
      action: 'signed up using invitation link',
      date: '11/17/2025',
      state: 'Default',
    },
    {
      id: '4',
      category: 'Workflow',
      user: 'George Wu',
      action: 'created a workflow for',
      beneficiary: 'John Smith',
      date: '11/17/2025',
      state: 'Default',
      details: {
        description: 'The Roth conversions workflow was started.',
      },
    },
    {
      id: '5',
      category: 'Client Activities',
      user: 'John Smith',
      action: 'completed',
      target: "Anna's Firm Specific risk questionnaire",
      date: '11/17/2025',
      state: 'Completed',
    },
    {
      id: '6',
      category: 'Workflow',
      user: 'Nate Montgomery',
      action: 'completed a',
      target: 'New client workflow',
      beneficiary: 'Benjamin Harrison Whitfield',
      date: '11/17/2025',
      state: 'Completed',
      details: {
        description:
          'The Convert funds step of the Roth conversion workflow was completed.',
        progress: { current: 6, total: 6 },
      },
    },
    {
      id: '7',
      category: 'Tasks',
      user: 'George Wu',
      action: 'completed a',
      target: 'Weekly task',
      beneficiary: 'John Smith',
      date: '11/17/2025',
      state: 'Completed',
      details: {
        description:
          'Review documents in the folder titled Tax Statements. Reach out to John if the required files are missing or incomplete.',
        badge: { text: '09/10/2025', type: 'gray' },
      },
    },
  ];

  // 获取分类图标和样式
  const getCategoryIcon = (category: ActivityItem['category']) => {
    const iconClass = 'h-4 w-4';

    switch (category) {
      case 'Client Activities':
        return <User className={iconClass} />;
      case 'Vault':
        return <Folder className={iconClass} />;
      case 'Tasks':
        return <CheckCircle2 className={iconClass} />;
      case 'Workflow':
        return <GitPullRequest className={iconClass} />;
    }
  };

  const getCategoryBgColor = (category: ActivityItem['category']) => {
    switch (category) {
      case 'Client Activities':
        return 'bg-[#e6eaff]'; // brand secondary
      case 'Vault':
        return 'bg-[#eaecf5]'; // gray-blue
      case 'Tasks':
        return 'bg-[#d1e9ff]'; // blue
      case 'Workflow':
        return 'bg-[#fdead7]'; // orange
    }
  };

  const getCategoryIconColor = (category: ActivityItem['category']) => {
    switch (category) {
      case 'Client Activities':
        return 'text-[#5865f2]'; // brand
      case 'Vault':
        return 'text-[#667085]'; // gray-blue
      case 'Tasks':
        return 'text-[#2e90fa]'; // blue
      case 'Workflow':
        return 'text-[#f79009]'; // orange
    }
  };

  // 文件类型图标
  const getFileIcon = (type: 'csv' | 'doc' | 'pdf') => {
    const baseClass =
      'w-10 h-10 rounded relative flex items-center justify-center';

    switch (type) {
      case 'csv':
        return (
          <div className={`${baseClass} bg-green-50`}>
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <path
                d="M8 0h16l8 8v28a4 4 0 01-4 4H8a4 4 0 01-4-4V4a4 4 0 014-4z"
                fill="#E8F5E9"
              />
              <path d="M24 0l8 8h-6a2 2 0 01-2-2V0z" fill="#C8E6C9" />
              <rect x="9" y="15" width="18" height="18" rx="2" fill="#4CAF50" />
              <text
                x="50%"
                y="28"
                fontSize="7"
                fontWeight="600"
                fill="white"
                textAnchor="middle"
              >
                CSV
              </text>
            </svg>
          </div>
        );
      case 'doc':
        return (
          <div className={`${baseClass} bg-blue-50`}>
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <path
                d="M8 0h16l8 8v28a4 4 0 01-4 4H8a4 4 0 01-4-4V4a4 4 0 014-4z"
                fill="#E3F2FD"
              />
              <path d="M24 0l8 8h-6a2 2 0 01-2-2V0z" fill="#BBDEFB" />
              <rect x="9" y="15" width="18" height="18" rx="2" fill="#2196F3" />
              <text
                x="50%"
                y="28"
                fontSize="7"
                fontWeight="600"
                fill="white"
                textAnchor="middle"
              >
                DOC
              </text>
            </svg>
          </div>
        );
      case 'pdf':
        return (
          <div className={`${baseClass} bg-red-50`}>
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <path
                d="M8 0h16l8 8v28a4 4 0 01-4 4H8a4 4 0 01-4-4V4a4 4 0 014-4z"
                fill="#FFEBEE"
              />
              <path d="M24 0l8 8h-6a2 2 0 01-2-2V0z" fill="#FFCDD2" />
              <rect x="9" y="15" width="18" height="18" rx="2" fill="#F44336" />
              <text
                x="50%"
                y="28"
                fontSize="7"
                fontWeight="600"
                fill="white"
                textAnchor="middle"
              >
                PDF
              </text>
            </svg>
          </div>
        );
    }
  };

  // 模拟加载更多功能
  const loadMore = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setVisibleCount((prev) => Math.min(prev + 4, activities.length));
    setIsLoading(false);
  }, [activities.length]);

  // 获取当前显示的活动
  const visibleActivities = activities.slice(0, visibleCount);
  const hasMore = visibleCount < activities.length;

  // 监听内容变化，触发网格重新计算
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    });

    resizeObserver.observe(containerRef.current);

    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 600);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [visibleCount]);

  // 重置 Activities 状态
  const resetActivities = useCallback(() => {
    setVisibleCount(8);
    setIsLoading(false);
  }, []);

  // 向父组件暴露重置函数
  useEffect(() => {
    if (onReset) {
      const windowWithReset = window as Window & {
        __resetActivities?: () => void;
      };
      windowWithReset.__resetActivities = resetActivities;
    }
    return () => {
      const windowWithReset = window as Window & {
        __resetActivities?: () => void;
      };
      if (windowWithReset.__resetActivities) {
        delete windowWithReset.__resetActivities;
      }
    };
  }, [onReset, resetActivities]);

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-xl border border-[#e4e1dd] h-full flex flex-col p-6 gap-5"
    >
      {/* Header */}
      <div className="flex items-center px-1">
        <h2 className="flex-1 text-lg font-semibold leading-7 text-[#5c4c64]">
          Activities
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 px-1">
        {/* Category Filter */}
        <div className="flex flex-col gap-1.5 w-40">
          <label className="text-sm leading-5 text-[#635a52]">Category</label>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#d1ccc6] rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] hover:border-[#9a9189] transition-colors">
            <span className="flex-1 text-base leading-6 text-[#9a9189] text-left">
              All categories
            </span>
            <ChevronDown className="w-4 h-4 text-[#635a52]" />
          </button>
        </div>

        {/* Household Filter */}
        <div className="flex flex-col gap-1.5 w-40">
          <label className="text-sm leading-5 text-[#635a52]">Household</label>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#d1ccc6] rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] hover:border-[#9a9189] transition-colors">
            <span className="flex-1 text-base leading-6 text-[#9a9189] text-left">
              All households
            </span>
            <ChevronDown className="w-4 h-4 text-[#635a52]" />
          </button>
        </div>

        {/* Date Filter */}
        <div className="flex flex-col gap-1.5 w-40">
          <label className="text-sm leading-5 text-[#635a52]">Date</label>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#d1ccc6] rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] hover:border-[#9a9189] transition-colors">
            <span className="flex-1 text-base leading-6 text-[#9a9189] text-left">
              All time
            </span>
            <ChevronDown className="w-4 h-4 text-[#635a52]" />
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {visibleActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex flex-col gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{
                animationDelay:
                  index >= visibleCount - 4
                    ? `${(index - (visibleCount - 4)) * 100}ms`
                    : '0ms',
              }}
            >
              {/* Activity Header */}
              <div className="flex items-center gap-3">
                {/* Category Icon */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${getCategoryBgColor(activity.category)}`}
                  >
                    <div className={getCategoryIconColor(activity.category)}>
                      {getCategoryIcon(activity.category)}
                    </div>
                  </div>
                  {activity.state === 'Completed' && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* Activity Description */}
                <div className="flex-1 min-w-0 flex items-center gap-1 flex-wrap">
                  <span className="font-semibold text-base leading-6 text-[#5c4c64]">
                    {activity.user}
                  </span>
                  <span className="text-base leading-6 text-[#5c4c64]">
                    {activity.action}
                  </span>
                  {activity.target && (
                    <button className="font-semibold text-base leading-6 text-[#5c4c64] underline hover:text-[#2e3f9a] transition-colors">
                      {activity.target}
                    </button>
                  )}
                  {activity.beneficiary && (
                    <>
                      {/* 根据上下文判断显示 "for" 还是 "step for" */}
                      {activity.action.includes('for') ? (
                        // action 已经包含 "for"，只需要显示 beneficiary
                        <button className="font-semibold text-base leading-6 text-[#5c4c64] underline hover:text-[#2e3f9a] transition-colors">
                          {activity.beneficiary}
                        </button>
                      ) : (
                        // action 不包含 "for"
                        <>
                          <span className="text-base leading-6 text-[#5c4c64]">
                            {/* Workflow + target → "step for", 其他情况 → "for" */}
                            {activity.category === 'Workflow' && activity.target
                              ? 'step for'
                              : 'for'}
                          </span>
                          <button className="font-semibold text-base leading-6 text-[#5c4c64] underline hover:text-[#2e3f9a] transition-colors">
                            {activity.beneficiary}
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Date */}
                <div className="flex-shrink-0">
                  <span className="text-sm leading-5 text-[#7d746b] px-1.5 py-1">
                    {activity.date}
                  </span>
                </div>
              </div>

              {/* Activity Details */}
              {activity.details && (
                <div className="pl-11">
                  {/* Description only (workflow) */}
                  {activity.details.description &&
                    !activity.details.files &&
                    !activity.details.badge &&
                    !activity.details.progress && (
                      <div className="border border-[#e4e1dd] rounded-xl p-4">
                        <p className="text-base leading-6 text-[#5c4c64]">
                          {activity.details.description}
                        </p>
                      </div>
                    )}

                  {/* Description with progress */}
                  {activity.details.description &&
                    activity.details.progress && (
                      <div className="border border-[#e4e1dd] rounded-xl p-4">
                        <p className="text-base leading-6 text-[#5c4c64] mb-3">
                          {activity.details.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-[#efede9] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#17b26a] rounded-full transition-all"
                              style={{
                                width: `${(activity.details.progress.current / activity.details.progress.total) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm leading-5 text-[#5c4c64] font-medium whitespace-nowrap">
                            Steps {activity.details.progress.current}/
                            {activity.details.progress.total}
                          </span>
                        </div>
                      </div>
                    )}

                  {/* Files */}
                  {activity.details.files && (
                    <div className="flex gap-2">
                      <div className="flex-1 flex flex-col gap-2">
                        {activity.details.files.slice(0, 2).map((file, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm leading-5 text-[#332e28] truncate">
                                {file.name}
                              </p>
                              <p className="text-sm leading-5 text-[#7d746b]">
                                {file.size}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {activity.details.files.length > 2 && (
                        <div className="flex-1 flex items-start">
                          <div className="flex items-center gap-3">
                            {getFileIcon(activity.details.files[2].type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm leading-5 text-[#332e28] truncate">
                                {activity.details.files[2].name}
                              </p>
                              <p className="text-sm leading-5 text-[#7d746b]">
                                {activity.details.files[2].size}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description with Badge (for tasks) */}
                  {activity.details.description && activity.details.badge && (
                    <div className="p-2">
                      <p className="text-base leading-6 text-[#635a52] mb-2">
                        {activity.details.description}
                      </p>
                      <div
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md border ${
                          activity.details.badge.type === 'error'
                            ? 'bg-[#fef3f2] border-[#fecdca]'
                            : 'bg-[#f9f8f7] border-[#e4e1dd]'
                        }`}
                      >
                        <Clock
                          className={`w-3 h-3 ${
                            activity.details.badge.type === 'error'
                              ? 'text-[#b42318]'
                              : 'text-[#635a52]'
                          }`}
                        />
                        <span
                          className={`text-sm leading-5 ${
                            activity.details.badge.type === 'error'
                              ? 'text-[#b42318]'
                              : 'text-[#635a52]'
                          }`}
                        >
                          {activity.details.badge.text}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Load More Button */}
      {(hasMore || isLoading) && (
        <div className="border-t border-[#e4e1dd] pt-4 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className={`text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Loading...' : 'Show more'}
          </button>
        </div>
      )}
    </div>
  );
};
