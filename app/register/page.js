import AuthForm from '@/components/auth/AuthForm';
export const metadata = { title: 'Create account', robots: { index: false } };
export default function Register() { return <AuthForm mode="register" />; }
