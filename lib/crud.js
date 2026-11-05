import mongoose from 'mongoose';
import { route, ok, ApiError, escapeRegex } from './api';
import { slugify } from './adminSchemas';

/** Builds list/create/update/remove handlers for a simple admin resource. */
export function crud({ Model, perm, schema, sort = '-createdAt', search = [], slugFrom = null, defaults = {} }) {
  const prep = (d) => { if (slugFrom && !d.slug) d.slug = slugify(d[slugFrom]); return d; };
  const checkId = (id) => { if (!mongoose.isValidObjectId(id)) throw new ApiError('Not found', 404); };
  const dup = (e) => { if (e?.code === 11000) throw new ApiError('That name, code or slug is already in use', 409); throw e; };
  return {
    list: route(async ({ req }) => {
      const sp = req.nextUrl.searchParams;
      const q = (sp.get('q') || '').trim().slice(0, 60);
      const f = q && search.length ? { $or: search.map((k) => ({ [k]: new RegExp(escapeRegex(q), 'i') })) } : {};
      const limit = Math.min(Number(sp.get('limit')) || 20, 100), page = Math.max(Number(sp.get('page')) || 1, 1);
      const [items, total] = await Promise.all([Model.find(f).sort(sort).skip((page - 1) * limit).limit(limit).lean(), Model.countDocuments(f)]);
      return ok({ items: items.map(({ __v, ...r }) => ({ ...r, id: String(r._id) })), total, pages: Math.max(Math.ceil(total / limit), 1) });
    }, { perm }),
    create: route(async ({ req }) => {
      const d = prep({ ...defaults, ...schema.parse(await req.json()) });
      const doc = await Model.create(d).catch(dup);
      return ok({ id: String(doc._id) }, 201);
    }, { perm }),
    update: route(async ({ req, params }) => {
      checkId(params.id);
      const d = prep(schema.parse(await req.json()));
      const doc = await Model.findByIdAndUpdate(params.id, d, { new: true, runValidators: true }).catch(dup);
      if (!doc) throw new ApiError('Not found', 404);
      return ok({ ok: true });
    }, { perm }),
    remove: route(async ({ params }) => {
      checkId(params.id);
      await Model.findByIdAndDelete(params.id);
      return ok({ ok: true });
    }, { perm }),
  };
}
