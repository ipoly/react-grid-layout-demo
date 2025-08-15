import { Badge } from '@/untitled_ui/base/badges/badges';
import { Button } from '@/untitled_ui/base/buttons/button';

import { AlertTriangle, MoreHorizontal, Plus } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  isOverdue: boolean;
}

export const Tasks = () => {
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Review Wilson portfolio Review Wilson p...',
      dueDate: '4/21/2025',
      isOverdue: true,
    },
    {
      id: '2',
      title: 'Review Wilson portfolio',
      dueDate: '4/21/2025',
      isOverdue: true,
    },
    {
      id: '3',
      title: 'Review Wilson portfolio',
      dueDate: '4/21/2025',
      isOverdue: true,
    },
    {
      id: '4',
      title: 'Complete quarterly risk assessment for Thompson account',
      dueDate: '4/22/2025',
      isOverdue: false,
    },
    {
      id: '5',
      title: 'Update beneficiary information for Rodriguez family',
      dueDate: '4/23/2025',
      isOverdue: false,
    },
    {
      id: '6',
      title: 'Prepare retirement analysis report',
      dueDate: '4/25/2025',
      isOverdue: false,
    },
    {
      id: '7',
      title: 'Schedule follow-up meeting with Lee family',
      dueDate: '4/22/2025',
      isOverdue: false,
    },
    {
      id: '8',
      title: 'Review and approve expense policy changes',
      dueDate: '4/20/2025',
      isOverdue: true,
    },
    {
      id: '9',
      title: 'Process new client onboarding documents',
      dueDate: '4/21/2025',
      isOverdue: false,
    },
    {
      id: '10',
      title: 'Update investment allocation recommendations',
      dueDate: '4/24/2025',
      isOverdue: false,
    },
    {
      id: '11',
      title: 'Conduct portfolio rebalancing for Martinez account',
      dueDate: '4/26/2025',
      isOverdue: false,
    },
    {
      id: '12',
      title: 'Review insurance coverage for Anderson family',
      dueDate: '4/23/2025',
      isOverdue: false,
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
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

      <div className="space-y-4 flex-1 overflow-y-auto">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start space-x-3">
            <input
              type="checkbox"
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-900 mb-1">{task.title}</div>
              <div className="flex items-center space-x-2">
                {task.isOverdue && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
                <Badge
                  type="pill-color"
                  color={task.isOverdue ? 'error' : 'gray'}
                  size="sm"
                >
                  {task.isOverdue ? 'Overdue: ' : 'Due: '}
                  {task.dueDate}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <Button color="link-color" size="sm" className="text-blue-600">
          View all
        </Button>
      </div>
    </div>
  );
};
