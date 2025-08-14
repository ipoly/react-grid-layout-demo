import { Avatar } from '@/untitled_ui/base/avatar/avatar';
import { Badge } from '@/untitled_ui/base/badges/badges';
import { Button } from '@/untitled_ui/base/buttons/button';
import { 
  Filter, 
  MoreHorizontal, 
  MessageSquare, 
  CheckCircle, 
  FileText, 
  Mail, 
  Archive,
  DollarSign,
  Calendar,
  User,
  Link2
} from 'lucide-react';
import { useState, useCallback, useEffect, useRef } from 'react';

interface Activity {
  id: string;
  type: 'note' | 'task' | 'email' | 'file' | 'opportunity' | 'event';
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  time: string;
  description?: string;
  progress?: number;
  tags?: string[];
  attachments?: Array<{
    name: string;
    type: string;
  }>;
}

interface ActivitiesProps {
  onReset?: () => void;
}

export const Activities = ({ onReset }: ActivitiesProps) => {
  const [activeTab, setActiveTab] = useState('Activities');
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const tabs = ['Activities', 'Tasks', 'Notes', 'Emails', 'Vault', 'Details'];

  const activities: Activity[] = [
    {
      id: '1',
      type: 'note',
      user: { name: 'Alex Chen' },
      action: 'created a note for',
      target: 'Taylor Smith',
      time: '2 hours ago',
      description: 'Retirement\n\nThe probability of success refers to the likelihood that a desired outcome will occur in a given situation or experiment. It\'s a measure of the chance that a particular event or series of events will lead to the intended res...',
      tags: ['2']
    },
    {
      id: '2',
      type: 'note',
      user: { name: 'Alex Chen' },
      action: 'created a note for',
      target: 'Taylor Smith',
      time: '2 hours ago',
      description: 'Phone call\n\nSpoke to Taylor today to explain what the probability of success entails. She was concerned with a 50% pos so we scheduled a meeting to review the plan for next week.',
      tags: ['2']
    },
    {
      id: '3',
      type: 'file',
      user: { name: 'Alex Chen' },
      action: 'uploaded 3 files under folder Tax / Tax Statements',
      time: 'One day ago',
      attachments: [
        { name: 'September2024Tax.doc', type: 'doc' },
        { name: 'September2024Tax.png', type: 'png' },
        { name: 'September2024Tax.png', type: 'png' }
      ],
      tags: ['3']
    },
    {
      id: '4',
      type: 'opportunity',
      user: { name: 'Alex Chen' },
      action: 'created a financial plan for',
      target: 'Taylor Smith',
      time: '2 hours ago',
      description: 'An express plan was created.',
      tags: ['2']
    },
    {
      id: '5',
      type: 'task',
      user: { name: 'Taylor Smith' },
      action: 'has been completed.',
      time: '03/20/2025',
      description: 'A workflow step for Taylor Smith has been completed.\n\nThe [identify opportunity] step of the [Roth conversion] workflow was completed.',
      progress: 100,
      tags: ['0']
    },
    {
      id: '6',
      type: 'opportunity',
      user: { name: 'Alex Chen' },
      action: 'created a new opportunity.',
      time: '03/20/2025',
      description: 'Sam Smith\nTarget close: 4/28/2025',
      tags: ['0']
    },
    {
      id: '7',
      type: 'note',
      user: { name: 'Jordan Davis' },
      action: 'created a note for',
      target: 'Wilson Family',
      time: '4 hours ago',
      description: 'Investment Discussion\n\nDiscussed various investment options with the Wilson family. They are interested in ESG funds and have a moderate risk tolerance. Next steps: prepare portfolio recommendations.',
      tags: ['1']
    },
    {
      id: '8',
      type: 'task',
      user: { name: 'Morgan Lee' },
      action: 'completed task',
      time: '5 hours ago',
      description: 'Quarterly review completed for Anderson account. All documents have been updated and filed appropriately.',
      progress: 100,
      tags: ['0']
    },
    {
      id: '9',
      type: 'file',
      user: { name: 'Casey Rodriguez' },
      action: 'uploaded 2 files under folder Documents / Estate Planning',
      time: '6 hours ago',
      attachments: [
        { name: 'Estate_Plan_2025.pdf', type: 'pdf' },
        { name: 'Trust_Documents.docx', type: 'doc' }
      ],
      tags: ['2']
    },
    {
      id: '10',
      type: 'opportunity',
      user: { name: 'Alex Chen' },
      action: 'updated opportunity status for',
      target: 'Thompson Account',
      time: '1 day ago',
      description: 'Retirement Planning Opportunity\n\nMoved to proposal stage. Client review scheduled for next week.',
      tags: ['1']
    },
    {
      id: '11',
      type: 'note',
      user: { name: 'Riley Parker' },
      action: 'created a note for',
      target: 'Martinez Family',
      time: '1 day ago',
      description: 'Risk Assessment\n\nCompleted comprehensive risk assessment. Family shows conservative risk profile with focus on capital preservation. Recommended bond-heavy portfolio allocation.',
      tags: ['0']
    },
    {
      id: '12',
      type: 'task',
      user: { name: 'Quinn Anderson' },
      action: 'assigned new task',
      time: '2 days ago',
      description: 'Follow-up required for Cooper insurance review. Schedule meeting to discuss life insurance needs and policy updates.',
      progress: 25,
      tags: ['3']
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <MessageSquare className="w-4 h-4" />;
      case 'task':
        return <CheckCircle className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'file':
        return <FileText className="w-4 h-4" />;
      case 'opportunity':
        return <DollarSign className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'note':
        return 'bg-yellow-100 text-yellow-600';
      case 'task':
        return 'bg-blue-100 text-blue-600';
      case 'email':
        return 'bg-purple-100 text-purple-600';
      case 'file':
        return 'bg-blue-100 text-blue-600';
      case 'opportunity':
        return 'bg-green-100 text-green-600';
      case 'event':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // 模拟加载更多功能
  const loadMore = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setVisibleCount(prev => Math.min(prev + 4, activities.length));
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
    setVisibleCount(4);
    setIsLoading(false);
  }, []);

  // 向父组件暴露重置函数
  useEffect(() => {
    if (onReset) {
      // 将重置函数挂载到全局，供父组件调用
      (window as any).__resetActivities = resetActivities;
    }
    return () => {
      if ((window as any).__resetActivities) {
        delete (window as any).__resetActivities;
      }
    };
  }, [onReset, resetActivities]);

  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-lg border border-gray-200 h-full flex flex-col"
    >
      {/* Header with tabs */}
      <div className="border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 gap-4">
          <div className="flex space-x-4 sm:space-x-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              color="primary"
              size="sm"
              iconLeading={Filter}
            >
              <span className="hidden sm:inline">Filters</span>
              <span className="sm:hidden">Filter</span>
            </Button>
            <Button
              color="tertiary"
              size="sm"
              iconLeading={MoreHorizontal}
              className="p-2"
            />
          </div>
        </div>
      </div>

      {/* Activities content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-5 space-y-4 sm:space-y-6 transition-all duration-500 ease-out">
          {visibleActivities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex space-x-3 sm:space-x-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ 
                animationDelay: index >= visibleCount - 4 ? `${(index - (visibleCount - 4)) * 100}ms` : '0ms' 
              }}
            >
              {/* Activity icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>

              {/* Activity content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 mb-1">
                      <span className="font-medium">{activity.user.name}</span>
                      {' '}{activity.action}
                      {activity.target && (
                        <span className="font-medium"> {activity.target}</span>
                      )}
                    </div>
                    
                    {activity.description && (
                      <div className="text-sm text-gray-600 mb-3 whitespace-pre-line">
                        {activity.description}
                      </div>
                    )}

                    {activity.progress !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{activity.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${activity.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {activity.attachments && (
                      <div className="space-y-2 mb-3">
                        {activity.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-blue-600 truncate">{attachment.name}</span>
                            {index === activity.attachments!.length - 1 && activity.attachments!.length > 1 && (
                              <Badge type="pill-color" color="gray" size="sm">
                                +{activity.attachments!.length - 1}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-3">
                    {activity.tags && (
                      <div className="flex space-x-1">
                        {activity.tags.map((tag, index) => (
                          <Badge key={index} type="pill-color" color="gray" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Show More 按钮 */}
      {(hasMore || isLoading) && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 text-center animate-in fade-in duration-300">
          <Button
            color="link-color"
            size="sm"
            className={`text-blue-600 transition-all duration-200 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Show more'}
          </Button>
        </div>
      )}
    </div>
  );
};