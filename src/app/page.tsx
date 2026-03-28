"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const GitHubStats = dynamic(() => import('@/components/GitHubStats'), { ssr: false });
const ArxivFeed = dynamic(() => import('@/components/ArxivFeed'), { ssr: false });
const SkillsGalaxy = dynamic(() => import('@/components/SkillsGalaxy'), { ssr: false });
const ProjectTimeline = dynamic(() => import('@/components/ProjectTimeline'), { ssr: false });
const ProjectComplexityMatrix = dynamic(() => import('@/components/ProjectComplexityMatrix'), { ssr: false });
const HackerNewsFeed = dynamic(() => import('@/components/HackerNewsFeed'), { ssr: false });
const Certifications = dynamic(() => import('@/components/Certifications'), { ssr: false });

// ── TYPEWRITER HOOK ───────────────────────────────────────────────────
function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setDisplayed(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx(w => (w + 1) % words.length);
          setCharIdx(0);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

// ── COUNTER HOOK ──────────────────────────────────────────────────────
function useCounter(target: number, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

// ── FLIP CARD ─────────────────────────────────────────────────────────
const FlipCard = ({ year, title, bullets, tags, link, badge }: {
  year: string; title: string; bullets: string[];
  tags: string[]; link: string; badge?: string;
}) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={{ perspective: '1200px', height: '420px', cursor: 'pointer' }}
      onClick={() => setFlipped(f => !f)}>
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* FRONT */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          background: 'var(--card-bg)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '1.75rem',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.72rem', color: 'var(--accent)' }}>{year}</span>
              {badge && <span style={{
                fontFamily: 'DM Mono,monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem',
                color: badge === 'New' ? 'var(--accent3)' : badge === 'Research' ? '#e879f9' : 'var(--accent)',
                border: `1px solid ${badge === 'New' ? 'rgba(0,255,148,0.35)' : badge === 'Research' ? 'rgba(232,121,249,0.35)' : 'rgba(0,229,255,0.35)'}`,
              }}>{badge}</span>}
            </div>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.25 }}>{title}</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>{bullets[0]}</p>
          </div>
          <div>
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.6rem' }}>
              {tags.map((t, i) => <span key={i} style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.58rem', textTransform: 'uppercase', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '0.18rem 0.5rem', color: '#a0aec0', borderRadius: '3px' }}>{t}</span>)}
            </div>
            <p style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.62rem', color: 'var(--accent)', opacity: 0.7 }}>◈ Click to see details</p>
          </div>
        </div>
        {/* BACK */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)', background: '#0a0f1e', border: '1px solid rgba(0,229,255,0.25)',
          borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.58rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Key Features</span>
            <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.58rem', color: 'var(--muted)', opacity: 0.5 }}>click to flip back</span>
          </div>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#fff', lineHeight: 1.3 }}>{title}</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ fontSize: '0.72rem', color: 'var(--muted)', paddingLeft: '1rem', position: 'relative', lineHeight: 1.55 }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--accent3)', fontSize: '0.62rem', top: '2px' }}>▸</span>{b}
              </li>
            ))}
          </ul>
          <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: '0.6rem', fontFamily: 'DM Mono,monospace', fontSize: '0.62rem', color: '#f7a26a', lineHeight: 1.6 }}>{tags.join(' · ')}</div>
          <a href={link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent3)', border: '1px solid rgba(0,255,148,0.3)', padding: '0.35rem 0.85rem', textDecoration: 'none', display: 'inline-block', width: 'fit-content' }}>
            GitHub ↗
          </a>
        </div>
      </div>
    </div>
  );
};

// ── TERMINAL COMPONENT ────────────────────────────────────────────────
const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ cmd: string; output: string[] }[]>([
    { cmd: '', output: ['Welcome to Tanay\'s terminal. Type help for commands.'] }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const COMMANDS: Record<string, string[]> = {
    help: ['Available commands:', '  whoami       — about me', '  skills       — tech stack', '  projects     — top projects', '  experience   — work history', '  education    — academic background', '  contact      — get in touch', '  clear        — clear terminal'],
    whoami: ['Tanay Tammineni', 'AI/ML Engineer | GenAI Developer | Published Researcher', 'MS Computer Science, 3.9 GPA — Southeast Missouri State University', 'Currently: AI Systems Developer Intern @ Automate365', 'Location: Irving, TX | Open to full relocation'],
    skills: ['── AI/ML ──', 'PyTorch · TensorFlow · LangChain · LlamaIndex · HuggingFace', 'RAG Pipelines · Agentic Workflows · Model Merging · Fine-tuning', '── Backend ──', 'Python · FastAPI · WebSockets · Docker · REST APIs', '── Cloud ──', 'AWS · Azure · CI/CD · Databricks · PySpark', '── Databases ──', 'MongoDB · Redis · PostgreSQL · SQLite · FAISS'],
    projects: ['1. Distributed Fine-Tune Pipeline    → github.com/TammineniTanay/distributed-finetune-pipeline', '2. Hybrid RAG System                 → github.com/TammineniTanay/hybrid-rag-system', '3. LiveWire AI Transcription         → github.com/Automate365-LLC/Live-Wire-AI-Desktop', '4. Job Command Center                → github.com/TammineniTanay/job-command-center', '5. Vehicle Detection (Published)     → github.com/TammineniTanay/vechiledetection', 'Type "ls projects" for all 18 projects'],
    experience: ['Apr 2025 — Present  | AI Systems Developer Intern @ Automate365', 'Jun 2022 — Dec 2022 | AI/ML Engineer Intern @ Globalshala'],
    education: ['Jan 2024 — Dec 2025 | MS Computer Science, GPA 3.9 @ Southeast Missouri State', '2019 — 2023         | BE Computer Science @ CVR College of Engineering'],
    contact: ['Email    → tanaytammineni22@gmail.com', 'LinkedIn → linkedin.com/in/tanay-tammineni', 'GitHub   → github.com/TammineniTanay', 'Portfolio→ tanaytammineni.vercel.app'],
  };

  const run = useCallback((cmd: string) => {
    const c = cmd.trim().toLowerCase();
    if (c === 'clear') { setHistory([{ cmd: '', output: ['Terminal cleared. Type help for commands.'] }]); return; }
    const output = COMMANDS[c] || [`Command not found: ${cmd}. Type 'help' for available commands.`];
    setHistory(h => [...h, { cmd, output }]);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);

  return (
    <div style={{ background: '#050709', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', fontFamily: 'DM Mono,monospace', fontSize: '0.78rem' }}>
      <div style={{ background: 'var(--surface2)', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }}></span>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }}></span>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }}></span>
        <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '0.65rem' }}>tanay@portfolio ~ bash</span>
      </div>
      <div style={{ padding: '1rem', height: '280px', overflowY: 'auto' }} onClick={() => inputRef.current?.focus()}>
        {history.map((h, i) => (
          <div key={i} style={{ marginBottom: '0.5rem' }}>
            {h.cmd && <div style={{ color: 'var(--accent3)' }}>❯ <span style={{ color: '#fff' }}>{h.cmd}</span></div>}
            {h.output.map((line, j) => <div key={j} style={{ color: 'var(--muted)', paddingLeft: h.cmd ? '1rem' : 0 }}>{line}</div>)}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--accent3)' }}>❯</span>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { run(input); setInput(''); } }}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: 'DM Mono,monospace', fontSize: '0.78rem', flex: 1, caretColor: 'var(--accent)' }}
            placeholder="type a command..." autoFocus />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

// ── JD MATCHER ────────────────────────────────────────────────────────
const JDMatcher = () => {
  const [jd, setJd] = useState('');
  const [results, setResults] = useState<{ matched: string[]; missing: string[]; score: number } | null>(null);

  const MY_SKILLS = [
    'python', 'pytorch', 'tensorflow', 'langchain', 'llamaindex', 'huggingface', 'openai',
    'rag', 'llm', 'fine-tuning', 'embeddings', 'vector', 'fastapi', 'docker', 'aws', 'azure',
    'sql', 'mongodb', 'redis', 'react', 'typescript', 'javascript', 'git', 'ci/cd', 'mlops',
    'machine learning', 'deep learning', 'computer vision', 'nlp', 'transformers', 'bert',
    'databricks', 'pyspark', 'kubernetes', 'rest api', 'websocket', 'asyncio', 'numpy', 'pandas',
    'scikit-learn', 'opencv', 'yolo', 'agentic', 'prompt engineering', 'model merging', 'lora', 'qlora',
  ];

  const analyze = () => {
    if (!jd.trim()) return;
    const lower = jd.toLowerCase();
    const matched = MY_SKILLS.filter(s => lower.includes(s));
    const allKeywords = lower.match(/\b[a-z][a-z0-9\-\.]{2,}\b/g) || [];
    const unique = [...new Set(allKeywords)].filter(w => w.length > 3 && !['with', 'that', 'this', 'will', 'have', 'from', 'your', 'their', 'they', 'experience', 'ability', 'strong', 'work', 'team', 'role', 'skills', 'knowledge'].includes(w));
    const missing = unique.filter(w => !MY_SKILLS.includes(w) && matched.every(m => !m.includes(w))).slice(0, 8);
    const score = Math.min(99, Math.round((matched.length / Math.max(unique.length * 0.3, 1)) * 100));
    setResults({ matched, missing, score });
  };

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
      <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#fff' }}>JD Keyword Matcher</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: '1rem' }}>Paste any job description — see your skill match score instantly. Runs 100% in your browser.</p>
      <textarea value={jd} onChange={e => setJd(e.target.value)}
        placeholder="Paste job description here..."
        style={{ width: '100%', height: '100px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.75rem', color: 'var(--text)', fontFamily: 'DM Mono,monospace', fontSize: '0.72rem', resize: 'vertical', outline: 'none' }} />
      <button onClick={analyze}
        style={{ marginTop: '0.75rem', fontFamily: 'DM Mono,monospace', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.5rem 1.25rem', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', cursor: 'pointer', transition: 'all 0.2s' }}>
        Analyze Match →
      </button>
      {results && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2rem', color: results.score >= 70 ? 'var(--accent3)' : results.score >= 40 ? 'var(--accent)' : '#f87171' }}>{results.score}%</span>
            <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>match score</span>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.65rem', color: 'var(--accent3)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>✓ Matched Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {results.matched.map((s, i) => <span key={i} style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.62rem', background: 'rgba(0,255,148,0.08)', border: '1px solid rgba(0,255,148,0.25)', padding: '0.15rem 0.5rem', color: 'var(--accent3)', borderRadius: '3px' }}>{s}</span>)}
            </div>
          </div>
          {results.missing.length > 0 && (
            <div>
              <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.65rem', color: '#f87171', marginBottom: '0.35rem', textTransform: 'uppercase' }}>○ Keywords to add</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {results.missing.map((s, i) => <span key={i} style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.62rem', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', padding: '0.15rem 0.5rem', color: '#f87171', borderRadius: '3px' }}>{s}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── ALL PROJECTS ──────────────────────────────────────────────────────
const ALL_PROJECTS = [
  {
    id: 1, year: 'Feb 2026 — Mar 2026', title: 'Distributed Fine-Tune Pipeline', badge: 'New',
    bullets: [
      'End-to-end distributed LLM fine-tuning: data curation → QLoRA + DPO → TIES/DARE/SLERP merging → evaluation → vLLM deployment',
      'Built with DeepSpeed ZeRO-3, Flash Attention, and PEFT for memory-efficient distributed training across GPUs',
      'Automated dataset curation with deduplication, quality filtering, and domain-specific preprocessing pipelines',
      'Model merging via SLERP and Task Arithmetic for capability fusion across multiple fine-tuned checkpoints',
      'Custom evaluation harness with hallucination scoring, benchmark comparison, and W&B experiment tracking',
    ],
    tags: ['PyTorch', 'DeepSpeed', 'HuggingFace', 'QLoRA', 'vLLM', 'PEFT'],
    link: 'https://github.com/TammineniTanay/distributed-finetune-pipeline',
  },
  {
    id: 2, year: 'Feb 2026 — Mar 2026', title: 'Hybrid RAG with Self-Correcting Retrieval', badge: 'New',
    bullets: [
      'Production RAG with hybrid retrieval: Qdrant + Elasticsearch + Neo4j for dense, sparse, and graph-based search',
      'Corrective RAG (CRAG) via LangGraph with self-correction loops that re-query when confidence drops below threshold',
      'Feedback-driven reward model that learns from user corrections to improve retrieval ranking over time',
      'RAGAS evaluation dashboard tracking faithfulness, answer relevancy, and context precision metrics',
      'NLI-based hallucination filter with multi-document reasoning and citation source tracking per answer',
    ],
    tags: ['LangGraph', 'Qdrant', 'Elasticsearch', 'Neo4j', 'RAGAS', 'FastAPI'],
    link: 'https://github.com/TammineniTanay/hybrid-rag-system',
  },
  {
    id: 3, year: 'Apr 2025 — Present', title: 'LiveWire AI Meeting Transcription', badge: 'Featured',
    bullets: [
      'Dual-channel audio capture (tab + mic) via Chrome MV3 extension and Python WebSocket server',
      'Async FFmpeg + asyncio for parallel transcription streams across Zoom, Teams, and Google Meet',
      'Platform fingerprinting, rejoin recovery, and RMS trend tracking for production resilience',
      'EBML magic byte validation for clean WebM audio headers and session registry for concurrent recording',
      'Production-deployed at Automate365 with device switch detection and health timeline logging',
    ],
    tags: ['Chrome MV3', 'FastAPI', 'WebSockets', 'Whisper', 'asyncio', 'FFmpeg'],
    link: 'https://github.com/Automate365-LLC/Live-Wire-AI-Desktop',
  },
  {
    id: 4, year: 'Jan 2026 — Feb 2026', title: 'Job Command Center', badge: 'Featured',
    bullets: [
      'Full-stack AI job search automation — scrapes LinkedIn & Wellfound via Apify with configurable filters',
      'Claude Haiku AI scores each job by profile fit on a 0–100 scale with reasoning explanation',
      'Auto-generates tailored LaTeX resumes and LinkedIn InMail messages per job description',
      'React dashboard with job pipeline, notes, application status tracking, and fit score sorting',
      'FastAPI + SQLite backend with Vercel-deployed frontend — handles full job search workflow end-to-end',
    ],
    tags: ['FastAPI', 'React', 'Claude Haiku', 'Apify', 'SQLite', 'LaTeX'],
    link: 'https://github.com/TammineniTanay/job-command-center',
  },
  {
    id: 5, year: 'Jan 2023 — May 2023', title: 'Real-Time Vehicle Detection (CVR Journal)', badge: 'Research',
    bullets: [
      'Published in CVR Journal of Science and Technology Vol. 24, June 2023 — peer-reviewed, 3rd Prize at Expo2K23',
      'Real-time vehicle counting and classification using SSD MobileNet on live traffic video streams',
      'Achieved 88%+ detection accuracy across cars, trucks, motorcycles, and buses with bounding box output',
      'Designed for smart city traffic analysis, automated monitoring, and intelligent transportation systems',
      'Complete pipeline: data collection → training → inference → real-time annotated video output',
    ],
    tags: ['Python', 'OpenCV', 'SSD MobileNet', 'Deep Learning', 'TensorFlow'],
    link: 'https://github.com/TammineniTanay/vechiledetection',
  },
  {
    id: 6, year: 'Jun 2022 — Dec 2022', title: 'Face Recognition Attendance System',
    bullets: [
      'Automated attendance system processing live camera feeds for real-time multi-face identification',
      'Face embedding store for fast identity matching with configurable confidence thresholds at runtime',
      'Automated attendance logging with timestamps and session data directly to SQLite database',
      'Multi-face detection within a single frame — handles crowded classrooms and office environments',
      'Unknown person alerting system with confidence-based flagging for security and access control',
    ],
    tags: ['Python', 'OpenCV', 'face_recognition', 'SQLite', 'Deep Learning'],
    link: 'https://github.com/TammineniTanay/face-recognition-attendance-system',
  },
  {
    id: 7, year: 'Jan 2024 — May 2024', title: 'AI-Powered Vehicle Detection & Tracking for Surveillance',
    bullets: [
      'PP-YOLO-based object detection and multi-object tracking for real-time traffic surveillance systems',
      'Benchmarked 8% mAP improvement over baseline through improved NMS, anchor tuning, and augmentation',
      'Extended class support: cars, trucks, pedestrians, cyclists, and emergency vehicles',
      'Frame-by-frame trajectory estimation with lane-level tracking and directional flow analysis',
      'Supports both video file and live webcam input with annotated output and confidence overlays',
    ],
    tags: ['Python', 'PP-YOLO', 'OpenCV', 'NumPy', 'Computer Vision'],
    link: 'https://github.com/TammineniTanay/vehicle-detection-pp-yolo',
  },
  {
    id: 8, year: 'Jan 2024 — May 2024', title: "Shamir's Secret Sharing",
    bullets: [
      'Cryptographic threshold scheme via Lagrange polynomial interpolation over Mersenne Prime finite field',
      'Configurable k-of-n: split secret into N shares, reconstruct with any K subset — information-theoretically secure',
      'Galois Field GF(2^8) arithmetic ensures zero information leakage from any subset smaller than threshold',
      'CLI interface for share generation, secure distribution, and secret reconstruction workflows',
      'Comprehensive unit tests verifying correctness across boundary k and n values and edge cases',
    ],
    tags: ['Python', 'Cryptography', 'Finite Fields', 'Polynomial Interpolation'],
    link: 'https://github.com/TammineniTanay/Shamir-s-Secret-Sharing',
  },
  {
    id: 9, year: 'Jan 2025 — May 2025', title: 'Hospital Management System',
    bullets: [
      'Full-stack MVC hospital platform: patient records, appointment scheduling, billing, and staff management',
      'Role-based access control with scoped permissions for admin, doctor, and receptionist roles',
      'Conflict detection engine prevents double-booking with real-time doctor availability checking',
      'Automated invoice generation per visit with itemized billing breakdown and payment tracking',
      'Developed for Advanced Software Engineering — includes full documentation and reliability analysis',
    ],
    tags: ['Java', 'MySQL', 'MVC Architecture', 'RBAC', 'Software Engineering'],
    link: 'https://github.com/TammineniTanay/hospital-management-system-ase',
  },
  {
    id: 10, year: 'Jan 2024 — May 2024', title: 'Earthquake Impact Prediction',
    bullets: [
      'Cloud-based ML ensemble predicting structural damage severity from seismic and geospatial features',
      'Feature engineering: magnitude, depth, soil type, fault distance, and historical damage weighting',
      'Ensemble model: Random Forest + Gradient Boosting with voting for multi-class damage classification',
      'Geospatial analysis with distance-to-fault proximity weighting for improved regional accuracy',
      'Full evaluation suite: ROC curves, confusion matrix, feature importance, and cross-validation',
    ],
    tags: ['Python', 'Scikit-learn', 'AWS', 'Pandas', 'Cloud ML'],
    link: 'https://github.com/TammineniTanay/Prredicting-the-Effects-of-Earthquakes',
  },
  {
    id: 11, year: 'Aug 2024 — Dec 2024', title: 'Machine Learning Coursework',
    bullets: [
      'ID3 Decision Trees, Logistic Regression, SVM, Lasso & Ridge Regression built from scratch in NumPy',
      'Neural network with full backpropagation and gradient descent implemented without ML frameworks',
      'Sentiment analysis pipeline using NLP preprocessing, TF-IDF, and multiple classifier comparison',
      'Kernel PCA, LDA, and dimensionality reduction with explained variance and 2D projection plots',
      'K-Means, DBSCAN, and Hierarchical clustering with silhouette scoring and visual cluster output',
    ],
    tags: ['Python', 'NumPy', 'Scikit-learn', 'NLP', 'Jupyter Notebook'],
    link: 'https://github.com/TammineniTanay/machine-learning-coursework',
  },
  {
    id: 12, year: 'Jan 2024 — May 2024', title: 'Distributed Cloud Computing',
    bullets: [
      'AWS-based distributed system with multi-node architecture, leader election, and automatic failover',
      'Cloud architecture implementation with fault tolerance and exponential backoff retry logic',
      'Round-robin and weighted load balancing strategies with horizontal scaling at runtime',
      'Performance benchmarking: throughput, latency, and scalability tradeoff analysis across node counts',
      'Distributed computing experiments comparing centralized vs decentralized coordination approaches',
    ],
    tags: ['AWS', 'Python', 'Distributed Systems', 'Cloud Architecture', 'Jupyter'],
    link: 'https://github.com/TammineniTanay/distributed-cloud-computing-project',
  },
  {
    id: 13, year: 'Jan 2025 — May 2025', title: 'APL Mini Language Interpreter',
    bullets: [
      'Custom lexer and recursive-descent parser generating a full AST from APL array programming syntax',
      'Array primitives: reshape, iota, reduce, scan, outer product, and transpose operations',
      'Monadic and dyadic function dispatch with operator precedence and associativity resolution',
      'Built for CS609 Advanced Programming Languages — demonstrates compiler design fundamentals',
      'REPL interface with session history, error reporting with line/column context, and type checking',
    ],
    tags: ['Python', 'AST', 'Parsing', 'Compiler Design', 'CS609'],
    link: 'https://github.com/TammineniTanay/apl-mini-language-interpreter',
  },
  {
    id: 14, year: 'Jan 2024 — May 2024', title: 'AI Maze Search Visualizer',
    bullets: [
      'Interactive visualizer for BFS, DFS, A*, and Dijkstra search algorithms with live animation',
      'Procedural maze generation with configurable wall density, grid size, and start/end placement',
      'Step-by-step animation with adjustable speed — each node visit animated in real time',
      'Side-by-side algorithm comparison: path length, nodes explored, and time complexity metrics',
      'Educational tool demonstrating heuristic vs uninformed search with performance benchmarking',
    ],
    tags: ['Python', 'Pygame', 'A* Search', 'BFS/DFS', 'AI Algorithms'],
    link: 'https://github.com/TammineniTanay/ai-maze-search',
  },
  {
    id: 15, year: 'Jan 2025 — May 2025', title: 'IIoT Research Survey',
    bullets: [
      'Systematic literature review of 50+ papers on Industrial IoT security, ML, and edge computing',
      'Analysis of ML-based anomaly detection approaches for industrial sensor streams and SCADA systems',
      'Edge vs cloud inference tradeoff evaluation for real-time ICS environments with latency constraints',
      'Taxonomy of attack vectors in industrial control systems with mitigation strategy classification',
      'Future directions analysis: federated learning for privacy-preserving IIoT deployments at scale',
    ],
    tags: ['Research', 'IIoT', 'Edge AI', 'Federated Learning', 'Security'],
    link: 'https://github.com/TammineniTanay/research-methods-iiot-survey',
  },
  {
    id: 16, year: 'Aug 2024 — Dec 2024', title: 'HCI Case Studies',
    bullets: [
      'Usability testing sessions with task completion rate, error rate, and time-on-task metrics',
      'WCAG 2.1 accessibility audit with severity ratings and actionable remediation recommendations',
      'A/B interface experiments measuring cognitive load and user preference across design variants',
      'Heuristic evaluation using Nielsen\'s 10 usability principles with prioritized issue backlog',
      'Low and high-fidelity prototypes iterated based on think-aloud user feedback sessions',
    ],
    tags: ['UX Design', 'Usability Testing', 'WCAG 2.1', 'Figma', 'HCI'],
    link: 'https://github.com/TammineniTanay/human-computer-interaction-projects',
  },
  {
    id: 17, year: 'Jan 2025 — May 2025', title: 'Traffic Monitoring AI',
    bullets: [
      'Computer vision pipeline for real-time vehicle movement extraction from live traffic video feeds',
      'Frame-by-frame object tracking with trajectory estimation and lane-level directional flow analysis',
      'Vehicle counting per lane with density classification: free flow / congested / gridlock states',
      'Preprocessing pipeline with contrast normalization and frame stabilization for edge hardware',
      'Output: annotated video overlays with per-lane counts, speed estimates, and density heatmap',
    ],
    tags: ['Python', 'OpenCV', 'Computer Vision', 'NumPy', 'Jupyter'],
    link: 'https://github.com/TammineniTanay/realtime-Vechile-Detection-using-AI',
  },
  {
    id: 18, year: 'Jan 2026 — Feb 2026', title: 'Portfolio Website',
    bullets: [
      'Built with Next.js 16 + TypeScript + Tailwind CSS — 18-card flip project showcase with category filter',
      'Live terminal emulator with whoami, skills, projects, contact commands fully functional in browser',
      'JD keyword matcher running 100% client-side — paste any job description for instant skill match score',
      'Typewriter animation, scroll-triggered counters, custom cursor with lag ring, and scroll progress bar',
      'Fully responsive with IntersectionObserver fade-ins — deployed on Vercel with automatic CI/CD',
    ],
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React', 'Vercel'],
    link: 'https://github.com/TammineniTanay/portfolio',
  },
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────
export default function Portfolio() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [statsVisible, setStatsVisible] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showJD, setShowJD] = useState(false);

  const typewriterText = useTypewriter(['AI/ML Engineer', 'LLM Developer', 'GenAI Builder', 'ML Researcher', 'Published Author'], 80, 2000);

  const gpaCount = useCounter(39, 1500, statsVisible);
  const projectCount = useCounter(18, 1500, statsVisible);
  const expCount = useCounter(1, 1000, statsVisible);

  const FILTERS = ['All', 'AI / LLM', 'Computer Vision', 'Full Stack', 'Systems', 'ML / Data'];
  const filterMap: Record<string, number[]> = {
    'All': ALL_PROJECTS.map(p => p.id),
    'AI / LLM': [1, 2, 3, 4],
    'Computer Vision': [5, 6, 7, 17],
    'Full Stack': [4, 9, 18],
    'Systems': [8, 12, 13],
    'ML / Data': [10, 11, 14, 15, 16],
  };
  const visibleProjects = ALL_PROJECTS.filter(p => filterMap[activeFilter]?.includes(p.id));

  // Custom cursor
  useEffect(() => {
    const cursor = cursorRef.current; const ring = ringRef.current;
    let mx = 0, my = 0, rx = 0, ry = 0; let rafId: number;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const anim = () => {
      if (cursor) cursor.style.transform = `translate(${mx - 5}px,${my - 5}px)`;
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      if (ring) ring.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
      rafId = requestAnimationFrame(anim);
    };
    window.addEventListener('mousemove', onMove); anim();
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafId); };
  }, []);

  // Skill bar observer
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.querySelectorAll('.skill-bar-fill').forEach(b => { (b as HTMLElement).style.animationPlayState = 'running'; });
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-group').forEach(g => obs.observe(g));
    return () => obs.disconnect();
  }, []);

  // Stats counter observer
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.5 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  // Back to top
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#050709]/80 backdrop-blur-md border-b border-[#1e2535]">
        <div className="max-w-[1400px] mx-auto px-[5%] py-4 flex justify-between items-center">
          <a href="#" className="font-mono text-[#00e5ff] font-bold tracking-widest text-lg uppercase italic">TT.</a>
          <div className="flex gap-6 text-xs md:text-sm font-mono text-[#5a6478] uppercase tracking-widest">
            <a href="#projects" className="hover:text-[#00e5ff] transition-colors">01. Projects</a>
            <a href="#experience" className="hover:text-[#00e5ff] transition-colors">02. Background</a>
            <a href="#skills" className="hover:text-[#00e5ff] transition-colors">03. Stack</a>
            <a href="#contact" className="hover:text-[#00e5ff] transition-colors">04. Contact</a>
          </div>
        </div>
      </nav>

      {/* BG */}
      <div className="bg-grid"></div>
      <div className="bg-noise"></div>
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>
      <div ref={cursorRef} className="cursor-dot"></div>
      <div ref={ringRef} className="cursor-ring"></div>

      {/* HERO */}
      <section className="min-h-[85vh] flex flex-col justify-center px-[5%] max-w-[1400px] mx-auto relative pt-28 pb-12">
        <div className="text-[0.85rem] font-mono text-[#00e5ff] uppercase tracking-[3px] mb-4 italic">Irving, TX // Status: Online // Open to Work</div>
        <h1 className="text-[clamp(3rem,8vw,6rem)] leading-[1.1] font-bold title-font mb-4 tracking-tight text-white uppercase italic">
          TANAY<br />TAMMINENI.
        </h1>
        {/* TYPEWRITER */}
        <div className="text-[clamp(1.2rem,3vw,2rem)] font-mono text-[#00e5ff] mb-6 h-10">
          <span>{typewriterText}</span>
          <span style={{ animation: 'blink 1s step-end infinite', borderRight: '2px solid var(--accent)' }}>&nbsp;</span>
        </div>
        <p className="text-xl md:text-2xl text-[#5a6478] max-w-[800px] mb-8 font-light leading-relaxed italic">
          <strong className="text-white font-medium italic">MS CS · 3.9 GPA · Published Researcher · AI Systems Developer Intern @ Automate365</strong><br />
          Bridging real-time deep learning performance with production-grade LLM systems.
        </p>
        <div className="flex gap-4 flex-wrap relative z-50 mb-8">
          <a href="#projects" className="btn primary">Deployments</a>
          <a href="https://drive.google.com/file/d/1Mq-bdqzuT-_7E4vBPVMMoEFHzBV0Fxf6/view" target="_blank" className="btn">Resume ↗</a>
          <a href="https://github.com/TammineniTanay" target="_blank" className="btn">GitHub ↗</a>
          <button onClick={() => setShowTerminal(t => !t)} className="btn" style={{ borderColor: 'var(--accent3)', color: 'var(--accent3)' }}>
            {showTerminal ? 'Close Terminal' : '$ Terminal'}
          </button>
        </div>
        {/* CURRENTLY BUILDING */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent3)', padding: '0.75rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', maxWidth: '500px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent3)', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite', flexShrink: 0 }}></span>
          <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.72rem', color: 'var(--muted)' }}>
            <span style={{ color: 'var(--accent3)' }}>Currently building:</span> AI-powered portfolio tools — live terminal, JD matcher, semantic project search
          </span>
        </div>
        {/* TERMINAL */}
        {showTerminal && (
          <div style={{ marginTop: '1.5rem', maxWidth: '700px' }}>
            <Terminal />
          </div>
        )}
      </section>

      {/* ABOUT ME */}
      <section className="px-[5%] max-w-[1400px] mx-auto py-20 relative z-20">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }} className="grid-cols-1 lg:grid-cols-2">
          <div>
            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.72rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>// About Me</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem,3vw,2.5rem)', color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              From CV Research<br />to Production LLMs.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                "I started with computer vision — building real-time vehicle detection systems and publishing peer-reviewed research. That obsession with making AI work in the real world never left.",
                "At Automate365, I've shipped production RAG pipelines, real-time transcription systems, and end-to-end LLM fine-tuning infrastructure. I don't just prototype — I deploy.",
                "I'm an MS grad from Southeast Missouri State (3.9 GPA), originally from Hyderabad, India, now based in Irving, TX. I bring a global perspective and a bias toward building things that actually work.",
              ].map((p, i) => (
                <p key={i} style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.8 }}>{p}</p>
              ))}
            </div>
          </div>
          {/* What I Bring */}
          <div>
            <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '0.72rem', color: 'var(--accent3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>// What I Bring</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: '⚡', title: 'Production-Grade AI', desc: 'I build LLM pipelines, RAG systems, and CV models that run in production — not just Jupyter notebooks. Deployed at Automate365 serving real enterprise clients.' },
                { icon: '📄', title: 'Published Research', desc: 'Peer-reviewed researcher with published work in computer vision. I understand the gap between academic AI and production AI — and how to bridge it.' },
                { icon: '🔧', title: 'Full-Stack AI Engineering', desc: 'From model fine-tuning and RAG architecture to FastAPI backends and React dashboards — I can own the entire AI product stack end to end.' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '1.25rem', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', borderLeft: `3px solid var(--accent3)` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                    <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{item.title}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section ref={statsRef} className="border-y border-[#1e2535] bg-[#0c0f14]/80 backdrop-blur-md relative z-20">
        <div className="max-w-[1400px] mx-auto px-[5%] py-8 flex flex-row justify-between items-center font-mono uppercase tracking-widest">
          <div className="flex flex-col">
            <span className="text-[#00e5ff] text-xs mb-1">MS GPA</span>
            <strong className="text-2xl text-white">{statsVisible ? (gpaCount / 10).toFixed(1) : '0.0'}</strong>
          </div>
          <div className="flex flex-col">
            <span className="text-[#7c3aed] text-xs mb-1">Research</span>
            <strong className="text-2xl text-white">Peer-Reviewed</strong>
          </div>
          <div className="flex flex-col">
            <span className="text-[#00ff94] text-xs mb-1">Projects</span>
            <strong className="text-2xl text-white">{statsVisible ? projectCount : 0}</strong>
          </div>
          <div className="flex flex-col">
            <span className="text-[#f7a26a] text-xs mb-1">Experience</span>
            <strong className="text-2xl text-white">{statsVisible ? expCount : 0}+ Years</strong>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-container mt-20 mb-20 opacity-60">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              {['Python', 'LLMs', 'RAG Pipelines', 'Deep Learning', 'Computer Vision', 'Cryptography', 'FastAPI', 'Agentic AI', 'DeepSpeed', 'LangGraph'].map(s => (
                <div key={s} className="marquee-item"><span>//</span> {s}</div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* PROJECTS */}
      <section id="projects" className="px-[5%] max-w-[1400px] mx-auto py-20 relative z-20">
        <h2 className="text-4xl title-font mb-4 text-white uppercase italic font-bold">
          <span className="text-[#00e5ff] font-mono text-lg mr-4 block mb-2">01.</span>
          Architectures &amp; Deployments
        </h2>
        <p className="text-[var(--muted)] font-mono text-xs mb-8 italic">Click any card to flip and see full details</p>

        {/* FILTER */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 border transition-all"
              style={{ borderColor: activeFilter === f ? 'var(--accent3)' : 'var(--border)', color: activeFilter === f ? 'var(--accent3)' : 'var(--muted)', background: activeFilter === f ? 'rgba(0,255,148,0.05)' : 'transparent' }}>
              {f} {f === 'All' ? `(${ALL_PROJECTS.length})` : `(${filterMap[f]?.length ?? 0})`}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.5rem' }}>
          {visibleProjects.map(p => <FlipCard key={p.id} {...p} />)}
        </div>
      </section>

      {/* JD MATCHER SECTION */}
      <section className="px-[5%] max-w-[1400px] mx-auto pb-20 relative z-20">
        <button onClick={() => setShowJD(j => !j)}
          className="font-mono text-xs uppercase tracking-widest px-6 py-3 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-all mb-6">
          {showJD ? 'Hide' : '⚡ Try'} JD Keyword Matcher — paste any job description
        </button>
        {showJD && <div className="max-w-2xl"><JDMatcher /></div>}
      </section>

      {/* BACKGROUND */}
      <section id="experience" className="px-[5%] max-w-[1400px] mx-auto py-20 grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-20">
        <div>
          <h2 className="text-4xl title-font mb-16 text-white uppercase italic font-bold">
            <span className="text-[#00e5ff] font-mono text-lg mr-4 block mb-2">02.</span>Background
          </h2>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <span className="font-mono text-sm text-[#00e5ff]">Apr 2025 — Present</span>
            <h3 className="text-xl title-font text-white mt-2 font-bold">AI Systems Developer Intern @ Automate365</h3>
            <p className="text-sm text-[#e8eaf0]/70 mt-3 italic">Deploying real-time LLM pipelines, hybrid RAG systems, and AI transcription infrastructure for enterprise clients in Irving, TX.</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <span className="font-mono text-sm text-[#00e5ff]">Jun 2022 — Dec 2022</span>
            <h3 className="text-xl title-font text-white mt-2 font-bold">AI/ML Engineer Intern @ Globalshala</h3>
            <p className="text-sm text-[#e8eaf0]/70 mt-3 italic">Built ML models for text classification and computer vision pipelines achieving 87% accuracy on production datasets.</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <span className="font-mono text-sm text-[#00e5ff]">Jan 2024 — Dec 2025</span>
            <h3 className="text-xl title-font text-white mt-2 font-bold">MS, Computer Science @ Southeast Missouri State University</h3>
            <p className="text-sm text-[#e8eaf0]/70 mt-3 italic">3.9 GPA. Specialization in Advanced AI, Distributed Systems, and Human-Computer Interaction.</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot" style={{ background: 'var(--muted)', boxShadow: 'none' }}></div>
            <span className="font-mono text-sm text-[#00e5ff]">2019 — 2023</span>
            <h3 className="text-xl title-font text-white mt-2 font-bold">BE, Computer Science @ CVR College of Engineering</h3>
            <p className="text-sm text-[#e8eaf0]/70 mt-3 italic">Engineering foundation in Algorithms, Data Structures, Database Systems, and OOP.</p>
          </div>

          {/* PUBLICATION */}
          <div className="mt-10 p-5 border border-[#1e2535]" style={{ borderLeft: '2px solid #7c3aed' }}>
            <span className="font-mono text-xs text-[#7c3aed] uppercase tracking-widest block mb-2">📄 Peer-Reviewed Publication</span>
            <h3 className="title-font text-white font-bold mb-2 leading-snug text-sm">Real-Time Video-Based Vehicle Detection, Counting &amp; Classification System</h3>
            <p className="text-xs text-[#5a6478] mb-3 italic">CVR Journal of Science &amp; Technology · Vol. 24 · June 2023 · 3rd Prize Expo2K23</p>
            <a href="https://www.researchgate.net/publication/372595973_Real_Time_Video_based_Vehicle_Detection_Counting_and_Classification_System"
              target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-[#7c3aed] hover:text-white transition-colors"
              style={{ borderBottom: '1px solid #7c3aed', paddingBottom: '2px' }}>
              Read on ResearchGate →
            </a>
          </div>
        </div>

        {/* SKILLS */}
        <div id="skills">
          <h2 className="text-4xl title-font mb-16 text-white uppercase italic font-bold">
            <span className="text-[#00e5ff] font-mono text-lg mr-4 block mb-2">03.</span>Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              ['Python / SQL / C', '95%'],
              ['LLMs / RAG / Agents', '92%'],
              ['ML (TF / PyTorch / Scikit)', '90%'],
              ['CV (OpenCV / YOLO)', '88%'],
              ['FastAPI / WebSockets', '85%'],
              ['Cloud (AWS / Azure)', '82%'],
              ['Cryptography', '78%'],
              ['React / Next.js', '76%'],
            ].map(([name, p]) => (
              <div key={name} className="skill-group">
                <div className="flex justify-between font-mono text-xs mb-2 uppercase tracking-widest font-bold">
                  <span className="text-white">{name}</span>
                  <span className="text-[#00e5ff]">{p}</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-bar-fill" style={{ '--p': p } as React.CSSProperties}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DATA */}
      <section className="px-[5%] max-w-[1400px] mx-auto pb-20 relative z-20">
        <h2 className="text-4xl title-font mb-10 text-white uppercase italic font-bold">
          <span className="text-[#00e5ff] font-mono text-lg mr-4 block mb-2">04.</span>Live Data
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <GitHubStats />
          <ArxivFeed />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <ProjectTimeline />
          <ProjectComplexityMatrix />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <SkillsGalaxy />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <HackerNewsFeed />
          <Certifications />
        </div>
      </section>

      {/* CONTACT */}
      <footer id="contact" className="pt-20 pb-20 text-center relative overflow-hidden border-t border-[#1e2535]">
        <div className="font-mono text-xs text-[#00e5ff] uppercase tracking-widest mb-4 opacity-70">05. Contact · Open to AI/ML roles · Full relocation · Irving, TX</div>
        <h2 className="text-[clamp(2rem,8vw,4rem)] title-font mb-8 text-white uppercase italic font-bold tracking-tighter">Let&apos;s_Build_Together</h2>
        <a href="mailto:tanaytammineni22@gmail.com" className="btn primary text-lg px-12 py-4 mb-12 relative z-50 inline-block">
          tanaytammineni22@gmail.com
        </a>
        <div className="flex justify-center gap-10 font-mono text-sm text-[#5a6478] uppercase relative z-50 italic font-bold mb-4">
          <a href="https://www.linkedin.com/in/tanay-tammineni/" target="_blank" className="hover:text-[#00e5ff] transition-colors">LinkedIn</a>
          <a href="https://github.com/TammineniTanay" target="_blank" className="hover:text-[#00e5ff] transition-colors">GitHub</a>
          <a href="https://drive.google.com/file/d/1Mq-bdqzuT-_7E4vBPVMMoEFHzBV0Fxf6/view" target="_blank" className="hover:text-[#00e5ff] transition-colors">Resume</a>
        </div>
        <div className="font-mono text-[10px] text-[#5a6478] opacity-50">Last updated: March 2026 · Actively seeking full-time AI/ML roles</div>
      </footer>

      {/* BACK TO TOP */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 200, fontFamily: 'DM Mono,monospace', fontSize: '0.7rem', letterSpacing: '0.1em', padding: '0.6rem 1rem', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--accent)', cursor: 'pointer', transition: 'all 0.2s' }}>
          ↑ Top
        </button>
      )}
    </>
  );
}