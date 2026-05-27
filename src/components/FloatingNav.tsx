"use client";
import { useEffect, useState } from 'react';
import soundManager from './SoundManager';

const NAV_ITEMS = [
  { id: 'hero', label: 'Home', icon: '⌂' },
  { id: 'projects', label: 'Projects', icon: '⬡' },
  { id: 'experience', label: 'Background', icon: '◈' },
  { id: 'skills', label: 'Stack', icon: '⬢' },
  { id: 'contact', label: 'Contact', icon: '◉' },
];

const EXT_ITEMS = [
  { label: 'GitHub', icon: 'GH', url: 'https://github.com/TammineniTanay' },
  { label: 'LinkedIn', icon: 'in', url: 'https://www.linkedin.com/in/tanay-tammineni/' },
  { label: 'Resume', icon: '↓', url: 'https://drive.google.com/file/d/1Mq-bdqzuT-_7E4vBPVMMoEFHzBV0Fxf6/view' },
];

export default function FloatingNav() {
  const [active, setActive] = useState('hero');
  const [hovered, setHovered] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sections = NAV_ITEMS.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.3 });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const onScroll = () => {
      setVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setVisible(true), 3000);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timeout); };
  }, []);

  const scrollTo = (id: string) => {
    soundManager.click();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={{
      position: 'fixed', right: '1rem', top: '50%', transform: 'translateY(-50%)',
      zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
      background: 'rgba(10,10,18,0.92)', backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0,229,255,0.12)', padding: '0.6rem 0.4rem',
      transition: 'opacity 0.4s, right 0.4s',
      opacity: visible ? 1 : 0.3,
    }}>
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.4), transparent)' }} />

      {NAV_ITEMS.map(item => (
        <div key={item.id} style={{ position: 'relative' }}
          onMouseEnter={() => { setHovered(item.id); soundManager.hover(); }}
          onMouseLeave={() => setHovered(null)}>
          <button onClick={() => scrollTo(item.id)} style={{
            width: 36, height: 36, background: active === item.id ? 'rgba(0,229,255,0.12)' : 'transparent',
            border: active === item.id ? '1px solid rgba(0,229,255,0.35)' : '1px solid transparent',
            color: active === item.id ? '#00e5ff' : 'rgba(255,255,255,0.4)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', transition: 'all 0.2s',
            boxShadow: active === item.id ? '0 0 12px rgba(0,229,255,0.2)' : 'none',
          }}>
            {item.icon}
          </button>
          {hovered === item.id && (
            <div style={{
              position: 'absolute', right: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(10,10,18,0.97)', color: '#00e5ff',
              padding: '0.3rem 0.7rem', fontFamily: 'DM Mono, monospace', fontSize: '0.6rem',
              textTransform: 'uppercase', letterSpacing: '0.12em', whiteSpace: 'nowrap',
              border: '1px solid rgba(0,229,255,0.18)',
              pointerEvents: 'none',
            }}>
              {item.label}
              <div style={{ position: 'absolute', right: -5, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '5px solid rgba(10,10,18,0.97)' }} />
            </div>
          )}
        </div>
      ))}

      {/* Divider */}
      <div style={{ width: '60%', height: 1, background: 'rgba(0,229,255,0.1)', margin: '0.15rem 0' }} />

      {EXT_ITEMS.map(item => (
        <div key={item.label} style={{ position: 'relative' }}
          onMouseEnter={() => { setHovered(item.label); soundManager.hover(); }}
          onMouseLeave={() => setHovered(null)}>
          <button onClick={() => { soundManager.click(); window.open(item.url, '_blank'); }} style={{
            width: 36, height: 36, background: 'transparent', border: '1px solid transparent',
            color: 'rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: 'DM Mono, monospace', fontSize: '0.6rem',
            fontWeight: 700, letterSpacing: '0.05em', transition: 'all 0.2s',
          }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.color = '#00e5ff'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,229,255,0.2)'; }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; }}>
            {item.icon}
          </button>
          {hovered === item.label && (
            <div style={{
              position: 'absolute', right: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(10,10,18,0.97)', color: '#00e5ff',
              padding: '0.3rem 0.7rem', fontFamily: 'DM Mono, monospace', fontSize: '0.6rem',
              textTransform: 'uppercase', letterSpacing: '0.12em', whiteSpace: 'nowrap',
              border: '1px solid rgba(0,229,255,0.18)', pointerEvents: 'none',
            }}>
              {item.label}
              <div style={{ position: 'absolute', right: -5, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '5px solid rgba(10,10,18,0.97)' }} />
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
