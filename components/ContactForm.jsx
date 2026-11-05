'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { contactSchema } from '@/lib/validations';

const fields = [['name', 'Your name', 'text', 'name'], ['email', 'Email', 'email', 'email'], ['subject', 'Subject (optional)', 'text', 'off']];
export default function ContactForm() {
  const [sent, setSent] = useState('');
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(contactSchema) });
  const onSubmit = async (v) => {
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Could not send your message');
      setSent(j.message); reset();
    } catch (e) { toast.error(e.message); }
  };
  const cls = 'w-full rounded-xl bg-background px-4 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent aria-[invalid=true]:ring-highlight';
  if (sent) return <p className="rounded-2xl bg-secondary p-6 text-primary" role="status">{sent}</p>;
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {fields.map(([f, l, t, a]) => (
        <div key={f}><label htmlFor={`c-${f}`} className="mb-1.5 block text-sm font-medium text-primary">{l}</label>
          <input id={`c-${f}`} type={t} autoComplete={a} aria-invalid={!!errors[f]} {...register(f)} className={`${cls} h-12`} />
          {errors[f] && <p className="mt-1 text-xs text-highlight" role="alert">{errors[f].message}</p>}</div>
      ))}
      <div><label htmlFor="c-message" className="mb-1.5 block text-sm font-medium text-primary">Message</label>
        <textarea id="c-message" rows={5} aria-invalid={!!errors.message} {...register('message')} className={`${cls} p-4`} />
        {errors.message && <p className="mt-1 text-xs text-highlight" role="alert">{errors.message.message}</p>}</div>
      <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send message'}</Button>
    </form>
  );
}
