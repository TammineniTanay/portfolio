"use client";

export default function ArxivFeed() {
  const papers = [
    {
      title: "UniLLMOps: A Unified Framework for End-to-End Large Language Model Production Systems",
      authors: "Tanay Tammineni",
      venue: "Zenodo · ResearchGate · 2026 · 19 pages · IEEE format",
      summary: "Unifies distributed fine-tuning (QLoRA + DeepSpeed ZeRO-3), hybrid RAG (Dense + BM25 + Knowledge Graph + CRAG), and optimized inference (vLLM + AWQ) into a single production-ready framework.",
      links: {
        zenodo: "https://zenodo.org/records/19582347",
        researchgate: "https://www.researchgate.net/publication/403818727",
      },
      badge: "New",
    },
    {
      title: "Real-Time Video-Based Vehicle Detection, Counting & Classification System",
      authors: "Tanay Tammineni",
      venue: "CVR Journal of Science & Technology · Vol. 24 · June 2023 · Peer-Reviewed",
      summary: "SSD MobileNet-based real-time vehicle detection and classification on live traffic streams. 88% accuracy across 5,000+ frames. 3rd Prize at Expo2K23.",
      links: {
        researchgate: "https://www.researchgate.net/publication/372595973",
      },
      badge: "Published",
    },
  ];

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>📄 My Publications</h3>
        <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase' }}>2 Papers</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {papers.map((p, i) => (
          <div key={i} style={{ padding: '0.75rem', background: 'var(--surface2)', borderRadius: '4px', border: '1px solid transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.58rem', padding: '0.1rem 0.4rem', borderRadius: '3px',
                color: p.badge === 'New' ? '#00ff94' : '#7c3aed',
                border: `1px solid ${p.badge === 'New' ? 'rgba(0,255,148,0.35)' : 'rgba(124,58,237,0.35)'}`,
                textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.badge}</span>
            </div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#fff', lineHeight: 1.4, marginBottom: '0.3rem' }}>{p.title}</div>
            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.62rem', color: 'var(--accent)', marginBottom: '0.2rem' }}>{p.authors}</div>
            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.58rem', color: 'var(--muted)', marginBottom: '0.4rem', fontStyle: 'italic' }}>{p.venue}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '0.5rem' }}>{p.summary}</div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {p.links.zenodo && (
                <a href={p.links.zenodo} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', color: '#7c3aed', textDecoration: 'none', borderBottom: '1px solid #7c3aed', paddingBottom: '1px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Zenodo →
                </a>
              )}
              {p.links.researchgate && (
                <a href={p.links.researchgate} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', color: '#7c3aed', textDecoration: 'none', borderBottom: '1px solid #7c3aed', paddingBottom: '1px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  ResearchGate →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}