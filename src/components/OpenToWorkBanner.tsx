"use client";
import { useState } from 'react';

export default function OpenToWorkBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: 'linear-gradient(90deg, rgba(0,229,255,0.12), rgba(124,58,237,0.12), rgba(0,255,148,0.12))',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0,229,255,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0.4rem 3rem', gap: '1rem',
    }}>
      {/* Pulse dot */}
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00ff94', boxShadow: '0 0 8px #00ff94', flexShrink: 0, animation: 'bannerPulse 2s ease-in-out infinite' }} />

      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: '#fff', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center' }}>
        🚀 <strong style={{ color: '#00e5ff' }}>Actively interviewing</strong> — AI/ML Engineer · GenAI Engineer · LLM Engineer · Data Scientist
        <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0.5rem' }}>|</span>
        Irving, TX · Open to full relocation · Available now
      </span>

      <a href="mailto:tanaytammineni22@gmail.com" style={{
        fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em',
        textTransform: 'uppercase', padding: '0.2rem 0.7rem',
        border: '1px solid rgba(0,229,255,0.4)', color: '#00e5ff', textDecoration: 'none',
        flexShrink: 0, transition: 'all 0.2s', whiteSpace: 'nowrap',
      }}>
        Hire Me ↗
      </a>

      <button onClick={() => setDismissed(true)} style={{
        background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
        cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1, padding: '0.1rem 0.3rem',
        position: 'absolute', right: '0.75rem',
      }}>×</button>

      <style>{`@keyframes bannerPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }`}</style>
    </div>
  );
}
