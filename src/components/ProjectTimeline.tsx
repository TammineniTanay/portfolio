"use client";
import { useState } from 'react';

const TIMELINE = [
  {
    year: '2019',
    title: 'Started BTech @ CVR College',
    desc: 'Began Computer Science & Engineering degree in Hyderabad, India. First exposure to algorithms, data structures, and programming fundamentals.',
    type: 'education',
    icon: '🎓',
  },
  {
    year: '2022',
    title: 'First ML Internship @ Globalshala',
    desc: 'Built text classification and computer vision pipelines. Achieved 87% accuracy on production ML models. First taste of real-world AI engineering.',
    type: 'work',
    icon: '💼',
  },
  {
    year: '2023',
    title: 'Published Peer-Reviewed Research',
    desc: 'Published "Real-Time Vehicle Detection, Counting & Classification System" in CVR Journal of Science & Technology Vol. 24. Won 3rd Prize at Expo2K23.',
    type: 'research',
    icon: '📄',
  },
  {
    year: '2023',
    title: 'Graduated BTech',
    desc: 'Completed BE in Computer Science & Engineering from CVR College of Engineering, Hyderabad.',
    type: 'education',
    icon: '🎓',
  },
  {
    year: '2024',
    title: 'MS Computer Science @ SEMO',
    desc: 'Started MS at Southeast Missouri State University. Focused on Advanced AI, Distributed Systems, and HCI. Maintaining 3.9 GPA throughout.',
    type: 'education',
    icon: '🎓',
  },
  {
    year: '2025',
    title: 'AI Systems Developer Intern @ Automate365',
    desc: 'Joined Automate365 in Irving, TX. Building production LLM pipelines, hybrid RAG systems, and LiveWire real-time transcription for enterprise clients.',
    type: 'work',
    icon: '🚀',
  },
  {
    year: '2025',
    title: 'Completed MS Computer Science',
    desc: 'Graduated with MS in Computer Science, 3.9 GPA from Southeast Missouri State University. Specialized in AI, Distributed Systems, and HCI.',
    type: 'education',
    icon: '🎓',
  },
  {
    year: '2026',
    title: 'Building Advanced AI Systems',
    desc: 'Engineered Distributed Fine-Tune Pipeline, Hybrid RAG System, and Job Command Center. Actively seeking full-time AI/ML roles across the US.',
    type: 'current',
    icon: '⚡',
  },
];

const TYPE_COLORS: Record<string, string> = {
  education: '#7c3aed',
  work: '#00e5ff',
  research: '#e879f9',
  current: '#00ff94',
};

export default function ProjectTimeline() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
      <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '0.4rem' }}>Career Arc</h3>
      <p style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.62rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>Click any node to expand</p>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }}></span>
            <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'capitalize' }}>{type}</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: '0.65rem', top: 0, bottom: 0, width: '1px', background: 'var(--border)' }}></div>

        {TIMELINE.map((item, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: '1rem', cursor: 'pointer' }}
            onClick={() => setActive(active === i ? null : i)}>
            {/* Dot */}
            <div style={{
              position: 'absolute', left: '-1.65rem', top: '0.4rem',
              width: 12, height: 12, borderRadius: '50%',
              background: TYPE_COLORS[item.type],
              boxShadow: active === i ? `0 0 12px ${TYPE_COLORS[item.type]}` : 'none',
              transition: 'box-shadow 0.2s',
              border: '2px solid var(--card-bg)',
            }}></div>

            <div style={{
              padding: '0.75rem 1rem',
              background: active === i ? 'var(--surface2)' : 'transparent',
              border: `1px solid ${active === i ? TYPE_COLORS[item.type] + '40' : 'transparent'}`,
              borderRadius: '6px',
              transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: active === i ? '0.5rem' : 0 }}>
                <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.65rem', color: TYPE_COLORS[item.type] }}>{item.year}</span>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{item.title}</span>
              </div>
              {active === i && (
                <p style={{ fontFamily: 'DM Sans,sans-serif', fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
