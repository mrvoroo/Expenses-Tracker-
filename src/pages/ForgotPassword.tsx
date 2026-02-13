import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../components/shared/Button';
import { resetPassword } from '../services/authService';
import { toast } from 'react-toastify';

interface ForgotFormData {
  email: string;
}

export function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ForgotFormData>();
  const email = watch('email');

  async function onSubmit(data: ForgotFormData) {
    setLoading(true);
    try {
      await resetPassword(data.email);
      setSent(true);
      toast.success('تم إرسال رابط إعادة التعيين إلى بريدك');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'فشل الإرسال. تحقق من البريد أو جرّب لاحقاً.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">نسيت كلمة المرور</h1>
        <p className="text-center text-sm text-muted-foreground mb-6">
          أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
        </p>
        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-foreground">
              تم إرسال رسالة إلى <strong>{email}</strong>. راجع صندوق الوارد أو البريد المزعج واتبع الرابط.
            </p>
            <Link to="/login">
              <Button variant="secondary" fullWidth>العودة لتسجيل الدخول</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                {...register('email', { required: 'أدخل البريد الإلكتروني' })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" fullWidth loading={loading}>
              إرسال رابط إعادة التعيين
            </Button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-primary font-medium hover:underline">
            ← العودة لتسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
