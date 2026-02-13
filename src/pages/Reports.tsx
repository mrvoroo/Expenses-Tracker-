import { useState } from 'react';
import { CategoryChart } from '../components/dashboard/Charts/CategoryChart';
import { MonthlyTrendChart } from '../components/dashboard/Charts/MonthlyTrendChart';
import { useAuth } from '../hooks/useAuth';
import { useExpenses } from '../hooks/useExpenses';
export function Reports() {
  const { user } = useAuth();
  const { expenses, loading, getMonthExpenses } = useExpenses(user?.uid);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const [year, month] = selectedMonth.split('-').map(Number);
  const monthExpenses = getMonthExpenses(year, month - 1);

  if (!user) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        سجّل الدخول لعرض التقارير.
      </div>
    );
  }

  const months: string[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold">التقارير</h1>
      <div>
        <label htmlFor="report-month" className="block text-sm font-medium mb-2">
          اختر الشهر
        </label>
        <select
          id="report-month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-background"
        >
          {months.map((m) => {
            const [y, mo] = m.split('-').map(Number);
            const date = new Date(y, mo - 1, 1);
            const label = date.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
            return (
              <option key={m} value={m}>
                {label}
              </option>
            );
          })}
        </select>
      </div>
      {loading ? (
        <div className="h-64 flex items-center justify-center">جاري التحميل...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="font-semibold mb-4">توزيع المصاريف حسب الفئة</h2>
            <CategoryChart expenses={monthExpenses} />
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="font-semibold mb-4">اتجاه الإنفاق (آخر 12 شهراً)</h2>
            <MonthlyTrendChart expenses={expenses} monthsCount={12} />
          </div>
        </div>
      )}
    </div>
  );
}
