import { MetricCard } from './MetricCard';
import { FileText } from 'lucide-react';

export const PlansMetric = () => {
  return (
    <MetricCard
      title="New plans"
      value="203"
      change={{
        value: '20',
        type: 'positive',
        period: '6/30'
      }}
      icon={<FileText className="w-6 h-6 text-gray-600" />}
    />
  );
};