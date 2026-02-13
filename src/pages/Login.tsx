import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../components/shared/Button';
import { signIn } from '../services/authService';
import { isFirebaseConfigured } from '../services/firebase';
import { toast } from 'react-toastify';

interface LoginFormData {
  email: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  async function onSubmit(data: LoginFormData) {
    if (!isFirebaseConfigured) return;
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      toast.success('تم تسجيل الدخول');
      navigate('/');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
        {!isFirebaseConfigured && (
          <div className="mb-6 p-4 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-200 text-sm">
            <p className="font-semibold mb-2">الاتصال بـ Firebase غير مفعّل</p>
            <p className="mb-2">إذا الموقع منشور على Netlify:</p>
            <ol className="list-decimal list-inside space-y-1 mr-2">
              <li>ادخل Netlify → موقعك → Site configuration → Environment variables</li>
              <li>أضف: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID</li>
              <li>انسخ القيم من ملف .env على جهازك ثم Trigger deploy → Deploy site</li>
            </ol>
          </div>
        )}
        <h1 className="text-2xl font-bold text-center mb-6">تسجيل الدخول</h1>
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
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium">
                كلمة المرور
              </label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              {...register('password', { required: 'أدخل كلمة المرور' })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" fullWidth loading={loading}>
            تسجيل الدخول
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </div>
  );
}
