import { DollarSign } from 'lucide-react';

import { MetricCard } from '../../ui/MetricCard';

export const AssetsMetric = () => {
  return (
    <MetricCard
      title="Total invested assets"
      value="$19,399,391"
      change={{
        value: '23K',
        type: 'negative',
        period: '6/30',
      }}
      icon={DollarSign}
      iconColor="brand"
    />
  );
};
