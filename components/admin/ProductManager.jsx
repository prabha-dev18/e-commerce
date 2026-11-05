'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Upload, FileUp } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ProductVisual from '@/components/product/ProductVisual';
import { facets } from '@/lib/catalog';
import { api, useList, PageHead, Pager, Table, Field, Check, Pill, SearchBox, inputCls, money } from './ui';

const blank = { name: '', slug: '', brand: '', category: 'skincare', sub: '', price: '', mrp: '', stock: 20, size: '', finish: 'natural', badge: '', tone: '#EDE3D8', images: '', description: '', ingredients: '', howTo: '', benefits: '', concern: '', skin: 'all', swatches: '', vegan: true, cf: true, pf: true, active: true, seoTitle: '', seoDescription: '' };
const toForm = (p) => ({ ...blank, ...p, mrp: p.mrp || '', images: (p.images?.length ? p.images : p.image ? [p.image] : []).join('\n'), benefits: (p.benefits || []).join('\n'), concern: (p.concern || []).join(', '), skin: (p.skin || []).join(', '), swatches: (p.swatches || []).join(', '), badge: p.badge || '', sub: p.sub || '', size: p.size || '', finish: p.finish || 'natural', seoTitle: p.seo?.title || '', seoDescription: p.seo?.description || '', description: p.description || '', ingredients: p.ingredients || '', howTo: p.howTo || '' });
const SAMPLE = 'name,brand,category,sub,price,mrp,stock,size,images,description,concern,skin,finish,badge\n"Rose Hydra Mist","Verdant",skincare,face-masks,449,549,30,100ml,https://example.com/rose.jpg,"A light hydrating mist.",hydration,"all|dry",dewy,New\n';

export default function ProductManager() {
  const [q, setQ] = useState(''); const [low, setLow] = useState(false); const [page, setPage] = useState(1);
  const { data, err, reload } = useList('/api/admin/products', { q, stock: low ? 'low' : '', page });
  const [edit, setEdit] = useState(null); const [f, setF] = useState(blank); const [saving, setSaving] = useState(false); const [formErr, setFormErr] = useState('');
  const [imp, setImp] = useState(false); const [csv, setCsv] = useState(''); const [result, setResult] = useState(null); const [uploading, setUploading] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const open = (p) => { setEdit(p || 'new'); setF(p ? toForm(p) : blank); setFormErr(''); };
  const save = async (e) => {
    e.preventDefault(); setSaving(true); setFormErr('');
    const body = { ...f, price: Number(f.price), mrp: f.mrp === '' ? undefined : Number(f.mrp), stock: Number(f.stock), seo: { title: f.seoTitle, description: f.seoDescription } };
    delete body.seoTitle; delete body.seoDescription; delete body.id; delete body.image;
    try { await api(edit === 'new' ? '/api/admin/products' : `/api/admin/products/${edit.id}`, { method: edit === 'new' ? 'POST' : 'PUT', body }); toast.success('Product saved'); setEdit(null); reload(); }
    catch (er) { setFormErr(er.message); } finally { setSaving(false); }
  };
  const del = async (p) => { if (!confirm(`Delete "${p.name}"?`)) return; try { await api(`/api/admin/products/${p.id}`, { method: 'DELETE' }); toast.success('Deleted'); reload(); } catch (er) { toast.error(er.message); } };

  const upload = async (file) => {
    if (!file) return; setUploading(true);
    try {
      const s = await api('/api/admin/upload-sign');
      if (!s.configured) throw new Error('Cloudinary is not set up yet. Paste image links instead, or add the Cloudinary keys to .env.local.');
      const fd = new FormData(); fd.append('file', file); fd.append('api_key', s.apiKey); fd.append('timestamp', s.timestamp); fd.append('signature', s.signature); fd.append('folder', s.folder);
      const r = await fetch(`https://api.cloudinary.com/v1_1/${s.cloudName}/image/upload`, { method: 'POST', body: fd });
      const j = await r.json(); if (!r.ok) throw new Error(j.error?.message || 'Upload failed');
      setF((c) => ({ ...c, images: `${c.images ? `${c.images}\n` : ''}${j.secure_url}` })); toast.success('Image uploaded');
    } catch (er) { toast.error(er.message); } finally { setUploading(false); }
  };
  const runImport = async () => {
    try { setResult(await api('/api/admin/products/import', { method: 'POST', body: { csv } })); reload(); } catch (er) { toast.error(er.message); }
  };
  const readFile = (file) => { if (!file) return; const r = new FileReader(); r.onload = () => setCsv(String(r.result)); r.readAsText(file); };

  return (
    <div>
      <PageHead title="Products" sub="Changes show on the store within a minute.">
        <SearchBox value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search name, brand, SKU" />
        <Check label="Low stock" checked={low} onChange={(v) => { setLow(v); setPage(1); }} />
        <Button variant="outline" onClick={() => { setImp(true); setResult(null); }}><FileUp size={16} /> Import CSV</Button>
        <Button onClick={() => open()}><Plus size={16} /> New product</Button>
      </PageHead>
      {err && <p className="mb-4 rounded-xl bg-highlight/10 p-3 text-sm text-highlight" role="alert">{err}</p>}
      <Table rows={data?.items} onRow={open} empty="No products yet. Run npm run seed or add one." cols={[
        { label: 'Product', render: (p) => <span className="flex items-center gap-3"><span className="block h-11 w-11 shrink-0 overflow-hidden rounded-lg"><ProductVisual src={p.image} tone={p.tone} alt="" /></span><span><b className="block text-primary">{p.name}</b><span className="text-xs">{p.brand} · {p.sku}</span></span></span> },
        { label: 'Category', render: (p) => <span className="capitalize">{p.category}</span> }, { label: 'Price', render: (p) => money(p.price) },
        { label: 'Stock', render: (p) => <Pill tone={p.stock === 0 ? 'bg-highlight text-white' : p.stock <= 10 ? 'bg-accent text-white' : undefined}>{p.stock}</Pill> }, { label: 'Status', render: (p) => (p.active ? 'Active' : 'Hidden') },
        { label: '', right: true, render: (p) => <span className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}><button aria-label="Edit" onClick={() => open(p)} className="rounded-full p-2 hover:bg-secondary"><Pencil size={15} /></button><button aria-label="Delete" onClick={() => del(p)} className="rounded-full p-2 hover:bg-highlight hover:text-white"><Trash2 size={15} /></button></span> },
      ]} />
      <Pager page={page} pages={data?.pages} onPage={setPage} />

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit === 'new' ? 'New product' : 'Edit product'} className="max-w-4xl">
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" className="sm:col-span-2"><input required value={f.name} onChange={set('name')} className={inputCls} /></Field>
          <Field label="Slug (web address)" help="Leave empty to create from the name."><input value={f.slug} onChange={set('slug')} className={inputCls} /></Field>
          <Field label="Brand"><input required value={f.brand} onChange={set('brand')} list="brands" className={inputCls} /><datalist id="brands">{facets.brand.map(([b]) => <option key={b} value={b} />)}</datalist></Field>
          <Field label="Category"><select value={f.category} onChange={set('category')} className={inputCls}>{facets.category.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
          <Field label="Sub-category" help="e.g. serums, lipstick"><input value={f.sub} onChange={set('sub')} className={inputCls} /></Field>
          <Field label="Selling price (₹)"><input required type="number" min="1" value={f.price} onChange={set('price')} className={inputCls} /></Field>
          <Field label="MRP (₹)"><input type="number" min="0" value={f.mrp} onChange={set('mrp')} className={inputCls} /></Field>
          <Field label="Stock"><input required type="number" min="0" value={f.stock} onChange={set('stock')} className={inputCls} /></Field>
          <Field label="Size" help="e.g. 30ml or 200g"><input value={f.size} onChange={set('size')} className={inputCls} /></Field>
          <Field label="Finish"><select value={f.finish} onChange={set('finish')} className={inputCls}>{['natural', 'matte', 'dewy'].map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Badge"><select value={f.badge} onChange={set('badge')} className={inputCls}><option value="">None</option><option>New</option><option>Bestseller</option></select></Field>
          <Field label="Images" help="One link per line. The first is the main image." className="sm:col-span-2">
            <textarea rows={3} value={f.images} onChange={set('images')} className="w-full rounded-xl bg-background p-3.5 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent" />
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs text-primary hover:bg-accent hover:text-white"><Upload size={14} /> {uploading ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/*" className="hidden" onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ''; }} /></label>
          </Field>
          <Field label="Description" className="sm:col-span-2"><textarea rows={3} value={f.description} onChange={set('description')} className="w-full rounded-xl bg-background p-3.5 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent" /></Field>
          <Field label="Ingredients"><textarea rows={3} value={f.ingredients} onChange={set('ingredients')} className="w-full rounded-xl bg-background p-3.5 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent" /></Field>
          <Field label="How to use"><textarea rows={3} value={f.howTo} onChange={set('howTo')} className="w-full rounded-xl bg-background p-3.5 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent" /></Field>
          <Field label="Benefits" help="One per line"><textarea rows={3} value={f.benefits} onChange={set('benefits')} className="w-full rounded-xl bg-background p-3.5 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent" /></Field>
          <div className="space-y-4">
            <Field label="Concerns" help="Comma separated: acne, hydration, dull-skin, anti-aging, hair-fall, sun"><input value={f.concern} onChange={set('concern')} className={inputCls} /></Field>
            <Field label="Skin types" help="all, oily, dry, combination, normal"><input value={f.skin} onChange={set('skin')} className={inputCls} /></Field>
          </div>
          <Field label="Shades (colour codes)" help="Comma separated, e.g. #C9877A, #B98282. Each becomes a shade option."><input value={f.swatches} onChange={set('swatches')} className={inputCls} /></Field>
          <Field label="Placeholder colour"><input value={f.tone} onChange={set('tone')} className={inputCls} /></Field>
          <Field label="SEO title"><input maxLength={70} value={f.seoTitle} onChange={set('seoTitle')} className={inputCls} /></Field>
          <Field label="SEO description"><input maxLength={170} value={f.seoDescription} onChange={set('seoDescription')} className={inputCls} /></Field>
          <div className="flex flex-wrap gap-5 sm:col-span-2"><Check label="Vegan" checked={f.vegan} onChange={(v) => setF({ ...f, vegan: v })} /><Check label="Cruelty-free" checked={f.cf} onChange={(v) => setF({ ...f, cf: v })} /><Check label="Paraben-free" checked={f.pf} onChange={(v) => setF({ ...f, pf: v })} /><Check label="Visible in store" checked={f.active} onChange={(v) => setF({ ...f, active: v })} /></div>
          {formErr && <p className="text-sm text-highlight sm:col-span-2" role="alert">{formErr}</p>}
          <div className="flex gap-3 sm:col-span-2"><Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</Button><Button type="button" variant="outline" onClick={() => setEdit(null)}>Cancel</Button></div>
        </form>
      </Modal>

      <Modal open={imp} onClose={() => setImp(false)} title="Import products from CSV">
        <p className="text-sm">Existing products with the same slug are updated; new ones are added. Use <b>|</b> between several images, concerns or skin types.</p>
        <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(SAMPLE)}`} download="products-sample.csv" className="mt-2 inline-block text-sm underline">Download a sample file</a>
        <input type="file" accept=".csv,text/csv" onChange={(e) => readFile(e.target.files?.[0])} className="mt-4 block text-sm" aria-label="CSV file" />
        <textarea rows={6} value={csv} onChange={(e) => setCsv(e.target.value)} placeholder="…or paste CSV here" aria-label="CSV text" className="mt-3 w-full rounded-xl bg-background p-3 font-mono text-xs text-primary outline-none ring-1 ring-secondary focus:ring-accent" />
        {result && <div className="mt-3 rounded-xl bg-secondary p-3 text-sm text-primary"><p>{result.created} added, {result.updated} updated, {result.failed} failed.</p>{result.errors.length > 0 && <ul className="mt-2 list-disc pl-5 text-xs">{result.errors.map((x) => <li key={x}>{x}</li>)}</ul>}</div>}
        <div className="mt-4 flex gap-3"><Button onClick={runImport} disabled={!csv.trim()}>Import</Button><Button variant="outline" onClick={() => setImp(false)}>Close</Button></div>
      </Modal>
    </div>
  );
}
