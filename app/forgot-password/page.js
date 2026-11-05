import AuthForm from '@/components/auth/AuthForm';
export const metadata = { title: 'Forgot password', robots: { index: false } };
export default function Forgot() { return <AuthForm mode="forgot" />; }
