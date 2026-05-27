"use client";
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') { setDark(false); applyLight(); }
  }, []);

  const applyDark = () => {
    document.documentElement.style.setProperty('--bg', '#050709');
    document.documentElement.style.setProperty('--surface', '#0c0f14');
    document.documentElement.style.setProperty('--surface2', '#111620');
    document.documentElement.style.setProperty('--border', '#1e2535');
    document.documentElement.style.setProperty('--text', '#e8eaf0');
    document.documentElement.style.setProperty('--muted', '#5a6478');
    document.documentElement.style.setProperty('--card-bg', '#0d1017');
    document.body.style.background = '#050709';
    document.body.style.color = '#e8eaf0';
  };

  const applyLight = () => {
    document.documentElement.style.setProperty('--bg', '#f0f4f8');
    document.documentElement.style.setProperty('--surface', '#ffffff');
    document.documentElement.style.setProperty('--surface2', '#e8edf3');
    document.documentElement.style.setProperty('--border', '#d1d9e0');
    document.documentElement.style.setProperty('--text', '#0d1017');
    document.documentElement.style.setProperty('--muted', '#4a5568');
    document.documentElement.style.setProperty('--card-bg', '#ffffff');
    document.body.style.background = '#f0f4f8';
    document.body.style.color = '#0d1017';
  };

  const toggle = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    if (newDark) applyDark(); else applyLight();
  };

  return (
    <button onClick={toggle} title={dark ? 'Switch to light mode' : 'Switch to dark mode'} style={{
      position: 'fixed', top: '4.5rem', right: '1rem', zIndex: 99,
      width: 36, height: 36, background: 'rgba(10,10,18,0.92)',
      border: '1px solid rgba(0,229,255,0.2)', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.9rem', transition: 'all 0.2s', backdropFilter: 'blur(10px)',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.5)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)')}>
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
