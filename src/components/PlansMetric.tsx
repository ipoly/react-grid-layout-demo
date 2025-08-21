import { FileText } from 'lucide-react';

import { MetricCard } from './MetricCard';

export const PlansMetric = () => {
  return (
    <MetricCard
      title="New plans"
      value="203"
      change={{
        value: '20',
        type: 'positive',
        period: '6/30',
      }}
      icon={FileText}
      iconColor="gray"
    />
  );
};
