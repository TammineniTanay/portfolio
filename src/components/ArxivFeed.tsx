"use client";
import { useEffect, useState } from 'react';

interface Paper {
  title: string;
  authors: string;
  summary: string;
  link: string;
  published: string;
}

export default function ArxivFeed() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // arXiv API — completely free, no key needed
    const query = 'cat:cs.LG+OR+cat:cs.AI+OR+cat:cs.CL&sortBy=submittedDate&sortOrder=descending&max_results=5';
    fetch(`https://export.arxiv.org/api/query?search_query=${query}`)
      .then(r => r.text())
      .then(xml => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'text/xml');
        const entries = Array.from(doc.querySelectorAll('entry'));
        setPapers(entries.map(e => ({
          title: e.querySelector('title')?.textContent?.trim().replace(/\n/g, ' ') || '',
          authors: Array.from(e.querySelectorAll('author name')).slice(0, 2).map(a => a.textContent).join(', '),
          summary: (e.querySelector('summary')?.textContent?.trim() || '').slice(0, 150) + '...',
          link: e.querySelector('id')?.textContent?.trim() || '',
          published: new Date(e.querySelector('published')?.textContent || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>📚 Latest AI/ML Papers</h3>
        <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Live · arXiv</span>
      </div>
      {loading ? (
        <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.72rem', color: 'var(--muted)' }}>Fetching latest papers...</div>
      ) : papers.length === 0 ? (
        <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.72rem', color: 'var(--muted)' }}>Unable to load papers. Check back soon.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {papers.map((p, i) => (
            <a key={i} href={p.link} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', padding: '0.75rem', background: 'var(--surface2)', borderRadius: '4px', textDecoration: 'none', border: '1px solid transparent', transition: 'border 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', color: 'var(--accent)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.published}</div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#fff', lineHeight: 1.4, marginBottom: '0.3rem' }}>{p.title}</div>
              <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.62rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>{p.authors}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.5 }}>{p.summary}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
