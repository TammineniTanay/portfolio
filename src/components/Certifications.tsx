"use client";
import { useState } from 'react';

const CERTS = [
  {
    issuer: 'Columbia Engineering Plus',
    name: 'Prompt Engineering & Programming with OpenAI',
    date: 'Mar 2026',
    id: 'ID: 177387539',
    color: '#00e5ff',
    icon: '🏛️',
  },
  {
    issuer: 'Duke University',
    name: 'Programming Fundamentals',
    date: 'Coursera',
    id: '',
    color: '#7c3aed',
    icon: '🎓',
  },
  {
    issuer: 'UC Santa Cruz',
    name: 'C for Everyone: Programming Fundamentals',
    date: 'Feb 2026',
    id: '',
    color: '#00ff94',
    icon: '🎓',
  },
  {
    issuer: 'HackerRank',
    name: 'Software Engineer Intern',
    date: 'Mar 2025',
    id: '',
    color: '#f7a26a',
    icon: '⚡',
  },
  {
    issuer: 'Cisco',
    name: 'Python Essentials 1',
    date: 'Jul 2023',
    id: '',
    color: '#e879f9',
    icon: '🐍',
  },
];

export default function Certifications() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
      <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1.25rem' }}>Certifications</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '0.75rem' }}>
        {CERTS.map((c, i) => (
          <div key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: '1rem', borderRadius: '6px', cursor: 'default',
              background: hovered === i ? 'var(--surface2)' : 'var(--surface)',
              border: `1px solid ${hovered === i ? c.color + '40' : 'var(--border)'}`,
              transition: 'all 0.2s',
              borderTop: `2px solid ${c.color}`,
            }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{c.icon}</div>
            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', color: c.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>{c.issuer}</div>
            <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.78rem', color: '#fff', lineHeight: 1.4, marginBottom: '0.35rem', fontWeight: 500 }}>{c.name}</div>
            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', color: 'var(--muted)' }}>{c.date}{c.id ? ` · ${c.id}` : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
