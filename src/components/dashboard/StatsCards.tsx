import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../contexts/CurrencyContext';

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  variant?: 'default' | 'primary' | 'warning';
}

const variantStyles = {
  default: 'bg-card border-border',
  primary: 'bg-primary/10 border-primary/30 text-primary',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400',
};

export function StatCard({ title, value, subtitle, variant = 'default' }: StatCardProps) {
  const { currency } = useCurrency();
  return (
    <div className={`p-4 rounded-xl border ${variantStyles[variant]}`}>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold mt-1">{formatCurrency(value, currency)}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

interface StatsCardsProps {
  totalSpent: number;
  budget: number;
  monthName?: string;
}

export function StatsCards({ totalSpent, budget, monthName }: StatsCardsProps) {
  const remaining = Math.max(0, budget - totalSpent);
  const percentUsed = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="إجمالي المصروف هذا الشهر"
        value={totalSpent}
        subtitle={monthName}
        variant="primary"
      />
      <StatCard title="الميزانية الشهرية" value={budget} />
      <StatCard
        title="المتبقي"
        value={remaining}
        subtitle={percentUsed <= 100 ? `${100 - percentUsed}% متبقي` : 'تجاوز الميزانية'}
        variant={percentUsed >= 100 ? 'warning' : 'default'}
      />
    </div>
  );
}
