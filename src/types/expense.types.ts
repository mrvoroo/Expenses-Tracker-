export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'entertainment'
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: string; // قيمة من الفئات الافتراضية أو فئة مخصصة
  description: string;
  date: string;
  userId: string;
  createdAt: string;
}

export interface Budget {
  userId: string;
  monthlyBudget: number;
  categoryBudgets: Record<string, number>;
  alertsEnabled: boolean;
  alertThreshold: number;
  currency?: string;
  customCategories?: { value: string; label: string }[];
}

export interface ExpenseFormData {
  amount: number;
  category: string;
  description: string;
  date: string;
}
