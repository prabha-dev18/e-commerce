'use client';
import Button from '@/components/ui/Button';

export default function Error({ reset }) {
  return (
    <div className="container-x flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl">Something went wrong</h1>
      <p>This page could not load. Please try again.</p>
      <div className="flex gap-3"><Button onClick={() => reset()}>Try again</Button><Button href="/" variant="outline">Go home</Button></div>
    </div>
  );
}
