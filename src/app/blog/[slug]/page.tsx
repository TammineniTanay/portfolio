import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content/blog', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return notFound();

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);

  let MDXContent;
  try {
    // Correctly pathing to the root content folder
      const mod = await import(`@/../content/blog/${slug}.mdx`);
    MDXContent = mod.default;
  } catch (e) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-24 px-6">
      <article className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-xs font-mono text-blue-400 hover:text-white mb-12 block font-bold uppercase italic">
          ← Back to Journal
        </Link>
        <header className="mb-16">
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-4">{data.title}</h1>
          <p className="text-slate-500 font-mono text-xs font-bold uppercase tracking-widest">{data.date} • {data.tags?.join(', ')}</p>
        </header>
        <div className="prose prose-invert max-w-none prose-p:italic prose-p:text-slate-300 prose-headings:italic prose-strong:text-blue-400">
          <MDXContent />
        </div>
      </article>
    </div>
  );
}