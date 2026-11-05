'use client';
import ResourceManager from '@/components/admin/ResourceManager';
import { dt } from '@/components/admin/ui';

export default function Page() {
  return <ResourceManager title="Contact messages" sub="Open a message to read it and mark it handled." endpoint="/api/admin/messages" canCreate={false}
    columns={[{ label: 'From', render: (r) => <span><b className="text-primary">{r.name}</b><br /><span className="text-xs">{r.email}</span></span> }, { label: 'Subject', render: (r) => r.subject || '(none)' }, { label: 'Message', render: (r) => <span className="line-clamp-2 max-w-xs">{r.message}</span> }, { label: 'Date', render: (r) => dt(r.createdAt) }, { label: 'Status', render: (r) => (r.handled ? 'Handled' : 'New') }]}
    fields={[{ name: 'handled', label: 'Mark as handled', type: 'checkbox' }]} defaults={{ handled: false }} />;
}
