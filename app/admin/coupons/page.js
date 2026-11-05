'use client';
import ResourceManager from '@/components/admin/ResourceManager';
import { dt } from '@/components/admin/ui';

export default function Page() {
  return <ResourceManager title="Coupons" sub="Customers apply these in the bag. The server checks every rule again when the order is placed." endpoint="/api/admin/coupons"
    columns={[{ label: 'Code', render: (r) => <b className="text-primary">{r.code}</b> }, { label: 'Offer', render: (r) => (r.type === 'percent' ? `${r.value}% off` : `₹${r.value} off`) }, { label: 'Min order', render: (r) => `₹${r.minOrder || 0}` }, { label: 'Used', render: (r) => `${r.usedCount || 0}${r.usageLimit ? ` / ${r.usageLimit}` : ''}` }, { label: 'Expires', render: (r) => (r.expiresAt ? dt(r.expiresAt) : 'Never') }, { label: 'Active', render: (r) => (r.active ? 'Yes' : 'No') }]}
    fields={[{ name: 'code', label: 'Code', required: true }, { name: 'description', label: 'Description' }, { name: 'type', label: 'Type', type: 'select', options: [['percent', 'Percent off'], ['flat', 'Flat amount off']] }, { name: 'value', label: 'Value', type: 'number', required: true }, { name: 'minOrder', label: 'Minimum order (₹)', type: 'number' }, { name: 'maxDiscount', label: 'Maximum discount (₹)', type: 'number', help: 'For percent coupons' }, { name: 'usageLimit', label: 'Total uses allowed', type: 'number' }, { name: 'expiresAt', label: 'Expires on', type: 'date' }, { name: 'firstOrderOnly', label: 'First order only', type: 'checkbox' }, { name: 'active', label: 'Active', type: 'checkbox' }]} defaults={{ type: 'percent', minOrder: 0 }} />;
}
