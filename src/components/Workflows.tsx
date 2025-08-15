import { Button } from '@/untitled_ui/base/buttons/button';

import { ArrowUpRight, MoreHorizontal, Plus } from 'lucide-react';

import { ViewAllLink } from './ui/ViewAllLink';

interface WorkflowItem {
  id: string;
  title: string;
  progress: number;
  isCompleted: boolean;
}

export const Workflows = () => {
  const workflowItems: WorkflowItem[] = [
    {
      id: '1',
      title:
        'The [Identify opportunity] step of the [Roth conversion] workflow was completed.',
      progress: 100,
      isCompleted: true,
    },
    {
      id: '2',
      title: 'Roth Conversion',
      progress: 30,
      isCompleted: false,
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Workflows</h2>
        <div className="flex items-center space-x-2">
          <Button
            color="tertiary"
            size="sm"
            iconLeading={Plus}
            className="p-2"
          />
          <Button
            color="tertiary"
            size="sm"
            iconLeading={MoreHorizontal}
            className="p-2"
          />
        </div>
      </div>

      <div className="space-y-2.5 flex-1 overflow-y-auto">
        {workflowItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="space-y-1">
              <div className="text-sm text-gray-700 leading-relaxed">
                {item.title}
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-lg relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-600 rounded-lg transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <div className="text-sm font-medium text-gray-700 min-w-[2rem] text-right">
                  {item.progress}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ViewAllLink showIcon={true} icon={ArrowUpRight} align="right" />
    </div>
  );
};
