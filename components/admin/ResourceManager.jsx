'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { api, useList, PageHead, Pager, Table, Field, Check, SearchBox, inputCls } from './ui';

const toForm = (fields, row, defaults) => Object.fromEntries(fields.map((f) => {
  let v = row ? row[f.name] : defaults[f.name];
  if (f.type === 'date' && v) v = String(v).slice(0, 10);
  if (f.type === 'checkbox') v = v ?? true;
  return [f.name, v ?? (f.type === 'number' ? '' : '')];
}));

/** Generic list + create/edit/delete screen driven by a field config. */
export default function ResourceManager({ title, sub, endpoint, columns, fields, defaults = {}, searchable = true, canCreate = true, canDelete = true, rowActions }) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const { data, err, reload } = useList(endpoint, { q, page });
  const [edit, setEdit] = useState(null); // null | 'new' | row
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState('');

  const open = (row) => { setEdit(row || 'new'); setForm(toForm(fields, row, defaults)); setFormErr(''); };
  const save = async (e) => {
    e.preventDefault(); setSaving(true); setFormErr('');
    try {
      const body = Object.fromEntries(fields.map((f) => [f.name, f.type === 'checkbox' ? !!form[f.name] : f.type === 'number' && form[f.name] !== '' ? Number(form[f.name]) : form[f.name]]));
      await api(edit === 'new' ? endpoint : `${endpoint}/${edit.id}`, { method: edit === 'new' ? 'POST' : 'PUT', body });
      toast.success('Saved'); setEdit(null); reload();
    } catch (er) { setFormErr(er.message); } finally { setSaving(false); }
  };
  const del = async (row) => { if (!confirm('Delete this item? This cannot be undone.')) return; try { await api(`${endpoint}/${row.id}`, { method: 'DELETE' }); toast.success('Deleted'); reload(); } catch (er) { toast.error(er.message); } };

  const cols = [...columns, { label: '', right: true, render: (r) => (
    <span className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
      {rowActions?.(r, reload)}
      <button aria-label="Edit" onClick={() => open(r)} className="rounded-full p-2 hover:bg-secondary"><Pencil size={15} /></button>
      {canDelete && <button aria-label="Delete" onClick={() => del(r)} className="rounded-full p-2 hover:bg-highlight hover:text-white"><Trash2 size={15} /></button>}
    </span>) }];

  return (
    <div>
      <PageHead title={title} sub={sub}>
        {searchable && <SearchBox value={q} onChange={(v) => { setQ(v); setPage(1); }} />}
        {canCreate && <Button onClick={() => open()}><Plus size={16} /> New</Button>}
      </PageHead>
      {err && <p className="mb-4 rounded-xl bg-highlight/10 p-3 text-sm text-highlight" role="alert">{err}</p>}
      <Table cols={cols} rows={data?.items} onRow={open} />
      <Pager page={page} pages={data?.pages} onPage={setPage} />

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? `New ${title.toLowerCase().replace(/s$/, '')}` : 'Edit'}>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            f.type === 'checkbox' ? <div key={f.name} className="self-end pb-3"><Check label={f.label} checked={form[f.name]} onChange={(v) => setForm({ ...form, [f.name]: v })} /></div> :
            <Field key={f.name} label={f.label} help={f.help} className={f.wide || f.type === 'textarea' ? 'sm:col-span-2' : ''}>
              {f.type === 'textarea' ? <textarea rows={f.rows || 5} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className="w-full rounded-xl bg-background p-3.5 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent" />
                : f.type === 'select' ? <select value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={inputCls}>{f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                : <input type={f.type || 'text'} step={f.type === 'number' ? 'any' : undefined} required={f.required} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={inputCls} />}
            </Field>
          ))}
          {formErr && <p className="text-sm text-highlight sm:col-span-2" role="alert">{formErr}</p>}
          <div className="flex gap-3 sm:col-span-2"><Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button><Button type="button" variant="outline" onClick={() => setEdit(null)}>Cancel</Button></div>
        </form>
      </Modal>
    </div>
  );
}
