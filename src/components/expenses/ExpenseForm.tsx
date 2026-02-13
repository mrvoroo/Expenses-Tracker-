import { useForm } from 'react-hook-form';
import type { ExpenseFormData } from '../../types/expense.types';
import { useCurrency, useExpenseCategories } from '../../contexts/CurrencyContext';
import { Button } from '../shared/Button';

interface ExpenseFormProps {
  defaultDate?: string;
  initialValues?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
}

export function ExpenseForm({ defaultDate, initialValues, onSubmit, onCancel }: ExpenseFormProps) {
  const { currency } = useCurrency();
  const expenseCategories = useExpenseCategories();
  const today = defaultDate ?? new Date().toISOString().split('T')[0];
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ExpenseFormData>({
    defaultValues: {
      amount: initialValues?.amount ?? (undefined as unknown as number),
      category: initialValues?.category ?? 'other',
      description: initialValues?.description ?? '',
      date: initialValues?.date ?? today,
    },
  });

  async function handleFormSubmit(data: ExpenseFormData) {
    await onSubmit({
      ...data,
      amount: Number(data.amount),
      date: data.date,
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          المبلغ ({currency})
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background"
          {...register('amount', {
            required: 'أدخل المبلغ',
            min: { value: 0.01, message: 'المبلغ يجب أن يكون أكبر من صفر' },
            valueAsNumber: true,
          })}
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          الفئة
        </label>
        <select
          id="category"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background"
          {...register('category', { required: true })}
          onChange={(e) => setValue('category', e.target.value)}
        >
          {expenseCategories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          سبب المصروف أو الوصف <span className="text-muted-foreground font-normal">(اختياري)</span>
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="مثال: سفر السويس، إصلاح السيارة، أو أي سبب تريده..."
          className="w-full px-4 py-2 rounded-lg border border-border bg-background resize-y min-h-[80px]"
          {...register('description')}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          أضف أسباباً أو ملاحظات لمصروفك كما تريد
        </p>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          التاريخ
        </label>
        <input
          id="date"
          type="date"
          className="w-full px-4 py-2 rounded-lg border border-border bg-background"
          {...register('date', { required: true })}
        />
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            إلغاء
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          حفظ
        </Button>
      </div>
    </form>
  );
}
