"use client";
import { useState } from 'react';

const PROJECTS = [
  { name: 'Distributed Fine-Tune Pipeline', complexity: 95, impact: 90, color: '#00ff94' },
  { name: 'Hybrid RAG System', complexity: 88, impact: 92, color: '#00ff94' },
  { name: 'LiveWire AI Transcription', complexity: 85, impact: 88, color: '#00e5ff' },
  { name: 'Job Command Center', complexity: 72, impact: 85, color: '#00e5ff' },
  { name: 'Vehicle Detection (Published)', complexity: 70, impact: 80, color: '#e879f9' },
  { name: 'Shamir\'s Secret Sharing', complexity: 80, impact: 60, color: '#7c3aed' },
  { name: 'APL Interpreter', complexity: 82, impact: 55, color: '#7c3aed' },
  { name: 'Distributed Cloud Computing', complexity: 75, impact: 62, color: '#7c3aed' },
  { name: 'Face Recognition Attendance', complexity: 60, impact: 70, color: '#f7a26a' },
  { name: 'Earthquake Prediction', complexity: 55, impact: 65, color: '#f7a26a' },
  { name: 'ML Coursework', complexity: 65, impact: 50, color: '#5a6478' },
  { name: 'Hospital Management', complexity: 50, impact: 55, color: '#5a6478' },
  { name: 'AI Maze Search', complexity: 45, impact: 45, color: '#5a6478' },
  { name: 'Traffic Monitoring AI', complexity: 58, impact: 60, color: '#f7a26a' },
  { name: 'HCI Case Studies', complexity: 40, impact: 48, color: '#5a6478' },
  { name: 'IIoT Research Survey', complexity: 42, impact: 52, color: '#5a6478' },
];

export default function ProjectComplexityMatrix() {
  const [hovered, setHovered] = useState<number | null>(null);
  const W = 100; const H = 100;

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
      <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '0.3rem' }}>Project Matrix</h3>
      <p style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.62rem', color: 'var(--muted)', marginBottom: '1rem' }}>Technical complexity vs business impact</p>

      <div style={{ position: 'relative', width: '100%', paddingBottom: '80%' }}>
        <svg viewBox="0 0 120 110" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* Background quadrants */}
          <rect x="10" y="5" width="50" height="50" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
          <rect x="60" y="5" width="50" height="50" fill="rgba(0,229,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
          <rect x="10" y="55" width="50" height="50" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
          <rect x="60" y="55" width="50" height="50" fill="rgba(0,255,148,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />

          {/* Quadrant labels */}
          {[['Low Complexity\nLow Impact', 35, 80], ['High Complexity\nLow Impact', 85, 80], ['Low Complexity\nHigh Impact', 35, 30], ['High Complexity\nHigh Impact ★', 85, 30]].map(([label, x, y], i) => (
            <text key={i} x={x} y={y} textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="4" fontFamily="DM Mono, monospace">{String(label).split('\\n').map((l, j) => <tspan key={j} x={x} dy={j ? '1.3em' : 0}>{l}</tspan>)}</text>
          ))}

          {/* Axes */}
          <line x1="10" y1="55" x2="110" y2="55" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="60" y1="5" x2="60" y2="105" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="2,2" />

          {/* Axis labels */}
          <text x="60" y="109" textAnchor="middle" fill="#5a6478" fontSize="4" fontFamily="DM Mono, monospace">Technical Complexity →</text>
          <text x="6" y="55" textAnchor="middle" fill="#5a6478" fontSize="4" fontFamily="DM Mono, monospace" transform="rotate(-90,6,55)">Business Impact →</text>

          {/* Project dots */}
          {PROJECTS.map((p, i) => {
            const cx = 10 + (p.complexity / 100) * 100;
            const cy = 105 - (p.impact / 100) * 100;
            return (
              <g key={i} style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}>
                <circle cx={cx} cy={cy} r={hovered === i ? 4 : 2.5}
                  fill={p.color} fillOpacity={hovered === i ? 0.9 : 0.6}
                  stroke={p.color} strokeWidth="0.5"
                  style={{ transition: 'r 0.15s' }} />
                {hovered === i && (
                  <g>
                    <rect x={cx - 25} y={cy - 14} width="50" height="11" rx="2"
                      fill="#0c0f14" stroke={p.color} strokeWidth="0.5" />
                    <text x={cx} y={cy - 7} textAnchor="middle" fill="#fff" fontSize="3.5" fontFamily="DM Mono, monospace">{p.name.length > 22 ? p.name.slice(0, 22) + '...' : p.name}</text>
                    <text x={cx} y={cy - 3} textAnchor="middle" fill={p.color} fontSize="3" fontFamily="DM Mono, monospace">C:{p.complexity} · I:{p.impact}</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
