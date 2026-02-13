import type { Expense } from '../../types/expense.types';
import { ExpenseCard } from './ExpenseCard';
import { Loader } from '../shared/Loader';

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export function ExpenseList({
  expenses,
  loading,
  onEdit,
  onDelete,
  emptyMessage = 'لا توجد مصاريف مسجلة',
}: ExpenseListProps) {
  if (loading) return <Loader />;
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }
  return (
    <ul className="space-y-3 list-none p-0 m-0">
      {expenses.map((expense) => (
        <li key={expense.id}>
          <ExpenseCard
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
