'use client';
import ResourceManager from '@/components/admin/ResourceManager';

export default function Page() {
  return <ResourceManager title="Hero banners" sub="These are the slides at the top of the home page, in sort order. With none active, the default slides are shown. Show or hide other home sections in Settings." endpoint="/api/admin/banners"
    columns={[{ label: 'Title', key: 'title' }, { label: 'Button', key: 'cta' }, { label: 'Link', key: 'href' }, { label: 'Order', key: 'order' }, { label: 'Active', render: (r) => (r.active ? 'Yes' : 'No') }]}
    fields={[{ name: 'eyebrow', label: 'Small heading' }, { name: 'title', label: 'Title', required: true }, { name: 'text', label: 'Text', wide: true }, { name: 'cta', label: 'Button text' }, { name: 'href', label: 'Button link', help: 'e.g. /shop?category=makeup' }, { name: 'image', label: 'Image link', wide: true }, { name: 'tone', label: 'Background colour', help: 'e.g. #EDE3D8' }, { name: 'order', label: 'Sort order', type: 'number' }, { name: 'active', label: 'Active', type: 'checkbox' }]} defaults={{ order: 0, tone: '#EDE3D8', placement: 'hero' }} />;
}
