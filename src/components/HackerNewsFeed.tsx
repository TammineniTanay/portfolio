"use client";
import { useEffect, useState } from 'react';

interface HNStory {
  objectID: string;
  title: string;
  url: string;
  points: number;
  author: string;
  num_comments: number;
  created_at: string;
}

export default function HackerNewsFeed() {
  const [stories, setStories] = useState<HNStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('LLM');
  const QUERIES = ['LLM', 'RAG', 'AI Engineer', 'PyTorch', 'LangChain'];

  const fetchStories = (q: string) => {
    setLoading(true);
    // Algolia HN API — completely free, no key needed
    fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=6`)
      .then(r => r.json())
      .then(data => setStories(data.hits || []))
      .catch(() => setStories([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStories(query); }, [query]);

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>🔥 HN · AI Discussions</h3>
        <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Live · Algolia</span>
      </div>

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {QUERIES.map(q => (
          <button key={q} onClick={() => setQuery(q)}
            style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', border: `1px solid ${query === q ? 'var(--accent)' : 'var(--border)'}`, background: query === q ? 'rgba(0,229,255,0.08)' : 'transparent', color: query === q ? 'var(--accent)' : 'var(--muted)', cursor: 'pointer', borderRadius: '3px', transition: 'all 0.15s' }}>
            {q}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.72rem', color: 'var(--muted)' }}>Loading discussions...</div>
      ) : stories.length === 0 ? (
        <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.72rem', color: 'var(--muted)' }}>No stories found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {stories.map(s => (
            <a key={s.objectID} href={s.url || `https://news.ycombinator.com/item?id=${s.objectID}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', padding: '0.6rem 0.75rem', background: 'var(--surface2)', borderRadius: '4px', textDecoration: 'none', border: '1px solid transparent', transition: 'border 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.78rem', color: '#fff', lineHeight: 1.4, marginBottom: '0.3rem' }}>{s.title}</div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', color: '#f7a26a' }}>▲ {s.points}</span>
                <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', color: 'var(--muted)' }}>💬 {s.num_comments}</span>
                <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', color: 'var(--muted)' }}>{s.author}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
