// Usage: start the dev server (npm run dev), then in another terminal: npm run seed
const fs = require('fs');
const path = require('path');

for (const f of ['.env.local', '.env']) {
  const p = path.join(__dirname, '..', f);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
if (!process.env.SEED_SECRET) { console.error('Set SEED_SECRET in .env.local first.'); process.exit(1); }

fetch(`${base}/api/seed`, { method: 'POST', headers: { 'x-seed-secret': process.env.SEED_SECRET } })
  .then(async (r) => { const j = await r.json(); if (!r.ok) throw new Error(j.error || r.statusText); console.log('Seeded:', j); })
  .catch((e) => { console.error('Seed failed:', e.message, '\nIs the dev server running at', base, '?'); process.exit(1); });
