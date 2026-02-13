import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/shared/Button';
import { useAuth } from '../hooks/useAuth';
import { getBudget, setBudget } from '../services/expenseService';
import { changePassword, isEmailPasswordUser } from '../services/authService';
import { DEFAULT_BUDGET, CURRENCIES } from '../utils/constants';
import { useCurrency } from '../contexts/CurrencyContext';
import { toast } from 'react-toastify';

interface BudgetFormData {
  monthlyBudget: number;
  alertThreshold: number;
  alertsEnabled: boolean;
  currency: string;
}

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function Settings() {
  const { user } = useAuth();
  const { setCurrency, refreshBudget } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [customCategoriesList, setCustomCategoriesList] = useState<{ value: string; label: string }[]>([]);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const canChangePassword = isEmailPasswordUser();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<BudgetFormData>({
    defaultValues: {
      monthlyBudget: DEFAULT_BUDGET.monthlyBudget,
      alertThreshold: DEFAULT_BUDGET.alertThreshold,
      alertsEnabled: true,
      currency: DEFAULT_BUDGET.currency,
    },
  });

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    getBudget(user.uid)
      .then((b) => {
        if (b) {
          reset({
            monthlyBudget: b.monthlyBudget,
            alertThreshold: b.alertThreshold,
            alertsEnabled: b.alertsEnabled,
            currency: b.currency ?? DEFAULT_BUDGET.currency,
          });
          setCustomCategoriesList(b.customCategories ?? []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.uid, reset]);

  async function onSubmit(data: BudgetFormData) {
    if (!user?.uid) return;
    try {
      await setBudget(user.uid, {
        monthlyBudget: Number(data.monthlyBudget),
        categoryBudgets: {},
        alertsEnabled: data.alertsEnabled,
        alertThreshold: Number(data.alertThreshold),
        currency: data.currency || DEFAULT_BUDGET.currency,
        customCategories: customCategoriesList,
      });
      setCurrency(data.currency || DEFAULT_BUDGET.currency);
      await refreshBudget();
      toast.success('تم حفظ الإعدادات');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'فشل الحفظ');
    }
  }

  const passwordForm = useForm<ChangePasswordFormData>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  async function onPasswordSubmit(data: ChangePasswordFormData) {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('كلمة المرور الجديدة غير متطابقة');
      return;
    }
    if (data.newPassword.length < 6) {
      toast.error('كلمة المرور الجديدة 6 أحرف على الأقل');
      return;
    }
    try {
      await changePassword(data.currentPassword, data.newPassword);
      toast.success('تم تغيير كلمة المرور');
      setPasswordChanged(true);
      passwordForm.reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      const err = e as { code?: string; message?: string };
      if (err?.code === 'auth/invalid-credential') {
        toast.error('كلمة السر القديمة خطأ');
      } else {
        toast.error(err?.message ?? 'فشل تغيير كلمة المرور. تحقق من كلمة المرور الحالية.');
      }
    }
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        سجّل الدخول لتعديل الإعدادات.
      </div>
    );
  }

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-xl space-y-10">
      <h1 className="text-2xl font-bold">الإعدادات</h1>

      <section>
        <h2 className="text-lg font-semibold mb-4">الميزانية والتنبيهات</h2>
        <form id="settings-budget-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="currency" className="block text-sm font-medium mb-1">
              العملة
            </label>
            <select
              id="currency"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              {...register('currency')}
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label} ({c.value})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="monthlyBudget" className="block text-sm font-medium mb-1">
              الميزانية الشهرية
            </label>
            <input
              id="monthlyBudget"
              type="number"
              min="0"
              step="1"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              {...register('monthlyBudget', { required: true, valueAsNumber: true })}
            />
          </div>
          <div>
            <label htmlFor="alertThreshold" className="block text-sm font-medium mb-1">
              تنبيه عند استهلاك (%) من الميزانية
            </label>
            <input
              id="alertThreshold"
              type="number"
              min="1"
              max="100"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              {...register('alertThreshold', { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              مثال: 80 يعني إظهار تنبيه عند صرف 80% من الميزانية
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="alertsEnabled"
              type="checkbox"
              className="w-4 h-4 rounded border-border"
              {...register('alertsEnabled')}
            />
            <label htmlFor="alertsEnabled" className="text-sm font-medium">
              تفعيل التنبيهات
            </label>
          </div>
        </form>
      </section>

      <section className="pt-6 border-t border-border">
        <h2 className="text-lg font-semibold mb-4">فئات المصاريف المخصصة</h2>
        <p className="text-sm text-muted-foreground mb-4">
          أضف فئات جديدة تظهر عند إضافة مصروف (مع الفئات الافتراضية: طعام، مواصلات، تسوق، إلخ).
        </p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategoryLabel}
            onChange={(e) => setNewCategoryLabel(e.target.value)}
            placeholder="اسم الفئة الجديدة"
            className="flex-1 px-4 py-2 rounded-lg border border-border bg-background"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              const label = newCategoryLabel.trim();
              if (!label) return;
              const value = 'custom_' + Date.now();
              setCustomCategoriesList((prev) => [...prev, { value, label }]);
              setNewCategoryLabel('');
              toast.success('تمت إضافة الفئة. احفظ الإعدادات لتطبيق التغيير.');
            }}
          >
            إضافة
          </Button>
        </div>
        {customCategoriesList.length > 0 && (
          <ul className="space-y-2">
            {customCategoriesList.map((cat) => (
              <li
                key={cat.value}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted"
              >
                <span>{cat.label}</span>
                <button
                  type="button"
                  onClick={() => setCustomCategoriesList((prev) => prev.filter((c) => c.value !== cat.value))}
                  className="text-red-600 hover:underline text-sm"
                >
                  حذف
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {canChangePassword && (
        <section className="pt-6 border-t border-border">
          <h2 className="text-lg font-semibold mb-4">تغيير كلمة المرور</h2>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                كلمة المرور الحالية
              </label>
              <input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                {...passwordForm.register('currentPassword', { required: 'أدخل كلمة المرور الحالية' })}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                كلمة المرور الجديدة
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                {...passwordForm.register('newPassword', {
                  required: 'أدخل كلمة المرور الجديدة',
                  minLength: { value: 6, message: '6 أحرف على الأقل' },
                })}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                تأكيد كلمة المرور الجديدة
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                {...passwordForm.register('confirmPassword', { required: 'أعد إدخال كلمة المرور الجديدة' })}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" loading={passwordForm.formState.isSubmitting}>
              تغيير كلمة المرور
            </Button>
            {passwordChanged && (
              <p className="text-sm text-green-600">تم تغيير كلمة المرور بنجاح.</p>
            )}
          </form>
        </section>
      )}

      {!canChangePassword && user && (
        <section className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            تم تسجيل الدخول عبر Google. لتغيير كلمة المرور استخدم إعدادات حساب Google.
          </p>
        </section>
      )}

      <section className="pt-8 border-t border-border">
        <Button
          type="submit"
          form="settings-budget-form"
          loading={isSubmitting}
        >
          حفظ التغييرات
        </Button>
      </section>
    </div>
  );
}
