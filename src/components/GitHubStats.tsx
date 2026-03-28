"use client";
import { useEffect, useState } from 'react';

interface Repo {
  name: string;
  description: string;
  stargazerCount: number;
  primaryLanguage: { name: string; color: string } | null;
  url: string;
}

interface Stats {
  repos: number;
  stars: number;
  languages: Record<string, number>;
  topRepos: Repo[];
}

export default function GitHubStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use GitHub REST API (no auth needed for public data, 60 req/hr)
    const fetchStats = async () => {
      try {
        const [reposRes] = await Promise.all([
          fetch('https://api.github.com/users/TammineniTanay/repos?per_page=100&sort=updated'),
        ]);
        const repos: any[] = await reposRes.json();
        if (!Array.isArray(repos)) { setLoading(false); return; }

        const stars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
        const langMap: Record<string, number> = {};
        repos.forEach(r => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
        const topRepos = repos.filter(r => !r.fork).sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, 6);

        setStats({
          repos: repos.filter(r => !r.fork).length,
          stars,
          languages: langMap,
          topRepos: topRepos.map(r => ({
            name: r.name, description: r.description,
            stargazerCount: r.stargazers_count,
            primaryLanguage: r.language ? { name: r.language, color: LANG_COLORS[r.language] || '#888' } : null,
            url: r.html_url,
          })),
        });
      } catch (e) {
        console.error('GitHub fetch failed', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const LANG_COLORS: Record<string, string> = {
    Python: '#3572A5', TypeScript: '#2b7489', JavaScript: '#f1e05a',
    'Jupyter Notebook': '#DA5B0B', Java: '#b07219', C: '#555555',
  };

  if (loading) return (
    <div style={{ padding: '2rem', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px' }}>
      <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.72rem', color: 'var(--muted)' }}>Fetching GitHub data...</div>
    </div>
  );

  if (!stats) return null;

  const topLangs = Object.entries(stats.languages).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor" style={{ color: '#fff' }}>
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>GitHub Activity</span>
        <a href="https://github.com/TammineniTanay" target="_blank" rel="noopener noreferrer"
          style={{ marginLeft: 'auto', fontFamily: 'DM Mono,monospace', fontSize: '0.65rem', color: 'var(--accent)', textDecoration: 'none', letterSpacing: '0.1em' }}>
          View Profile ↗
        </a>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[['Repos', stats.repos], ['Stars', stats.stars], ['Languages', topLangs.length]].map(([label, val]) => (
          <div key={label} style={{ background: 'var(--surface2)', borderRadius: '6px', padding: '0.75rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent)' }}>{val}</div>
            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Languages */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>Top Languages</div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {topLangs.map(([lang, count]) => (
            <span key={lang} style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.62rem', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '0.2rem 0.6rem', borderRadius: '3px', color: '#a0aec0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: LANG_COLORS[lang] || '#888', display: 'inline-block' }}></span>
              {lang} ({count})
            </span>
          ))}
        </div>
      </div>

      {/* Recent repos */}
      <div>
        <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>Recent Repos</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {stats.topRepos.map(repo => (
            <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--surface2)', borderRadius: '4px', textDecoration: 'none', transition: 'border 0.2s', border: '1px solid transparent' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div>
                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.7rem', color: 'var(--accent)', marginBottom: '0.15rem' }}>{repo.name}</div>
                {repo.primaryLanguage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: repo.primaryLanguage.color, display: 'inline-block' }}></span>
                    <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.58rem', color: 'var(--muted)' }}>{repo.primaryLanguage.name}</span>
                  </div>
                )}
              </div>
              <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.62rem', color: 'var(--muted)' }}>↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
