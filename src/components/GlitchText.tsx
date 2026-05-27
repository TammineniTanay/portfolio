"use client";
import { useEffect, useRef, useState } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#@$%&ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default function GlitchText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const [display, setDisplay] = useState(text);
  const [glitching, setGlitching] = useState(false);
  const iterRef = useRef(0);
  const rafRef = useRef<NodeJS.Timeout | null>(null);

  const glitch = () => {
    if (glitching) return;
    setGlitching(true);
    iterRef.current = 0;
    const maxIter = text.length * 3;

    const step = () => {
      iterRef.current++;
      setDisplay(
        text.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iterRef.current / 3) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('')
      );
      if (iterRef.current < maxIter) {
        rafRef.current = setTimeout(step, 30);
      } else {
        setDisplay(text);
        setGlitching(false);
      }
    };
    step();
  };

  useEffect(() => {
    // Auto-glitch on mount
    const t = setTimeout(glitch, 500 + Math.random() * 1000);
    // Periodic glitch
    const interval = setInterval(() => {
      if (Math.random() > 0.7) glitch();
    }, 4000 + Math.random() * 3000);
    return () => { clearTimeout(t); clearInterval(interval); if (rafRef.current) clearTimeout(rafRef.current); };
  }, []);

  return (
    <span
      className={className}
      style={{ ...style, cursor: 'default', fontFamily: 'inherit' }}
      onMouseEnter={glitch}
      data-text={text}
    >
      {display}
    </span>
  );
}
