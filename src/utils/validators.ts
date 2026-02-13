import { EXPENSE_CATEGORIES } from './constants';

const BUILTIN_CATEGORIES = new Set<string>(EXPENSE_CATEGORIES.map((c) => c.value));

/** يقبل الفئات الافتراضية أو الفئات المخصصة (التي تبدأ بـ custom_) */
export function isValidCategory(value: string): boolean {
  return BUILTIN_CATEGORIES.has(value) || value.startsWith('custom_');
}

export function validateAmount(amount: unknown): amount is number {
  return typeof amount === 'number' && !Number.isNaN(amount) && amount > 0;
}

export function validateDescription(description: unknown): description is string {
  return typeof description === 'string' && description.trim().length > 0;
}

export function validateDate(date: unknown): date is string {
  if (typeof date !== 'string') return false;
  const d = new Date(date);
  return !Number.isNaN(d.getTime());
}
