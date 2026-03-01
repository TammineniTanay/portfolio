import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">Engineering Journal</h1>
          <p className="text-slate-400 text-lg italic leading-relaxed">
            Deep dives into real-time AI performance at **Automate365**, cryptographic security, and my published research on **YOLOv3**.
          </p>
        </header>

        <div className="space-y-12">
          {allPostsData.map(({ id, date, title, summary, tags }) => (
            <Link key={id} href={`/blog/${id}`} className="group block border-l border-slate-800 pl-8 hover:border-blue-500 transition-all">
              <span className="text-xs font-mono text-slate-500 font-bold uppercase">{date}</span>
              <h2 className="text-3xl font-bold text-white mt-2 group-hover:text-blue-400 transition-colors italic uppercase">{title}</h2>
              <p className="text-slate-400 mt-4 italic leading-relaxed text-sm">{summary}</p>
              <div className="flex gap-2 mt-6">
                {tags?.map(tag => (
                  <span key={tag} className="text-[10px] font-mono text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}