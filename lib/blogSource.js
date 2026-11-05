import connectDB from './db';
import BlogPost from '@/models/BlogPost';
import { blogPosts } from '@/data/blog';

const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));
const norm = (p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt || '', body: p.body || '', image: p.image || null, tone: p.tone || '#EDE3D8', readTime: p.readTime || '', date: new Date(p.publishedAt || p.date).toISOString() });

/** Published posts from MongoDB, newest first. Falls back to the starter articles if the database is empty or unreachable. */
export async function loadPosts() {
  try {
    await Promise.race([connectDB(), timeout(3000)]);
    const items = await BlogPost.find({ published: true }).sort('-publishedAt').lean();
    if (items.length) return items.map(norm);
  } catch { /* use fallback */ }
  return blogPosts.map(norm);
}
export async function loadPost(slug) { return (await loadPosts()).find((p) => p.slug === slug) || null; }
