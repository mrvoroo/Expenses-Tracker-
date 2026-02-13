import { useState, useEffect } from 'react';
import { StatsCards } from '../components/dashboard/StatsCards';
import { BudgetAlert } from '../components/dashboard/BudgetAlert';
import { CategoryChart } from '../components/dashboard/Charts/CategoryChart';
import { MonthlyTrendChart } from '../components/dashboard/Charts/MonthlyTrendChart';
import { useAuth } from '../hooks/useAuth';
import { useExpenses } from '../hooks/useExpenses';
import { getBudget } from '../services/expenseService';
import type { Budget } from '../types/expense.types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale/ar';

export function Dashboard() {
  const { user } = useAuth();
  const { expenses, loading, getMonthExpenses } = useExpenses(user?.uid);
  const [budget, setBudget] = useState<Budget | null>(null);

  const now = new Date();
  const monthExpenses = getMonthExpenses(now.getFullYear(), now.getMonth());
  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  useEffect(() => {
    if (!user?.uid) return;
    getBudget(user.uid).then(setBudget).catch(() => setBudget(null));
  }, [user?.uid]);

  const monthlyBudget = budget?.monthlyBudget ?? 0;
  const alertThreshold = budget?.alertThreshold ?? 80;
  const alertsEnabled = budget?.alertsEnabled ?? true;
  const monthName = format(now, 'MMMM yyyy', { locale: ar });

  if (!user) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        سجّل الدخول لعرض لوحة التحكم وتتبع مصاريفك.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold">لوحة التحكم</h1>
      <BudgetAlert
        totalSpent={totalSpent}
        budget={monthlyBudget}
        threshold={alertThreshold}
        enabled={alertsEnabled}
      />
      <StatsCards
        totalSpent={totalSpent}
        budget={monthlyBudget}
        monthName={monthName}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-semibold mb-4">المصاريف حسب الفئة (هذا الشهر)</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center">جاري التحميل...</div>
          ) : (
            <CategoryChart expenses={monthExpenses} />
          )}
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-semibold mb-4">اتجاه الإنفاق الشهري</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center">جاري التحميل...</div>
          ) : (
            <MonthlyTrendChart expenses={expenses} monthsCount={6} />
          )}
        </div>
      </div>
    </div>
  );
}
