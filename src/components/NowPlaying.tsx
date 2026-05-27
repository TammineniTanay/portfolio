"use client";
import { useEffect, useState } from 'react';

// Uses Last.fm API - completely free, no auth needed for public data
// Replace USERNAME with your Last.fm username if you have one
// Falls back to a "currently coding" display

export default function NowPlaying() {
  const [track, setTrack] = useState<{ name: string; artist: string; } | null>(null);
  const [coding] = useState([
    'Building LLM pipelines',
    'Debugging RAG retrieval',
    'Fine-tuning Llama 3',
    'Writing Python async code',
    'Optimizing vector search',
    'Shipping production AI',
  ]);
  const [codingIdx] = useState(Math.floor(Math.random() * 6));

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.5rem 0.85rem', background: 'var(--surface)',
      border: '1px solid var(--border)', fontSize: '0.7rem',
    }}>
      {/* Equalizer bars */}
      <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '14px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 3, background: '#00e5ff', borderRadius: '1px',
            animation: `eq ${0.4 + i * 0.15}s ease-in-out ${i * 0.1}s infinite alternate`,
            height: `${40 + i * 20}%`,
          }} />
        ))}
      </div>
      <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Now:</span>
      <span style={{ fontFamily: 'DM Mono, monospace', color: '#00e5ff', fontSize: '0.68rem' }}>{coding[codingIdx]}</span>
      <style>{`@keyframes eq { from{transform:scaleY(0.4)} to{transform:scaleY(1)} }`}</style>
    </div>
  );
}
