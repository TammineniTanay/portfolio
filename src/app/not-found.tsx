"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [text, setText] = useState('');
  const msg = 'ERROR: Page not found. Redirecting to base...';
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setText(msg.slice(0, i + 1));
      i++;
      if (i >= msg.length) clearInterval(t);
    }, 40);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#050709', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Mono, monospace', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <div style={{ fontSize: '0.75rem', color: '#00e5ff', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', opacity: 0.7 }}>System Error</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(6rem, 20vw, 12rem)', fontWeight: 800, color: 'transparent', WebkitTextStroke: '1px rgba(0,229,255,0.3)', lineHeight: 1, marginBottom: '1rem' }}>404</div>
        <div style={{ fontSize: '0.8rem', color: '#00e5ff', minHeight: '1.5rem', marginBottom: '2rem' }}>{text}<span style={{ animation: 'blink 1s step-end infinite', borderRight: '2px solid #00e5ff' }}>&nbsp;</span></div>
        <div style={{ background: '#0c0f14', border: '1px solid #1e2535', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ color: '#5a6478', fontSize: '0.72rem', marginBottom: '0.5rem' }}>// Suggested routes:</div>
          {['/', '/#projects', '/#experience', '/#contact'].map((route, i) => (
            <div key={i} style={{ fontSize: '0.72rem', color: '#a0aec0', padding: '0.2rem 0' }}>
              <span style={{ color: '#00ff94' }}>→</span> <Link href={route} style={{ color: '#00e5ff', textDecoration: 'none' }}>{route}</Link>
            </div>
          ))}
        </div>
        <Link href="/" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.8rem 2rem', border: '1px solid #00e5ff', color: '#00e5ff', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' }}>
          Return to Base →
        </Link>
      </div>
    </div>
  );
}
