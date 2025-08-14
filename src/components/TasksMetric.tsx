import { MetricCard } from './MetricCard';
import { CheckCircle } from 'lucide-react';

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