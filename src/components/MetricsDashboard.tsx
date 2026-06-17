"use client";
import { useEffect, useRef, useState } from 'react';

const METRICS = [
  { label: 'Retrieval Faithfulness Gain', value: 23.7, unit: '%', color: '#00e5ff', desc: 'Hybrid RAG System' },
  { label: 'Per-GPU Memory Reduction', value: 41.2, unit: '%', color: '#7c3aed', desc: 'Distributed Fine-Tune Pipeline' },
  { label: 'Inference Throughput Gain', value: 3.8, unit: 'x', color: '#00ff94', desc: 'vLLM deployment on Llama 3 8B' },
  { label: 'Detection Accuracy', value: 88, unit: '%', color: '#f7a26a', desc: 'Vehicle Detection (Published)' },
  { label: 'RAG Retrieval Latency', value: 163.5, unit: 'ms', color: '#e879f9', desc: 'Mean retrieval latency' },
  { label: 'CRAG Rewrite Rate', value: 38, unit: '%', color: '#38bdf8', desc: 'Corrective RAG self-correction' },
  { label: 'WebSocket Preflight Success', value: 94, unit: '%', color: '#fb7185', desc: 'VoiceBotics AI streaming server' },
  { label: 'System Uptime', value: 99.9, unit: '%', color: '#4ade80', desc: 'Globalshala Azure pipelines' },
  { label: 'Manual Ops Reduction', value: 60, unit: '%', color: '#fbbf24', desc: 'AI automation pipelines' },
];

function AnimatedNumber({ target, unit, active }: { target: number; unit: string; active: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(target * eased);
      if (progress < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [target, active]);

  const display = target < 10 ? val.toFixed(1) : Math.floor(val).toString();
  return <>{display}{unit}</>;
}

export default function MetricsDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>📊 Real Project Metrics</h3>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Verified · Production</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        {METRICS.map((m, i) => (
          <div key={i} style={{ padding: '1rem', background: 'var(--surface2)', borderRadius: '6px', borderLeft: `3px solid ${m.color}`, transition: 'transform 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: m.color, lineHeight: 1, marginBottom: '0.3rem' }}>
              <AnimatedNumber target={m.value} unit={m.unit} active={visible} />
            </div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'var(--text)', fontWeight: 500, marginBottom: '0.2rem', lineHeight: 1.3 }}>{m.label}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}