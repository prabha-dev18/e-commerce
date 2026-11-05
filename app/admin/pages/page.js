'use client';
import ResourceManager from '@/components/admin/ResourceManager';

export default function Page() {
  return <ResourceManager title="Pages" sub="Pages open at /p/your-slug, e.g. /p/about. Blank lines in the text start a new paragraph." endpoint="/api/admin/pages"
    columns={[{ label: 'Title', key: 'title' }, { label: 'Address', render: (r) => `/p/${r.slug}` }, { label: 'Published', render: (r) => (r.published ? 'Yes' : 'Draft') }]}
    fields={[{ name: 'title', label: 'Title', required: true }, { name: 'slug', label: 'Slug', help: 'e.g. about, privacy, faq' }, { name: 'body', label: 'Content', type: 'textarea', rows: 12 }, { name: 'published', label: 'Published', type: 'checkbox' }]} />;
}
