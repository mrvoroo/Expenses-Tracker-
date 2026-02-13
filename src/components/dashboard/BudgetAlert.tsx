import { FiAlertTriangle } from 'react-icons/fi';

interface BudgetAlertProps {
  totalSpent: number;
  budget: number;
  threshold: number;
  enabled: boolean;
}

export function BudgetAlert({ totalSpent, budget, threshold, enabled }: BudgetAlertProps) {
  if (!enabled || budget <= 0) return null;
  const percent = Math.round((totalSpent / budget) * 100);
  if (percent < threshold) return null;

  const isOver = percent >= 100;

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-xl border
        ${isOver ? 'bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-300' : 'bg-amber-500/10 border-amber-500/40 text-amber-800 dark:text-amber-200'}
      `}
      role="alert"
    >
      <FiAlertTriangle className="w-6 h-6 flex-shrink-0" />
      <div>
        {isOver ? (
          <p className="font-medium">تجاوزت الميزانية الشهرية! أنفقت {percent}% من الميزانية.</p>
        ) : (
          <p className="font-medium">
            تنبيه: أنفقت {percent}% من الميزانية. أنت عند {threshold}% أو أكثر.
          </p>
        )}
      </div>
    </div>
  );
}
