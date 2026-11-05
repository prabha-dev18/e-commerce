'use client';
import ResourceManager from '@/components/admin/ResourceManager';

export default function Page() {
  return <ResourceManager title="Brands" endpoint="/api/admin/brands"
    columns={[{ label: 'Name', key: 'name' }, { label: 'Slug', key: 'slug' }, { label: 'Active', render: (r) => (r.active ? 'Yes' : 'No') }]}
    fields={[{ name: 'name', label: 'Name', required: true }, { name: 'slug', label: 'Slug' }, { name: 'logo', label: 'Logo link', wide: true }, { name: 'description', label: 'Description', type: 'textarea', rows: 3 }, { name: 'active', label: 'Active', type: 'checkbox' }]} />;
}
