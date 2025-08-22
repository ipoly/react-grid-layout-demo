import { CheckCircle } from 'lucide-react';

import { MetricCard } from '../../ui/MetricCard';

export const TasksMetric = () => {
  return (
    <MetricCard
      title="Tasks due today"
      value="91%"
      subtitle="of total assets"
      icon={CheckCircle}
      iconColor="success"
    />
  );
};
