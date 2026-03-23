"use client";
import React, { useEffect, useRef, useState } from 'react';

// ── FLIP CARD COMPONENT ──────────────────────────────────────────────
const FlipCard = ({ year, title, bullets, tags, link, badge }: {
  year: string; title: string; bullets: string[];
  tags: string[]; link: string; badge?: string;
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative"
      style={{ perspective: '1200px', height: '400px', cursor: 'pointer' }}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        style={{
          position: 'relative', width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          background: 'var(--card-bg)', border: '1px solid var(--border)',
          borderRadius: '8px', padding: '2rem',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          overflow: 'hidden',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: 'var(--accent)' }}>{year}</span>
              {badge && (
                <span style={{
                  fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', padding: '0.15rem 0.5rem',
                  color: badge === 'New' ? 'var(--accent3)' : badge === 'Research' ? '#e879f9' : 'var(--accent)',
                  border: `1px solid ${badge === 'New' ? 'rgba(0,255,148,0.35)' : badge === 'Research' ? 'rgba(232,121,249,0.35)' : 'rgba(0,229,255,0.35)'}`,
                }}>
                  {badge}
                </span>
              )}
            </div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>{title}</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{bullets[0]}</p>
          </div>
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {tags.map((t, i) => (
              <span key={i} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '0.2rem 0.6rem', color: '#a0aec0', borderRadius: '3px' }}>{t}</span>
            ))}
          </div>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--accent)', marginTop: '0.75rem', opacity: 0.7, letterSpacing: '0.05em' }}>◈ Click to see details</p>
        </div>

        {/* BACK */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: '#0d1220', border: '1px solid rgba(0,229,255,0.2)',
          borderRadius: '8px', padding: '1.75rem',
          display: 'flex', flexDirection: 'column', gap: '0.6rem',
          overflow: 'hidden',
        }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Key Features</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: 'var(--muted)', opacity: 0.5, marginTop: '-0.3rem' }}>click card to flip back</span>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff', lineHeight: 1.3 }}>{title}</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ fontSize: '0.75rem', color: 'var(--muted)', paddingLeft: '1rem', position: 'relative', lineHeight: 1.55 }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--accent3)', fontSize: '0.65rem' }}>▸</span>
                {b}
              </li>
            ))}
          </ul>
          <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: '0.75rem', fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#f7a26a', lineHeight: 1.6 }}>
            {tags.join(' · ')}
          </div>
          <a
            href={link} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--accent3)',
              border: '1px solid rgba(0,255,148,0.3)', padding: '0.4rem 1rem',
              textDecoration: 'none', display: 'inline-block', marginTop: 'auto',
              transition: 'all 0.2s', width: 'fit-content',
            }}
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </div>
  );
};

// ── LEGACY TILT CARD (kept for featured/large cards) ─────────────────
const ProjectCard = ({ className, year, title, bullets, tags, link, linkText = "View Repository", badge }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <div
      ref={cardRef}
      className={`project-card ${className} flex flex-col justify-between group relative`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.1s ease, border-color 0.3s ease' }}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <span className="project-year text-[#00e5ff] font-mono text-sm block">{year}</span>
          {badge && (
            <span style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0.15rem 0.5rem',
              color: badge === 'New' ? '#00ff94' : badge === 'Research' ? '#e879f9' : '#00e5ff',
              border: `1px solid ${badge === 'New' ? 'rgba(0,255,148,0.35)' : badge === 'Research' ? 'rgba(232,121,249,0.35)' : 'rgba(0,229,255,0.35)'}`,
            }}>{badge}</span>
          )}
        </div>
        <h3 className="project-title title-font text-white font-bold text-2xl mb-4">{title}</h3>
        <ul className="space-y-2 mb-6">
          {bullets.map((b: string, i: number) => (
            <li key={i} className="text-[#5a6478] text-sm flex items-start gap-2 leading-relaxed">
              <span className="text-[#00e5ff] mt-0.5 text-xs">▹</span> {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto pt-6 border-t border-[#1e2535] flex flex-wrap justify-between items-end gap-4 relative z-20">
        <div className="flex flex-wrap gap-2 max-w-[70%]">
          {tags.map((tag: string, i: number) => (
            <span key={i} className="font-mono text-[10px] uppercase tracking-wider bg-[#111620] text-[#a0aec0] px-2 py-1 rounded border border-[#1e2535]">{tag}</span>
          ))}
        </div>
        <a href={link} target="_blank" rel="noopener noreferrer"
          className="text-[#00e5ff] hover:text-white font-mono text-sm tracking-widest uppercase transition-colors p-2 -mr-2 relative z-30">
          {linkText} →
        </a>
      </div>
    </div>
  );
};

// ── ALL PROJECT DATA ──────────────────────────────────────────────────
const ALL_PROJECTS = [
  {
    id: 1, year: '2025 // New', title: 'End-to-End LLM Pipeline', badge: 'New',
    bullets: [
      'Automated dataset curation with deduplication and quality filtering for domain-specific training',
      'Fine-tuning with LoRA/QLoRA on domain corpora; model merging via SLERP and Task Arithmetic',
      'Custom evaluation harness with hallucination scoring and benchmark comparison',
      'Modular pipeline — swap any stage (data, training, merge, eval) independently',
      'Weights & Biases integration for experiment tracking and reproducibility',
    ],
    tags: ['PyTorch', 'HuggingFace', 'LangChain', 'PEFT', 'W&B'],
    link: 'https://github.com/TammineniTanay',
  },
  {
    id: 2, year: '2025 // New', title: 'Advanced RAG System', badge: 'New',
    bullets: [
      'Hybrid retrieval combining dense embeddings (FAISS) and BM25 sparse search with RRF fusion',
      'Self-correction loop — automatically re-queries when confidence score drops below threshold',
      'NLI-based hallucination filter verifying faithfulness of generated answers',
      'Multi-document reasoning with citation source tracking per answer',
      'Streaming FastAPI with response latency under 800ms end-to-end',
    ],
    tags: ['LlamaIndex', 'FAISS', 'BM25', 'FastAPI', 'OpenAI'],
    link: 'https://github.com/TammineniTanay',
  },
  {
    id: 3, year: '2025 // Production', title: 'Live-Wire-AI Meeting Transcription', badge: 'Featured',
    bullets: [
      'Dual-channel audio capture (tab + mic) via Chrome MV3 extension and Python WebSocket server',
      'Async FFmpeg + asyncio for parallel transcription streams across Zoom, Teams, and Meet',
      'Platform fingerprinting, rejoin recovery, and RMS trend tracking for resilience',
      'EBML magic byte validation for clean WebM audio headers',
      'Production-deployed at Automate365 with session registry for concurrent recording',
    ],
    tags: ['Chrome MV3', 'FastAPI', 'WebSockets', 'OpenAI Whisper', 'asyncio', 'FFmpeg'],
    link: 'https://github.com/Automate365-LLC/Live-Wire-AI-Desktop',
  },
  {
    id: 4, year: '2025 // AI', title: 'Job Command Center', badge: 'Featured',
    bullets: [
      'Scrapes LinkedIn & Wellfound via Apify with configurable role and location filters',
      'Claude Haiku AI scores each job by profile fit on a 0–100 scale',
      'Auto-generates tailored LaTeX resumes per job description',
      'React dashboard with job pipeline, notes, and application status tracking',
      'FastAPI + SQLite backend · Frontend deployed on Vercel',
    ],
    tags: ['FastAPI', 'React', 'Claude Haiku', 'Apify', 'SQLite', 'LaTeX'],
    link: 'https://github.com/TammineniTanay/job-command-center',
  },
  {
    id: 5, year: '2023 // Published', title: 'Real-Time Vehicle Detection (CVR Journal)', badge: 'Research',
    bullets: [
      'Published in CVR Journal of Science and Technology Vol. 24; 3rd Prize at Expo2K23',
      'Real-time vehicle counting and classification using SSD MobileNet on traffic streams',
      'Achieved 88%+ detection accuracy across multiple vehicle classes',
      'Multi-class detection: cars, trucks, motorcycles, buses with bounding box annotation',
      'Applications: smart city traffic analysis and automated monitoring systems',
    ],
    tags: ['Python', 'OpenCV', 'Deep Learning', 'SSD MobileNet'],
    link: 'https://github.com/TammineniTanay/vechiledetection',
  },
  {
    id: 6, year: '2024 // Computer Vision', title: 'Face Recognition Attendance',
    bullets: [
      'Automated system processing live camera feeds for multi-face identification in real time',
      'Embedding store using face encodings for fast identity matching at runtime',
      'Automated attendance logging with timestamps directly to SQLite database',
      'Multi-face detection within a single frame — handles crowded classrooms or offices',
      'Unknown person alerting with configurable confidence threshold for security',
    ],
    tags: ['Python', 'OpenCV', 'face_recognition', 'SQLite'],
    link: 'https://github.com/TammineniTanay/face-recognition-attendance-system',
  },
  {
    id: 7, year: '2024 // Computer Vision', title: 'Vehicle Detection (PP-YOLO)',
    bullets: [
      'PP-YOLO-based object detection pipeline for real-time traffic monitoring',
      'Benchmarked 8% mAP improvement over baseline through improved NMS and anchor tuning',
      'Supports both video file and live webcam input modes seamlessly',
      'Custom preprocessing pipeline with contrast normalization for low-light conditions',
      'Annotated output with bounding boxes, class labels, and confidence scores',
    ],
    tags: ['Python', 'PP-YOLO', 'OpenCV', 'NumPy'],
    link: 'https://github.com/TammineniTanay/vehicle-detection-pp-yolo',
  },
  {
    id: 8, year: '2024 // Cryptography', title: "Shamir's Secret Sharing",
    bullets: [
      'Implemented threshold cryptography via Lagrange polynomial interpolation in GF(2^8)',
      'Configurable k-of-n scheme: split secret into N shares, reconstruct with any K subset',
      'Galois Field arithmetic ensures perfect information-theoretic security — no leakage',
      'CLI interface for share generation, distribution, and secret reconstruction',
      'Unit tests verifying correctness across edge cases including boundary k and n values',
    ],
    tags: ['Python', 'Cryptography', 'GF Math', 'Polynomial Interpolation'],
    link: 'https://github.com/TammineniTanay/Shamir-s-Secret-Sharing',
  },
  {
    id: 9, year: '2023 // Full Stack', title: 'Hospital Management System',
    bullets: [
      'MVC-based modular architecture for patient records, appointments, and billing',
      'Role-based access control: admin, doctor, and receptionist with scoped permissions',
      'Conflict detection engine prevents double-booking for doctor scheduling',
      'Invoice generation per patient visit with itemized billing breakdown',
      'Search and filter across patients, doctors, and appointments with pagination',
    ],
    tags: ['Java', 'MySQL', 'MVC Architecture', 'RBAC'],
    link: 'https://github.com/TammineniTanay/hospital-management-system-ase',
  },
  {
    id: 10, year: '2024 // ML', title: 'Earthquake Impact Prediction',
    bullets: [
      'Ensemble ML (Random Forest + Gradient Boosting) predicting structural damage severity',
      'Feature engineering: seismic magnitude, depth, soil type, and distance-to-fault weighting',
      'Multi-class classification: none / minor / moderate / severe damage categories',
      'ROC curves, confusion matrix, and feature importance visualizations for interpretability',
      'Geospatial analysis with distance-to-fault proximity weighting for accuracy boost',
    ],
    tags: ['Python', 'Scikit-learn', 'Pandas', 'Seaborn'],
    link: 'https://github.com/TammineniTanay/Prredicting-the-Effects-of-Earthquakes',
  },
  {
    id: 11, year: '2024 // ML', title: 'Machine Learning Coursework',
    bullets: [
      'Linear/Logistic Regression, SVM, KNN, Decision Trees built from scratch in NumPy',
      'Neural network with full backpropagation implemented without any ML frameworks',
      'K-Means, DBSCAN, and Hierarchical clustering algorithms with visual cluster output',
      'PCA and kernel PCA for dimensionality reduction with explained variance plots',
      'Random Forest and Gradient Boosting ensemble methods with cross-validation',
    ],
    tags: ['Python', 'NumPy', 'Scikit-learn', 'Pandas'],
    link: 'https://github.com/TammineniTanay/machine-learning-coursework',
  },
  {
    id: 12, year: '2024 // Systems', title: 'Distributed Cloud Computing',
    bullets: [
      'Multi-node distributed system with leader election via modified Bully algorithm',
      'Automatic failover on node crash detection with health-check heartbeats',
      'Round-robin and weighted load balancing strategies switchable at runtime',
      'Message-passing via TCP sockets with exponential backoff retry logic',
      'Horizontal scaling — add or remove nodes dynamically without downtime',
    ],
    tags: ['Cloud Computing', 'Distributed Systems', 'Python', 'Docker'],
    link: 'https://github.com/TammineniTanay/distributed-cloud-computing-project',
  },
  {
    id: 13, year: '2024 // Systems', title: 'APL Mini Language Interpreter',
    bullets: [
      'Custom lexer and recursive-descent parser generating a full AST from APL syntax',
      'Array primitives: reshape, iota, reduce, scan, outer product, and transpose',
      'Monadic and dyadic function dispatch with operator precedence resolution',
      'REPL interface for interactive APL evaluation with session history',
      'Detailed error reporting with line, column context, and error type classification',
    ],
    tags: ['Python', 'Parsing', 'AST', 'Interpreter Design'],
    link: 'https://github.com/TammineniTanay/apl-mini-language-interpreter',
  },
  {
    id: 14, year: '2023 // AI', title: 'AI Maze Search Visualizer',
    bullets: [
      'Interactive visualizer for BFS, DFS, A*, and Dijkstra search algorithms',
      'Procedural maze generation with configurable wall density and grid size',
      'Step-by-step animation with adjustable playback speed for educational use',
      'Side-by-side algorithm comparison showing path length and nodes explored',
      'Demonstrates heuristic vs uninformed search tradeoffs visually',
    ],
    tags: ['Python', 'A* Search', 'Pygame', 'AI'],
    link: 'https://github.com/TammineniTanay/ai-maze-search',
  },
  {
    id: 15, year: '2025 // Research', title: 'IIoT Research Survey',
    bullets: [
      'Systematic literature review of 50+ papers on Industrial IoT security and ML',
      'Analysis of ML-based anomaly detection approaches for industrial sensor streams',
      'Edge vs cloud inference tradeoff evaluation for real-time ICS environments',
      'Taxonomy of attack vectors in industrial control systems with mitigation strategies',
      'Future directions: federated learning for privacy-preserving IIoT deployments',
    ],
    tags: ['Research', 'IoT', 'Edge AI', 'Federated Learning'],
    link: 'https://github.com/TammineniTanay/research-methods-iiot-survey',
  },
  {
    id: 16, year: '2024 // UX', title: 'HCI Case Studies',
    bullets: [
      'Conducted usability testing sessions with task completion rate and error rate metrics',
      'WCAG 2.1 accessibility audit with remediation recommendations for each violation',
      'A/B interface experiments measuring cognitive load across design variants',
      'Heuristic evaluation using Nielsen\'s 10 principles with severity ratings',
      'Low and high-fidelity prototypes iterated based on user feedback sessions',
    ],
    tags: ['UX Design', 'Usability Testing', 'HCI', 'Figma'],
    link: 'https://github.com/TammineniTanay/human-computer-interaction-projects',
  },
  {
    id: 17, year: '2023 // Vision', title: 'Traffic Monitoring AI',
    bullets: [
      'Computer vision pipeline extracting vehicle movement data from live traffic feeds',
      'Frame-by-frame object tracking with trajectory estimation across multiple lanes',
      'Vehicle counting per lane with directional flow analysis for traffic density',
      'Preprocessing pipeline with contrast normalization optimized for edge hardware',
      'Output visualization with annotated overlays for real-time monitoring dashboards',
    ],
    tags: ['Python', 'Computer Vision', 'OpenCV'],
    link: 'https://github.com/TammineniTanay/realtime-Vechile-Detection-using-AI',
  },
  {
    id: 18, year: '2025 // Branding', title: 'Developer Branding',
    bullets: [
      'Centralized hub for 19 projects spanning ML, AI, CV, systems, and full-stack',
      'Structured README documentation with project descriptions, stack, and links',
      'Pinned repositories curated to highlight flagship and research projects',
      'Consistent commit history and branching strategy across all repositories',
      'GitHub profile README with live stats, skills, and featured project showcase',
    ],
    tags: ['GitHub', 'Markdown', 'Branding'],
    link: 'https://github.com/TammineniTanay/TammineniTanay',
  },
  {
    id: 19, year: '2026 // Live', title: 'Portfolio Redesign',
    bullets: [
      'Built with Next.js 16 + TypeScript + Tailwind CSS + Framer Motion',
      '19-card flip project showcase with category filter and click-to-flip interaction',
      'Custom cursor with lag ring, scroll progress bar, and radial glow effect',
      'IntersectionObserver-driven skill bar animations and section fade-ins',
      'Fully responsive — deployed on Vercel with automatic CI/CD on push',
    ],
    tags: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    link: 'https://github.com/TammineniTanay/portfolio',
  },
];

// ── MAIN PORTFOLIO COMPONENT ─────────────────────────────────────────
export default function Portfolio() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const FILTERS = ['All', 'AI / LLM', 'Computer Vision', 'Full Stack', 'Systems', 'ML / Data'];

  const filterMap: Record<string, number[]> = {
    'All': ALL_PROJECTS.map(p => p.id),
    'AI / LLM': [1, 2, 3, 4, 14],
    'Computer Vision': [5, 6, 7, 17],
    'Full Stack': [4, 9, 15, 19],
    'Systems': [8, 12, 13],
    'ML / Data': [10, 11, 15, 16],
  };

  const visibleProjects = ALL_PROJECTS.filter(p => filterMap[activeFilter]?.includes(p.id));

  // Custom Cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    let mx = 0, my = 0, rx = 0, ry = 0;
    let rafId: number;
    const onMouseMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const animCursor = () => {
      if (cursor) cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      if (ring) ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      rafId = requestAnimationFrame(animCursor);
    };
    window.addEventListener('mousemove', onMouseMove);
    animCursor();
    return () => { window.removeEventListener('mousemove', onMouseMove); cancelAnimationFrame(rafId); };
  }, []);

  // Skill Bar Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll('.skill-bar-fill').forEach((b) => {
              (b as HTMLElement).style.animationPlayState = 'running';
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll('.skill-group').forEach((g) => observer.observe(g));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#050709]/80 backdrop-blur-md border-b border-[#1e2535]">
        <div className="max-w-[1400px] mx-auto px-[5%] py-4 flex justify-between items-center">
          <a href="#" className="font-mono text-[#00e5ff] font-bold tracking-widest text-lg uppercase italic">TT.</a>
          <div className="flex gap-6 text-xs md:text-sm font-mono text-[#5a6478] uppercase tracking-widest">
            <a href="#projects" className="hover:text-[#00e5ff] transition-colors">01. Projects</a>
            <a href="#experience" className="hover:text-[#00e5ff] transition-colors">02. Logs</a>
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
      <section className="min-h-[75vh] flex flex-col justify-center px-[5%] max-w-[1400px] mx-auto relative pt-28 pb-12">
        <div className="text-[0.85rem] font-mono text-[#00e5ff] uppercase tracking-[3px] mb-6 italic">Irving, TX // Status: Online</div>
        <h1 className="text-[clamp(3rem,8vw,6rem)] leading-[1.1] font-bold title-font mb-6 tracking-tight text-white uppercase italic">
          TANAY<br />TAMMINENI.
        </h1>
        <p className="text-xl md:text-2xl text-[#5a6478] max-w-[800px] mb-12 font-light leading-relaxed italic">
          <strong className="text-white font-medium italic">MS CS · 3.9 GPA · Published Researcher · AI Systems Developer Intern @ Automate365</strong><br />
          Bridging real-time deep learning performance with cryptographic system integrity.
        </p>
        <div className="flex gap-4 flex-wrap relative z-50">
          <a href="#projects" className="btn primary">Deployments</a>
          <a href="https://drive.google.com/file/d/1Mq-bdqzuT-_7E4vBPVMMoEFHzBV0Fxf6/view" target="_blank" className="btn">Execute Resume</a>
          <a href="https://github.com/TammineniTanay" target="_blank" className="btn">GitHub ↗</a>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-[#1e2535] bg-[#0c0f14]/80 backdrop-blur-md relative z-20">
        <div className="max-w-[1400px] mx-auto px-[5%] py-8 flex flex-row justify-between items-center font-mono uppercase tracking-widest">
          <div className="flex flex-col"><span className="text-[#00e5ff] text-xs mb-1">MS GPA</span><strong className="text-2xl text-white">3.9</strong></div>
          <div className="flex flex-col"><span className="text-[#7c3aed] text-xs mb-1">Research</span><strong className="text-2xl text-white">Peer-Reviewed</strong></div>
          <div className="flex flex-col"><span className="text-[#00ff94] text-xs mb-1">Projects</span><strong className="text-2xl text-white">19</strong></div>
          <div className="flex flex-col"><span className="text-[#f7a26a] text-xs mb-1">Experience</span><strong className="text-2xl text-white">1+ Years</strong></div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-container mt-20 mb-32 opacity-60">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="marquee-item"><span>//</span> Python</div>
              <div className="marquee-item"><span>//</span> LLMs</div>
              <div className="marquee-item"><span>//</span> RAG Pipelines</div>
              <div className="marquee-item"><span>//</span> Deep Learning</div>
              <div className="marquee-item"><span>//</span> Computer Vision</div>
              <div className="marquee-item"><span>//</span> Cryptography</div>
              <div className="marquee-item"><span>//</span> FastAPI</div>
              <div className="marquee-item"><span>//</span> Agentic AI</div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* PROJECTS */}
      <section id="projects" className="px-[5%] max-w-[1400px] mx-auto py-32 relative z-20">
        <h2 className="text-4xl title-font mb-8 text-white uppercase italic font-bold">
          <span className="text-[#00e5ff] font-mono text-lg mr-4 block mb-2">01.</span>
          Architectures &amp; Deployments
        </h2>

        {/* FILTER */}
        <div className="flex flex-wrap gap-2 mb-12">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 border transition-all"
              style={{
                borderColor: activeFilter === f ? 'var(--accent3)' : 'var(--border)',
                color: activeFilter === f ? 'var(--accent3)' : 'var(--muted)',
                background: activeFilter === f ? 'rgba(0,255,148,0.05)' : 'transparent',
              }}
            >
              {f} {f === 'All' ? `(${ALL_PROJECTS.length})` : `(${filterMap[f]?.length ?? 0})`}
            </button>
          ))}
        </div>

        {/* FLIP GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {visibleProjects.map(p => (
            <FlipCard
              key={p.id}
              year={p.year}
              title={p.title}
              bullets={p.bullets}
              tags={p.tags}
              link={p.link}
              badge={p.badge}
            />
          ))}
        </div>
      </section>

      {/* EXPERIENCE + SKILLS */}
      <section id="experience" className="px-[5%] max-w-[1400px] mx-auto py-32 grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-20">
        <div>
          <h2 className="text-4xl title-font mb-16 text-white uppercase italic font-bold">
            <span className="text-[#00e5ff] font-mono text-lg mr-4 block mb-2">02.</span>Background
          </h2>

          {/* Automate365 */}
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <span className="font-mono text-sm text-[#00e5ff]">Apr 2025 — Present</span>
            <h3 className="text-xl title-font text-white mt-2 font-bold">AI Systems Developer Intern @ Automate365</h3>
            <p className="text-sm text-[#e8eaf0]/70 mt-4 italic">Deploying real-time LLM pipelines, advanced RAG systems, and AI transcription infrastructure for enterprise clients.</p>
          </div>

          {/* Globalshala */}
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <span className="font-mono text-sm text-[#00e5ff]">Jun 2022 — Dec 2022</span>
            <h3 className="text-xl title-font text-white mt-2 font-bold">AI/ML Engineer Intern @ Globalshala</h3>
            <p className="text-sm text-[#e8eaf0]/70 mt-4 italic">Built ML models for text classification and computer vision pipelines achieving 87% accuracy.</p>
          </div>

          {/* SEMO */}
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <span className="font-mono text-sm text-[#00e5ff]">Jan 2024 — Dec 2025</span>
            <h3 className="text-xl title-font text-white mt-2 font-bold">MS, Computer Science @ Southeast Missouri State University</h3>
            <p className="text-sm text-[#e8eaf0]/70 mt-4 italic">3.9 GPA. Specialization in Advanced Artificial Intelligence and Distributed Systems.</p>
          </div>

          {/* CVR */}
          <div className="timeline-item">
            <div className="timeline-dot" style={{ boxShadow: 'none', background: 'var(--muted)' }}></div>
            <span className="font-mono text-sm text-[#00e5ff]">2019 — 2023</span>
            <h3 className="text-xl title-font text-white mt-2 font-bold">BE, Computer Science @ CVR College of Engineering</h3>
            <p className="text-sm text-[#e8eaf0]/70 mt-4 italic">Engineering foundation in Algorithms, Data Structures, and Database Management.</p>
          </div>

          {/* Publication */}
          <div className="mt-12 p-6 border border-[#1e2535] bg-[#0d1017]" style={{ borderLeft: '2px solid var(--accent2)' }}>
            <span className="font-mono text-xs text-[#7c3aed] uppercase tracking-widest block mb-2">Published Research</span>
            <h3 className="title-font text-white font-bold mb-2 leading-snug">Real-Time Video-Based Vehicle Detection, Counting &amp; Classification System</h3>
            <p className="text-sm text-[#5a6478] mb-4 italic">CVR Journal of Science &amp; Technology · Vol. 24 · June 2023 · Peer-Reviewed</p>
            <a
              href="https://www.researchgate.net/publication/372595973_Real_Time_Video_based_Vehicle_Detection_Counting_and_Classification_System"
              target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-[#7c3aed] hover:text-white transition-colors"
              style={{ borderBottom: '1px solid #7c3aed', paddingBottom: '2px' }}
            >
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
              ['Python / SQL / C', '95%'], ['LLMs / RAG / Agents', '92%'],
              ['ML (TF / Scikit / PyTorch)', '90%'], ['CV (OpenCV / YOLO)', '88%'],
              ['FastAPI / WebSockets', '85%'], ['Cloud (AWS / Azure)', '82%'],
              ['Cryptography', '80%'], ['React / Next.js', '78%'],
            ].map(([name, p]) => (
              <div key={name} className="skill-group">
                <div className="flex justify-between font-mono text-xs mb-2 uppercase tracking-widest italic font-bold">
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

      {/* CONTACT */}
      <footer id="contact" className="pt-20 pb-20 text-center relative overflow-hidden border-t border-[#1e2535]">
        <h2 className="text-[clamp(2rem,8vw,4rem)] title-font mb-8 text-white uppercase italic font-bold tracking-tighter">Let&apos;s_Build_Together</h2>
        <a href="mailto:tanaytammineni22@gmail.com" className="btn primary text-lg px-12 py-4 mb-20 relative z-50">
          tanaytammineni22@gmail.com
        </a>
        <div className="flex justify-center gap-10 font-mono text-sm text-[#5a6478] uppercase relative z-50 italic font-bold">
          <a href="https://www.linkedin.com/in/tanay-tammineni/" className="hover:text-[#00e5ff] transition-colors italic">LinkedIn</a>
          <a href="https://github.com/TammineniTanay" className="hover:text-[#00e5ff] transition-colors italic">GitHub</a>
        </div>
      </footer>
    </>
  );
}