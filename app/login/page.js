import AuthForm from '@/components/auth/AuthForm';
export const metadata = { title: 'Log in', robots: { index: false } };
export default function Login({ searchParams }) {
  const cb = typeof searchParams?.callbackUrl === 'string' && searchParams.callbackUrl.startsWith('/') ? searchParams.callbackUrl : '/account';
  return <AuthForm mode="login" callbackUrl={cb} verified={searchParams?.verified} />;
}
