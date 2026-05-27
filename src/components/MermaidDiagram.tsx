"use client";
import { useEffect, useRef, useState } from 'react';

const DIAGRAMS = [
  {
    title: 'LiveWire AI — Architecture',
    color: '#00e5ff',
    code: `graph TD
    A[Browser Tab Audio] -->|tabCapture API| B[Chrome MV3 Extension]
    C[Microphone Input] -->|getUserMedia| B
    B -->|WebM chunks| D[WebSocket Server]
    D -->|FFmpeg split| E[Tab Audio Stream]
    D -->|FFmpeg split| F[Mic Audio Stream]
    E -->|PCM 16kHz| G[OpenAI Whisper]
    F -->|PCM 16kHz| G
    G -->|Transcript| H[Evidence Pack v2.1]
    H -->|JSON| I[FastAPI Backend]
    I -->|REST| J[React Dashboard]
    style A fill:#0a0f1e,stroke:#00e5ff,color:#fff
    style B fill:#0a0f1e,stroke:#00e5ff,color:#fff
    style G fill:#0a0f1e,stroke:#00ff94,color:#fff
    style J fill:#0a0f1e,stroke:#7c3aed,color:#fff`,
  },
  {
    title: 'Job Command Center — Pipeline',
    color: '#00ff94',
    code: `graph LR
    A[Apify Scrapers] -->|LinkedIn + Wellfound| B[Job Ingestion]
    B -->|SQLite| C[Job Database]
    C -->|JD Text| D[Claude Haiku]
    D -->|Fit Score 0-100| E[Ranked Results]
    E -->|Top Jobs| F[Resume Generator]
    F -->|LaTeX Template| G[PDF Resume]
    G -->|Tailored| H[Application Pack]
    E -->|Dashboard| I[React UI]
    style A fill:#0a0f1e,stroke:#00ff94,color:#fff
    style D fill:#0a0f1e,stroke:#e879f9,color:#fff
    style H fill:#0a0f1e,stroke:#00e5ff,color:#fff`,
  },
  {
    title: 'Hybrid RAG System — Retrieval Flow',
    color: '#7c3aed',
    code: `graph TD
    Q[User Query] --> H[Hybrid Retriever]
    H -->|Dense| A[FAISS Vector Search]
    H -->|Sparse| B[BM25 Elasticsearch]
    H -->|Graph| C[Neo4j Knowledge Graph]
    A --> R[RRF Fusion]
    B --> R
    C --> R
    R --> S[Self-Correction Loop]
    S -->|Low Confidence| Q
    S -->|Pass| N[NLI Faithfulness Check]
    N -->|Hallucination| Q
    N -->|Clean| O[Final Answer + Citations]
    style Q fill:#0a0f1e,stroke:#7c3aed,color:#fff
    style S fill:#0a0f1e,stroke:#f7a26a,color:#fff
    style O fill:#0a0f1e,stroke:#00ff94,color:#fff`,
  },
];

declare global { interface Window { mermaid: any; } }

export default function MermaidDiagram() {
  const [active, setActive] = useState(0);
  const [rendered, setRendered] = useState<Record<number, string>>({});
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.mermaid) { setLoaded(true); return; }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.onload = () => {
      window.mermaid.initialize({
        startOnLoad: false, theme: 'dark',
        themeVariables: {
          primaryColor: '#0a0f1e', primaryTextColor: '#fff',
          primaryBorderColor: '#00e5ff', lineColor: '#5a6478',
          secondaryColor: '#0a0f1e', background: '#050709',
          mainBkg: '#0a0f1e', nodeBorder: '#00e5ff',
          clusterBkg: '#0a0f1e', titleColor: '#fff',
          edgeLabelBackground: '#050709',
        },
      });
      setLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!loaded || rendered[active]) return;
    const render = async () => {
      try {
        const id = `mermaid-${active}-${Date.now()}`;
        const { svg } = await window.mermaid.render(id, DIAGRAMS[active].code);
        setRendered(r => ({ ...r, [active]: svg }));
      } catch (e) {
        setRendered(r => ({ ...r, [active]: '<p style="color:var(--muted);font-size:0.8rem;padding:1rem">Diagram rendering failed. Check console.</p>' }));
      }
    };
    render();
  }, [loaded, active]);

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>🏗️ Architecture Diagrams</h3>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {DIAGRAMS.map((d, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '0.35rem 0.85rem',
            border: `1px solid ${active === i ? d.color : 'var(--border)'}`,
            background: active === i ? `${d.color}12` : 'transparent',
            color: active === i ? d.color : 'var(--muted)', cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {d.title.split('—')[0].trim()}
          </button>
        ))}
      </div>

      {/* Diagram */}
      <div style={{ background: '#050709', border: `1px solid ${DIAGRAMS[active].color}22`, borderRadius: '4px', padding: '1rem', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
        {!loaded ? (
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: 'var(--muted)' }}>Loading diagram engine...</div>
        ) : rendered[active] ? (
          <div ref={containerRef} dangerouslySetInnerHTML={{ __html: rendered[active] }} style={{ maxWidth: '100%', '& svg': { maxWidth: '100%' } } as any} />
        ) : (
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: 'var(--muted)' }}>Rendering {DIAGRAMS[active].title}...</div>
        )}
      </div>

      <div style={{ marginTop: '0.75rem', fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {DIAGRAMS[active].title}
      </div>
    </div>
  );
}
