import type { Expense } from '../../types/expense.types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCurrency, useExpenseCategories } from '../../contexts/CurrencyContext';

interface ExpenseCardProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

export function ExpenseCard({ expense, onEdit, onDelete }: ExpenseCardProps) {
  const { currency } = useCurrency();
  const expenseCategories = useExpenseCategories();
  const category = expenseCategories.find((c) => c.value === expense.category);

  return (
    <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xl" title={category?.label}>
            {category?.icon ?? '📌'}
          </span>
          <span className="font-medium truncate">{expense.description?.trim() || '— بدون وصف'}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {formatDate(expense.date)} · {category?.label ?? expense.category}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-primary">{formatCurrency(expense.amount, currency)}</span>
        <div className="flex gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(expense)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
              aria-label="تعديل"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(expense.id)}
              className="p-2 rounded-lg hover:bg-red-100 text-red-600"
              aria-label="حذف"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
