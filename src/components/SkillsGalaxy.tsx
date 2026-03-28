"use client";
import { useEffect, useRef } from 'react';

const NODES = [
  { id: 'Python', group: 'lang', size: 20 },
  { id: 'PyTorch', group: 'ml', size: 18 },
  { id: 'TensorFlow', group: 'ml', size: 15 },
  { id: 'LangChain', group: 'llm', size: 18 },
  { id: 'LlamaIndex', group: 'llm', size: 16 },
  { id: 'RAG', group: 'llm', size: 17 },
  { id: 'FastAPI', group: 'backend', size: 16 },
  { id: 'Docker', group: 'ops', size: 14 },
  { id: 'AWS', group: 'ops', size: 15 },
  { id: 'OpenCV', group: 'cv', size: 15 },
  { id: 'YOLO', group: 'cv', size: 14 },
  { id: 'HuggingFace', group: 'llm', size: 16 },
  { id: 'SQL', group: 'lang', size: 14 },
  { id: 'React', group: 'frontend', size: 13 },
  { id: 'DeepSpeed', group: 'ml', size: 14 },
  { id: 'FAISS', group: 'llm', size: 13 },
];

const LINKS = [
  { source: 'Python', target: 'PyTorch' }, { source: 'Python', target: 'TensorFlow' },
  { source: 'Python', target: 'LangChain' }, { source: 'Python', target: 'FastAPI' },
  { source: 'Python', target: 'OpenCV' }, { source: 'LangChain', target: 'RAG' },
  { source: 'LlamaIndex', target: 'RAG' }, { source: 'RAG', target: 'FAISS' },
  { source: 'PyTorch', target: 'DeepSpeed' }, { source: 'PyTorch', target: 'HuggingFace' },
  { source: 'HuggingFace', target: 'LangChain' }, { source: 'FastAPI', target: 'Docker' },
  { source: 'Docker', target: 'AWS' }, { source: 'OpenCV', target: 'YOLO' },
  { source: 'React', target: 'FastAPI' }, { source: 'SQL', target: 'Python' },
];

const GROUP_COLORS: Record<string, string> = {
  lang: '#00e5ff', ml: '#7c3aed', llm: '#00ff94',
  backend: '#f7a26a', ops: '#e879f9', cv: '#38bdf8', frontend: '#fbbf24',
};

export default function SkillsGalaxy() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const W = svg.clientWidth || 600;
    const H = svg.clientHeight || 400;

    // Simple force simulation without D3 — pure JS
    const nodes = NODES.map((n, i) => ({
      ...n, x: W / 2 + Math.cos(i / NODES.length * Math.PI * 2) * 150,
      y: H / 2 + Math.sin(i / NODES.length * Math.PI * 2) * 120,
      vx: 0, vy: 0,
    }));

    const getNode = (id: string) => nodes.find(n => n.id === id)!;

    // Run simulation
    for (let iter = 0; iter < 300; iter++) {
      // Repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 2000 / (dist * dist);
          nodes[i].vx -= (dx / dist) * force;
          nodes[i].vy -= (dy / dist) * force;
          nodes[j].vx += (dx / dist) * force;
          nodes[j].vy += (dy / dist) * force;
        }
      }
      // Attraction along links
      LINKS.forEach(l => {
        const s = getNode(l.source); const t = getNode(l.target);
        if (!s || !t) return;
        const dx = t.x - s.x; const dy = t.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 100) * 0.05;
        s.vx += (dx / dist) * force; s.vy += (dy / dist) * force;
        t.vx -= (dx / dist) * force; t.vy -= (dy / dist) * force;
      });
      // Center gravity
      nodes.forEach(n => { n.vx += (W / 2 - n.x) * 0.01; n.vy += (H / 2 - n.y) * 0.01; });
      // Apply velocity with damping
      nodes.forEach(n => {
        n.vx *= 0.8; n.vy *= 0.8;
        n.x = Math.max(40, Math.min(W - 40, n.x + n.vx));
        n.y = Math.max(20, Math.min(H - 20, n.y + n.vy));
      });
    }

    // Render
    svg.innerHTML = '';
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    // Links
    const linkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    LINKS.forEach(l => {
      const s = getNode(l.source); const t = getNode(l.target);
      if (!s || !t) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(s.x)); line.setAttribute('y1', String(s.y));
      line.setAttribute('x2', String(t.x)); line.setAttribute('y2', String(t.y));
      line.setAttribute('stroke', 'rgba(255,255,255,0.08)'); line.setAttribute('stroke-width', '1');
      linkGroup.appendChild(line);
    });
    svg.appendChild(linkGroup);

    // Nodes
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodes.forEach(n => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${n.x},${n.y})`);
      g.style.cursor = 'pointer';

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', String(n.size));
      circle.setAttribute('fill', GROUP_COLORS[n.group] + '22');
      circle.setAttribute('stroke', GROUP_COLORS[n.group]);
      circle.setAttribute('stroke-width', '1.5');

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', `${n.size + 12}`);
      text.setAttribute('fill', '#a0aec0');
      text.setAttribute('font-size', '9');
      text.setAttribute('font-family', 'DM Mono, monospace');
      text.textContent = n.id;

      g.addEventListener('mouseenter', () => { circle.setAttribute('fill', GROUP_COLORS[n.group] + '55'); text.setAttribute('fill', '#fff'); });
      g.addEventListener('mouseleave', () => { circle.setAttribute('fill', GROUP_COLORS[n.group] + '22'); text.setAttribute('fill', '#a0aec0'); });

      g.appendChild(circle); g.appendChild(text);
      nodeGroup.appendChild(g);
    });
    svg.appendChild(nodeGroup);

    // Legend
    const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const groups = [...new Set(NODES.map(n => n.group))];
    groups.forEach((grp, i) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${10 + i * 85}, ${H - 16})`);
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('r', '4'); dot.setAttribute('cx', '4'); dot.setAttribute('cy', '0');
      dot.setAttribute('fill', GROUP_COLORS[grp]);
      const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lbl.setAttribute('x', '12'); lbl.setAttribute('dy', '4');
      lbl.setAttribute('fill', '#5a6478'); lbl.setAttribute('font-size', '8');
      lbl.setAttribute('font-family', 'DM Mono, monospace');
      lbl.textContent = grp;
      g.appendChild(dot); g.appendChild(lbl);
      legendGroup.appendChild(g);
    });
    svg.appendChild(legendGroup);
  }, []);

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
      <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>Skills Galaxy</h3>
      <p style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '1rem' }}>Hover nodes to explore. Lines show skill relationships.</p>
      <svg ref={svgRef} width="100%" height="400" style={{ display: 'block' }} />
    </div>
  );
}
