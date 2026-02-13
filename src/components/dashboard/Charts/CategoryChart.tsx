import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LabelList,
} from 'recharts';
import { formatCurrency } from '../../../utils/formatters';
import { useCurrency, useExpenseCategories } from '../../../contexts/CurrencyContext';
import type { Expense } from '../../../types/expense.types';

const COLORS = [
  '#0d9488', // primary teal
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal-500
];

interface CategoryChartProps {
  expenses: Expense[];
}

const CustomTooltip = ({ active, payload, currency }: { active?: boolean; payload?: Array<{ name: string; value?: number }>; currency: string }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const value = typeof item.value === 'number' ? item.value : 0;
  return (
    <div
      className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg"
      style={{ minWidth: 160 }}
    >
      <p className="font-semibold text-foreground border-b border-border pb-2 mb-2">
        {item.name}
      </p>
      <p className="text-sm text-muted-foreground">
        المبلغ: <span className="font-medium text-foreground">{formatCurrency(value, currency)}</span>
      </p>
    </div>
  );
};

export function CategoryChart({ expenses }: CategoryChartProps) {
  const { currency } = useCurrency();
  const expenseCategories = useExpenseCategories();
  const byCategory = expenseCategories.map((cat) => ({
    name: cat.label,
    value: expenses
      .filter((e) => e.category === cat.value)
      .reduce((sum, e) => sum + e.amount, 0),
  })).filter((d) => d.value > 0);

  const total = byCategory.reduce((s, d) => s + d.value, 0);
  const dataWithLabel = byCategory.map((d) => ({
    ...d,
    displayLabel: total > 0 ? `${d.name} ${((d.value / total) * 100).toFixed(0)}%` : d.name,
  }));

  if (byCategory.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        لا توجد بيانات للعرض
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
          <Pie
            data={dataWithLabel}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={88}
            innerRadius={48}
            paddingAngle={2}
            stroke="transparent"
          >
            {dataWithLabel.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
            <LabelList
              dataKey="displayLabel"
              position="outside"
              className="fill-foreground"
              style={{ fontSize: 13, fontWeight: 500 }}
            />
          </Pie>
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 12 }}
            formatter={(value, entry) => {
              const item = byCategory.find((d) => d.name === value);
              const amount = item ? formatCurrency(item.value, currency) : '';
              const pct = item && total > 0 ? ((item.value / total) * 100).toFixed(0) : '';
              return (
                <span className="text-sm text-foreground inline-flex items-center gap-2">
                  <span style={{ color: (entry as { color?: string }).color }}>●</span>
                  {value} — {amount} ({pct}%)
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
