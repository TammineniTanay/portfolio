"use client";
import { useEffect, useState, useRef } from 'react';
import soundManager from './SoundManager';

const BOOT_STEPS = [
  { text: 'INITIALIZING NEURAL CORE', dur: 400 },
  { text: 'LOADING AI SYSTEMS', dur: 380 },
  { text: 'CALIBRATING RAG PIPELINE', dur: 420 },
  { text: 'VERIFYING CREDENTIALS', dur: 350 },
  { text: 'MOUNTING LLM CONTEXT', dur: 400 },
  { text: 'DEPLOYING PORTFOLIO', dur: 300 },
  { text: 'SYSTEM READY', dur: 200 },
];

function generateHex(): string {
  let s = '';
  for (let i = 0; i < 1800; i++) {
    s += Array.from({ length: 40 }, () => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('') + '\n';
  }
  return s;
}

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [exiting, setExiting] = useState(false);
  const hexData = useRef(generateHex());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Neural net canvas animation
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;

    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x; const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,229,255,${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      // nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,229,255,0.4)';
        ctx.fill();
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Boot sequence
  useEffect(() => {
    soundManager.hum(3.5);
    let totalDelay = 0;
    BOOT_STEPS.forEach((s, i) => {
      totalDelay += s.dur;
      setTimeout(() => {
        setStep(i);
        soundManager.boot(1 + i * 0.12);
      }, totalDelay);
    });
    setTimeout(() => {
      setDone(true);
      soundManager.confirm();
    }, totalDelay + 300);
    setTimeout(() => { setExiting(true); }, totalDelay + 900);
    setTimeout(() => onDone(), totalDelay + 1600);
  }, [onDone]);

  // Progress counter
  useEffect(() => {
    const target = done ? 100 : Math.min(92, (step / BOOT_STEPS.length) * 100);
    const interval = setInterval(() => {
      setPct(p => {
        if (p >= target) { clearInterval(interval); return p; }
        return Math.min(target, p + Math.random() * 3 + 1);
      });
    }, 60);
    return () => clearInterval(interval);
  }, [step, done]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: '#04040a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      opacity: exiting ? 0 : 1,
      transform: exiting ? 'scale(1.04)' : 'scale(1)',
      transition: exiting ? 'opacity 0.7s ease, transform 0.7s ease' : 'none',
    }}>
      {/* Neural canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

      {/* Scan lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg,rgba(0,0,0,0.12) 0px,rgba(0,0,0,0.12) 1px,transparent 1px,transparent 3px)',
        animation: 'scanScroll 0.15s linear infinite',
      }} />

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.92) 100%)', pointerEvents: 'none' }} />

      {/* Data stream bg */}
      <div style={{
        position: 'absolute', inset: 0, fontFamily: 'DM Mono, monospace', fontSize: '9px',
        lineHeight: 1.2, color: 'rgba(0,229,255,0.04)', overflow: 'hidden',
        whiteSpace: 'pre', userSelect: 'none', pointerEvents: 'none',
        animation: 'dataStream 25s linear infinite',
      }}>
        {hexData.current}
      </div>

      {/* Corner decorations */}
      {[
        { top: 20, left: 20, borderTop: '1px solid rgba(0,229,255,0.25)', borderLeft: '1px solid rgba(0,229,255,0.25)' },
        { top: 20, right: 20, borderTop: '1px solid rgba(0,229,255,0.25)', borderRight: '1px solid rgba(0,229,255,0.25)' },
        { bottom: 20, left: 20, borderBottom: '1px solid rgba(0,229,255,0.25)', borderLeft: '1px solid rgba(0,229,255,0.25)' },
        { bottom: 20, right: 20, borderBottom: '1px solid rgba(0,229,255,0.25)', borderRight: '1px solid rgba(0,229,255,0.25)' },
      ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 40, height: 40, ...s }} />)}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', padding: '2rem' }}>

        {/* Classification badge */}
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.45em',
          textTransform: 'uppercase', color: 'var(--accent, #00e5ff)',
          border: '1px solid rgba(0,229,255,0.3)', padding: '0.3rem 1.5rem',
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          // CLASSIFIED · PORTFOLIO
        </div>

        {/* Name */}
        <div style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(3rem,10vw,6.5rem)', color: '#fff',
          letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1,
          textShadow: '0 0 40px rgba(0,229,255,0.35), 0 0 80px rgba(0,229,255,0.1)',
          position: 'relative',
        }}>
          TANAY
          <div style={{
            position: 'absolute', bottom: -4, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.6), transparent)',
          }} />
        </div>

        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'rgba(0,229,255,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          AI · ML · ENGINEER
        </div>

        {/* Boot steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', maxWidth: 360, marginTop: '0.5rem' }}>
          {BOOT_STEPS.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              fontFamily: 'DM Mono, monospace', fontSize: '0.62rem',
              textTransform: 'uppercase', letterSpacing: '0.15em',
              color: i < step ? 'rgba(0,229,255,0.3)' : i === step ? 'rgba(0,229,255,0.9)' : 'rgba(255,255,255,0.15)',
              transition: 'color 0.3s ease',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: 1, flexShrink: 0,
                background: i < step ? '#4ade80' : i === step ? '#00e5ff' : 'rgba(255,255,255,0.1)',
                boxShadow: i === step ? '0 0 8px rgba(0,229,255,0.6)' : 'none',
                animation: i === step ? 'pulse 0.8s ease-in-out infinite' : 'none',
              }} />
              {s.text}
              {i === step && <span style={{ borderRight: '2px solid rgba(0,229,255,0.7)', height: '0.9em', animation: 'blink 0.6s step-end infinite' }} />}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ width: 'clamp(220px,35vw,380px)', marginTop: '0.5rem' }}>
          <div style={{ height: 2, background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.1)', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${Math.min(pct, 100)}%`,
              background: 'linear-gradient(90deg, #00e5ff, #7c3aed)',
              boxShadow: '0 0 12px rgba(0,229,255,0.5)',
              transition: 'width 0.08s ease',
            }} />
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'rgba(0,229,255,0.4)', letterSpacing: '0.15em', marginTop: '0.4rem', textAlign: 'center' }}>
            {Math.floor(Math.min(pct, 100))}% LOADED
          </div>
        </div>

        {done && (
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: '#4ade80', letterSpacing: '0.2em', textTransform: 'uppercase', animation: 'pulse 0.5s ease-in-out' }}>
            ✓ SYSTEM READY — DEPLOYING
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanScroll { 0% { background-position: 0 0; } 100% { background-position: 0 4px; } }
        @keyframes dataStream { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes blink { 0%,50% { opacity:1; } 51%,100% { opacity:0; } }
      `}</style>
    </div>
  );
}
