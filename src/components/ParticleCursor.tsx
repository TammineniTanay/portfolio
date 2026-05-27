"use client";
import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; r: number; hue: number;
}

export default function ParticleCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    let mouse = { x: -999, y: -999 };
    let frame = 0;

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf: number;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn particles
      if (frame % 2 === 0 && mouse.x > 0) {
        for (let i = 0; i < 3; i++) {
          particles.push({
            x: mouse.x + (Math.random() - 0.5) * 8,
            y: mouse.y + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 0.5,
            life: 1, maxLife: 0.6 + Math.random() * 0.6,
            r: Math.random() * 3 + 1,
            hue: Math.random() > 0.5 ? 186 : 270, // cyan or purple
          });
        }
      }

      // Update + draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.02 / p.maxLife;
        p.vx *= 0.96; p.vy *= 0.96;
        p.x += p.vx; p.y += p.vy;
        p.r *= 0.97;

        if (p.life <= 0 || p.r < 0.3) { particles.splice(i, 1); continue; }

        const alpha = p.life * 0.7;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
        grad.addColorStop(0, `hsla(${p.hue},100%,70%,${alpha})`);
        grad.addColorStop(1, `hsla(${p.hue},100%,70%,0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,90%,${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none' }} />;
}
