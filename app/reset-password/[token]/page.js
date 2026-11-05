import AuthForm from '@/components/auth/AuthForm';
export const metadata = { title: 'Reset password', robots: { index: false } };
export default function Reset({ params }) { return <AuthForm mode="reset" token={params.token} />; }
