"use client";
import { useEffect, useState } from 'react';

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

export default function KonamiEgg() {
  const [progress, setProgress] = useState(0);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      setProgress(p => {
        if (e.key === KONAMI[p]) {
          if (p + 1 === KONAMI.length) {
            setActivated(true);
            setTimeout(() => setActivated(false), 4000);
            return 0;
          }
          return p + 1;
        }
        return e.key === KONAMI[0] ? 1 : 0;
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!activated) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)', animation: 'konamiFade 4s ease-in-out forwards',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem,8vw,5rem)', color: '#00e5ff', letterSpacing: '0.1em', animation: 'konamispin 0.5s ease-in-out', textShadow: '0 0 40px #00e5ff' }}>
          ◈ CHEAT CODE ACTIVATED ◈
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.2rem', color: '#00ff94', marginTop: '1rem', letterSpacing: '0.2em' }}>
          +100 TO ALL STATS
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>
          You found the easter egg. Hire this person immediately.
        </div>
        <div style={{ marginTop: '1.5rem', fontSize: '2rem' }}>🚀 🤖 💻 ⚡ 🧠</div>
      </div>
      <style>{`
        @keyframes konamiFade { 0%{opacity:0} 15%{opacity:1} 80%{opacity:1} 100%{opacity:0} }
        @keyframes konamispin { 0%{transform:scale(0) rotate(-10deg)} 100%{transform:scale(1) rotate(0)} }
      `}</style>
    </div>
  );
}
