import ResourceManager from '@/components/admin/ResourceManager';
import { dt } from '@/components/admin/ui';
export const metadata = { title: 'Blog' };
export default function Page() {
  return <ResourceManager title="Blog posts" endpoint="/api/admin/blog"
    columns={[{ label: 'Title', key: 'title' }, { label: 'Slug', key: 'slug' }, { label: 'Date', render: (r) => dt(r.publishedAt) }, { label: 'Published', render: (r) => (r.published ? 'Yes' : 'Draft') }]}
    fields={[{ name: 'title', label: 'Title', required: true, wide: true }, { name: 'slug', label: 'Slug' }, { name: 'readTime', label: 'Read time', help: 'e.g. 4 min read' }, { name: 'image', label: 'Image link', wide: true }, { name: 'excerpt', label: 'Short summary', type: 'textarea', rows: 2 }, { name: 'body', label: 'Article text', type: 'textarea', rows: 10 }, { name: 'published', label: 'Published', type: 'checkbox' }]} />;
}
