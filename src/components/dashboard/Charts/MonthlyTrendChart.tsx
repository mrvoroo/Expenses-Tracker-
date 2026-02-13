import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { formatCurrency } from '../../../utils/formatters';
import { useCurrency } from '../../../contexts/CurrencyContext';
import type { Expense } from '../../../types/expense.types';
import { getStartOfMonth, getEndOfMonth } from '../../../utils/formatters';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale/ar';

interface MonthlyTrendChartProps {
  expenses: Expense[];
  monthsCount?: number;
}

interface TooltipPayloadItem {
  payload?: { month: string; total: number };
  value?: number;
}

const CustomBarTooltip = ({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  currency: string;
}) => {
  if (!active || !payload?.length) return null;
  const value = typeof payload[0].value === 'number' ? payload[0].value : payload[0].payload?.total ?? 0;
  const monthLabel = payload[0].payload?.month ?? label ?? '';
  return (
    <div
      className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg"
      style={{ minWidth: 140 }}
    >
      <p className="font-semibold text-foreground border-b border-border pb-2 mb-2">
        {monthLabel}
      </p>
      <p className="text-sm text-muted-foreground">
        الإجمالي: <span className="font-medium text-foreground">{formatCurrency(value, currency)}</span>
      </p>
    </div>
  );
};

export function MonthlyTrendChart({ expenses, monthsCount = 6 }: MonthlyTrendChartProps) {
  const { currency } = useCurrency();
  const now = new Date();
  const data: { month: string; total: number; fullDate: Date }[] = [];

  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = getStartOfMonth(d);
    const end = getEndOfMonth(d);
    const from = start.toISOString().split('T')[0];
    const to = end.toISOString().split('T')[0];
    const total = expenses
      .filter((e) => e.date >= from && e.date <= to)
      .reduce((sum, e) => sum + e.amount, 0);
    data.push({
      month: format(d, 'MMM yyyy', { locale: ar }),
      total,
      fullDate: d,
    });
  }

  if (data.every((d) => d.total === 0)) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        لا توجد بيانات للعرض
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 24, right: 16, left: 16, bottom: 8 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: 'currentColor' }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickLine={false}
          />
          <YAxis
            hide
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomBarTooltip currency={currency} />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Bar
            dataKey="total"
            fill="var(--color-primary)"
            radius={[6, 6, 0, 0]}
            maxBarSize={56}
          >
            <LabelList
              dataKey="total"
              position="top"
              formatter={(value: unknown) => formatCurrency(Number(value) || 0, currency)}
              className="fill-foreground"
              style={{ fontSize: 12, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
