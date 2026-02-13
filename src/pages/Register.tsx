import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../components/shared/Button';
import { signUp, signInWithGoogle } from '../services/authService';
import { toast } from 'react-toastify';

interface RegisterFormData {
  displayName: string;
  email: string;
  password: string;
}

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

  async function onSubmit(data: RegisterFormData) {
    setLoading(true);
    try {
      await signUp(data.email, data.password, data.displayName || undefined);
      toast.success('تم إنشاء الحساب');
      navigate('/');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleSignIn() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('تم إنشاء الحساب وتسجيل الدخول');
      navigate('/');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'فشل التسجيل عبر Google');
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">إنشاء حساب</h1>
        <button
          type="button"
          onClick={onGoogleSignIn}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50 mb-4"
        >
          <FcGoogle className="w-5 h-5" />
          <span>{googleLoading ? 'جاري التسجيل...' : 'المتابعة مع Google'}</span>
        </button>
        <div className="relative my-4">
          <span className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </span>
          <span className="relative flex justify-center text-xs text-muted-foreground bg-card px-2">
            أو
          </span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium mb-1">
              الاسم (اختياري)
            </label>
            <input
              id="displayName"
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              {...register('displayName')}
            />
          </div>
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
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              {...register('password', {
                required: 'أدخل كلمة المرور',
                minLength: { value: 6, message: 'كلمة المرور 6 أحرف على الأقل' },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" fullWidth loading={loading}>
            إنشاء الحساب
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          لديك حساب؟{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
