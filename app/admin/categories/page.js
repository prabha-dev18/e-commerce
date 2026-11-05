import ResourceManager from '@/components/admin/ResourceManager';
export const metadata = { title: 'Categories' };
export default function Page() {
  return <ResourceManager title="Categories" sub="Slugs must match the category used on products (e.g. skincare)." endpoint="/api/admin/categories"
    columns={[{ label: 'Name', key: 'name' }, { label: 'Slug', key: 'slug' }, { label: 'Order', key: 'order' }, { label: 'Active', render: (r) => (r.active ? 'Yes' : 'No') }]}
    fields={[{ name: 'name', label: 'Name', required: true }, { name: 'slug', label: 'Slug', help: 'Created from the name if empty' }, { name: 'image', label: 'Image link', wide: true }, { name: 'order', label: 'Sort order', type: 'number' }, { name: 'active', label: 'Active', type: 'checkbox' }]} defaults={{ order: 0 }} />;
}
