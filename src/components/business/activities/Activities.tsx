import { useCallback, useEffect, useRef, useState } from 'react';

import { Badge } from '@untitled-ui/components/base/badges/badges';
import {
  CheckCircle,
  ChevronDown,
  CircleAlert,
  FileText,
  GitBranch,
  MessageCircle,
  MoreVertical,
  PanelRight,
  User,
  UserCheck,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'task' | 'signup' | 'workflow' | 'questionnaire' | 'workflow-step';
  user: {
    name: string;
  };
  action: string;
  target?: string;
  time: string;
  description?: string;
  dueDate?: string;
  progress?: {
    current: number;
    total: number;
  };
  completed?: boolean;
}

interface ActivitiesProps {
  onReset?: () => void;
}

export const Activities = ({ onReset }: ActivitiesProps) => {
  const [visibleCount] = useState(7);
  const containerRef = useRef<HTMLDivElement>(null);

  const activities: Activity[] = [
    {
      id: '1',
      type: 'task',
      user: { name: 'George Wu' },
      action: 'created a task for',
      target: 'John Smith',
      time: '11/17/2025',
      description:
        'Review documents in the folder titled Tax Statements. Reach out to John if the required files are missing or incomplete.',
      dueDate: '09/10/2025',
    },
    {
      id: '2',
      type: 'task',
      user: { name: 'George Wu' },
      action: 'created a task for',
      target: 'John Smith',
      time: '11/17/2025',
      description:
        'Review documents in the folder titled Tax Statements. Reach out to John if the required files are missing or incomplete.',
      dueDate: '09/10/2025',
    },
    {
      id: '3',
      type: 'signup',
      user: { name: 'John Smith' },
      action: 'signed up using invitation link',
      time: '11/17/2025',
    },
    {
      id: '4',
      type: 'workflow',
      user: { name: 'John Smith' },
      action: 'A new workflow was started for',
      target: 'John Smith',
      time: '11/17/2025',
      description: 'The Quarterly review workflow was started.',
    },
    {
      id: '5',
      type: 'questionnaire',
      user: { name: 'John Smith' },
      action: "completed Anna's Firm Specific risk questionnaire",
      time: '11/17/2025',
      completed: true,
    },
    {
      id: '6',
      type: 'workflow-step',
      user: { name: 'George Wu' },
      action: 'completed a workflow step for',
      target: 'John Smith',
      time: '11/17/2025',
      description:
        'The Convert funds step of the Roth conversion workflow was completed.',
      progress: {
        current: 6,
        total: 6,
      },
      completed: true,
    },
    {
      id: '7',
      type: 'task',
      user: { name: 'George Wu' },
      action: 'completed a task for',
      target: 'John Smith',
      time: '11/17/2025',
      description:
        'Review documents in the folder titled Tax Statements. Reach out to John if the required files are missing or incomplete.',
      dueDate: '09/10/2025',
      completed: true,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <FileText className="w-4 h-4" />;
      case 'signup':
        return <User className="w-4 h-4" />;
      case 'workflow':
        return <GitBranch className="w-4 h-4" />;
      case 'questionnaire':
        return <UserCheck className="w-4 h-4" />;
      case 'workflow-step':
        return <GitBranch className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-blue-50 text-blue-600';
      case 'signup':
        return 'bg-purple-50 text-purple-600';
      case 'workflow':
        return 'bg-orange-50 text-orange-600';
      case 'questionnaire':
        return 'bg-purple-50 text-purple-600';
      case 'workflow-step':
        return 'bg-orange-50 text-orange-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  // 获取当前显示的活动
  const visibleActivities = activities.slice(0, visibleCount);

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

  // 重置 Activities 状态（目前不需要重置，因为使用固定数量）
  const resetActivities = useCallback(() => {
    // 可在此处添加重置逻辑
  }, []);

  // 向父组件暴露重置函数
  useEffect(() => {
    if (onReset) {
      // 将重置函数挂载到全局，供父组件调用
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
      className="bg-white rounded-lg border border-gray-200 h-full flex flex-col"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Activities</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <select className="w-full px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All categories</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Household
            </label>
            <div className="relative">
              <select className="w-full px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All households</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <select className="w-full px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All time</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Activities content */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {visibleActivities.map((activity) => (
            <div
              key={activity.id}
              className="group px-6 py-4 hover:bg-gray-50 transition-colors relative"
            >
              {/* Top right action bar */}
              <div className="absolute -top-3 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white rounded-md shadow-sm p-1">
                <div className="relative group/tooltip">
                  <button className="p-1 hover:bg-gray-100 rounded flex items-center justify-center">
                    <PanelRight className="w-4 h-4 text-gray-500" />
                  </button>
                  {/* View details tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    <div className="bg-gray-900 text-white text-sm px-2 py-1 rounded shadow-lg">
                      View details
                    </div>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded flex items-center justify-center">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Activity icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative ${getActivityColor(activity.type)}`}
                >
                  {getActivityIcon(activity.type)}
                  {activity.completed && (
                    <CheckCircle className="absolute w-3 h-3 text-green-600 bg-white rounded-full -bottom-0.5 -right-0.5" />
                  )}
                </div>

                {/* Activity content with text and date on same line */}
                <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">
                        {activity.user.name}
                      </span>{' '}
                      {activity.action}
                      {activity.target && (
                        <>
                          {' '}
                          <span className="font-semibold text-gray-900">
                            {activity.target}
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Date aligned with text */}
                  <div className="text-xs text-gray-500 flex-shrink-0">
                    {activity.time}
                  </div>
                </div>
              </div>

              {/* Additional content below icon */}
              <div className="ml-[52px] pr-24">
                {/* Description */}
                {activity.description && (
                  <p className="text-sm text-gray-600 mt-2 mb-3">
                    {activity.description}
                  </p>
                )}

                {/* Due date badge */}
                {activity.dueDate && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      type="pill-color"
                      color="error"
                      size="sm"
                      className="text-xs"
                    >
                      <CircleAlert className="w-3 h-3 mr-1" />
                      {activity.dueDate}
                    </Badge>
                  </div>
                )}

                {/* Progress bar */}
                {activity.progress && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">
                        {activity.description?.split('.')[0]}
                      </span>
                      <span className="text-xs text-gray-600">
                        Steps {activity.progress.current}/
                        {activity.progress.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(activity.progress.current / activity.progress.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
