import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-serif text-7xl text-accent">404</p>
      <h1 className="text-3xl">This page isn't here</h1>
      <p>The link may be old or mistyped. Try the shop instead.</p>
      <Button href="/shop">Browse products</Button>
    </div>
  );
}
