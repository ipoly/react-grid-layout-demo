import { CheckCircle } from 'lucide-react';

import { MetricCard } from './MetricCard';

export const TasksMetric = () => {
  return (
    <MetricCard
      title="Tasks due today"
      value="91%"
      subtitle="of total assets"
      icon={<CheckCircle className="w-6 h-6 text-gray-600" />}
    />
  );
};
