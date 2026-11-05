'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { loginSchema, registerSchema, forgotSchema, resetSchema } from '@/lib/validations';

const config = {
  login: { title: 'Welcome back', sub: 'Log in to see your orders and saved bag.', schema: loginSchema, fields: ['email', 'password'], cta: 'Log in' },
  register: { title: 'Create your account', sub: 'Save your bag, track orders and earn points.', schema: registerSchema, fields: ['name', 'email', 'phone', 'password'], cta: 'Create account' },
  forgot: { title: 'Forgot your password?', sub: 'Enter your email and we will send a reset link.', schema: forgotSchema, fields: ['email'], cta: 'Send reset link' },
  reset: { title: 'Choose a new password', sub: 'Use at least 8 characters with a letter and a number.', schema: resetSchema.pick({ password: true }), fields: ['password'], cta: 'Update password' },
};
const meta = {
  name: { label: 'Full name', type: 'text', auto: 'name' }, email: { label: 'Email', type: 'email', auto: 'email' },
  phone: { label: 'Mobile number (optional)', type: 'tel', auto: 'tel' }, password: { label: 'Password', type: 'password' },
};
const post = async (url, body) => {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Something went wrong');
  return j;
};

export default function AuthForm({ mode, token, callbackUrl = '/account', verified }) {
  const c = config[mode];
  const router = useRouter();
  const [done, setDone] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(c.schema) });
  const google = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === 'true';

  const login = async (email, password) => {
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) throw new Error('Wrong email or password');
    router.push(callbackUrl); router.refresh();
  };

  const onSubmit = async (v) => {
    try {
      if (mode === 'login') await login(v.email, v.password);
      if (mode === 'register') { await post('/api/auth/register', v); toast.success('Account created'); await login(v.email, v.password); }
      if (mode === 'forgot') setDone((await post('/api/auth/forgot-password', v)).message);
      if (mode === 'reset') { await post('/api/auth/reset-password', { token, password: v.password }); toast.success('Password updated'); router.push('/login'); }
    } catch (e) { toast.error(e.message); }
  };

  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lift sm:p-10">
        <h1 className="text-3xl">{c.title}</h1>
        <p className="mt-2 text-sm">{c.sub}</p>
        {verified === '1' && <p className="mt-4 rounded-xl bg-secondary p-3 text-sm text-primary" role="status">Email verified. You can log in.</p>}
        {verified === '0' && <p className="mt-4 rounded-xl bg-highlight/10 p-3 text-sm text-highlight" role="alert">That verification link is invalid or already used.</p>}

        {done ? <p className="mt-6 rounded-xl bg-secondary p-4 text-sm text-primary" role="status">{done}</p> : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
            {c.fields.map((f) => (
              <div key={f}>
                <label htmlFor={f} className="mb-1.5 block text-sm font-medium text-primary">{meta[f].label}</label>
                <input id={f} type={meta[f].type} autoComplete={meta[f].auto || (mode === 'login' ? 'current-password' : 'new-password')} aria-invalid={!!errors[f]} {...register(f)}
                  className="h-12 w-full rounded-xl bg-background px-4 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent aria-[invalid=true]:ring-highlight" />
                {errors[f] && <p className="mt-1 text-xs text-highlight" role="alert">{errors[f].message}</p>}
              </div>
            ))}
            {mode === 'login' && <div className="text-right"><Link href="/forgot-password" className="text-sm text-accent hover:underline">Forgot password?</Link></div>}
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : c.cta}</Button>
          </form>
        )}

        {google && (mode === 'login' || mode === 'register') && (
          <Button variant="outline" size="lg" className="mt-3 w-full" onClick={() => signIn('google', { callbackUrl })}>Continue with Google</Button>
        )}
        <p className="mt-6 text-center text-sm">
          {mode === 'login' && <>New here? <Link href="/register" className="font-medium text-primary underline">Create an account</Link></>}
          {mode === 'register' && <>Already have an account? <Link href="/login" className="font-medium text-primary underline">Log in</Link></>}
          {(mode === 'forgot' || mode === 'reset') && <Link href="/login" className="font-medium text-primary underline">Back to log in</Link>}
        </p>
      </div>
    </div>
  );
}
