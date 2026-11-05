import StoreLocator from '@/components/StoreLocator';

export const metadata = { title: 'Store locator', description: 'Find a Lumière store near you: address, opening hours and directions.', alternates: { canonical: '/stores' } };
export default function Stores() {
  return (
    <div className="container-x py-12">
      <h1 className="text-3xl sm:text-5xl">Find a store</h1>
      <span className="mt-4 mb-2 block h-px w-14 bg-accent" />
      <p className="mb-8">Try shades in person and get help from our beauty advisors.</p>
      <StoreLocator />
    </div>
  );
}
