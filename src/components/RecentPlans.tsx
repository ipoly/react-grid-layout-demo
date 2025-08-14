import { Input } from '@/untitled_ui/base/input/input';
import { Button } from '@/untitled_ui/base/buttons/button';
import { Calendar, Plus, MoreHorizontal, Search } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  date: string;
  time: string;
}

export const RecentPlans = () => {
  const plans: Plan[] = [
    { id: '1', name: 'Jordan Kim', date: 'Wednesday', time: '1:00pm' },
    { id: '2', name: 'Morgan Davis', date: 'Wednesday', time: '2:00pm' },
    { id: '3', name: 'Riley Parker', date: 'Wednesday', time: '3:00pm' },
    { id: '4', name: 'Casey Thompson', date: 'Thursday', time: '9:00am' },
    { id: '5', name: 'Alex Rodriguez', date: 'Thursday', time: '10:30am' },
    { id: '6', name: 'Sam Wilson', date: 'Thursday', time: '2:00pm' },
    { id: '7', name: 'Taylor Johnson', date: 'Friday', time: '11:00am' },
    { id: '8', name: 'Jordan Lee', date: 'Friday', time: '1:30pm' },
    { id: '9', name: 'Drew Martinez', date: 'Friday', time: '3:15pm' },
    { id: '10', name: 'Quinn Anderson', date: 'Monday', time: '9:30am' },
    { id: '11', name: 'Riley Cooper', date: 'Monday', time: '11:15am' },
    { id: '12', name: 'Phoenix Brown', date: 'Monday', time: '2:45pm' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent plans</h2>
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

      <div className="mb-4">
        <Input
          placeholder="Search"
          icon={Search}
          shortcut="⌘K"
          className="w-full"
        />
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {plans.map((plan) => (
          <div key={plan.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex-1">
              <div className="font-medium text-gray-900">{plan.name}</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {plan.date} {plan.time}
              </div>
              <Button
                color="tertiary"
                size="sm"
                iconLeading={Calendar}
                className="p-2"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Button
          color="link-color"
          size="sm"
          className="text-blue-600"
        >
          View all
        </Button>
      </div>
    </div>
  );
};