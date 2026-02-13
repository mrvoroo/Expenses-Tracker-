import type { ExpenseCategory } from '../types/expense.types';

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: 'food', label: 'طعام', icon: '🍽️' },
  { value: 'transport', label: 'مواصلات', icon: '🚗' },
  { value: 'shopping', label: 'تسوق', icon: '🛒' },
  { value: 'bills', label: 'فواتير', icon: '📄' },
  { value: 'entertainment', label: 'ترفيه', icon: '🎬' },
  { value: 'other', label: 'أخرى', icon: '📌' },
];

export const STORAGE_KEYS = {
  PENDING_EXPENSES: 'pending_expenses',
  OFFLINE_MODE: 'offline_mode',
  THEME: 'theme',
} as const;

export const DEFAULT_BUDGET = {
  monthlyBudget: 5000,
  alertThreshold: 80,
  currency: 'ج.م',
} as const;

export const CURRENCIES = [
  // مصر والخليج والجزيرة
  { value: 'ج.م', label: 'جنيه مصري' },
  { value: 'SAR', label: 'ريال سعودي' },
  { value: 'AED', label: 'درهم إماراتي' },
  { value: 'KWD', label: 'دينار كويتي' },
  { value: 'BHD', label: 'دينار بحريني' },
  { value: 'OMR', label: 'ريال عماني' },
  { value: 'QAR', label: 'ريال قطري' },
  { value: 'YER', label: 'ريال يمني' },
  // بلاد الشام والعراق
  { value: 'JOD', label: 'دينار أردني' },
  { value: 'IQD', label: 'دينار عراقي' },
  { value: 'SYP', label: 'ليرة سورية' },
  { value: 'LBP', label: 'ليرة لبنانية' },
  // إيران وتركيا
  { value: 'IRR', label: 'ريال إيراني' },
  { value: 'TRY', label: 'ليرة تركية' },
  // المغرب العربي
  { value: 'DZD', label: 'دينار جزائري' },
  { value: 'TND', label: 'دينار تونسي' },
  { value: 'LYD', label: 'دينار ليبي' },
  { value: 'MAD', label: 'درهم مغربي' },
  // السودان وأخرى
  { value: 'SDG', label: 'جنيه سوداني' },
  { value: 'DJF', label: 'فرنك جيبوتي' },
  { value: 'SOS', label: 'شلن صومالي' },
  // عملات عالمية
  { value: 'USD', label: 'دولار أمريكي' },
  { value: 'EUR', label: 'يورو' },
  { value: 'GBP', label: 'جنيه إسترليني' },
] as const;
