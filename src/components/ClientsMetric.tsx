import { Users } from 'lucide-react';

import { MetricCard } from './MetricCard';

export const ClientsMetric = () => {
  return (
    <MetricCard
      title="Number of clients"
      value="13"
      change={{
        value: '2',
        type: 'positive',
        period: '6/30',
      }}
      icon={Users}
      iconColor="gray"
    />
  );
};
