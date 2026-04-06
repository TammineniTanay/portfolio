"use client";

import { useState, useEffect } from "react";

// --- Stage data ---
const STAGES = [
  { id: "scraping", label: "Data Scraping", icon: "🌐", group: "data", x: 60, y: 80,
    details: { title: "Multi-Source Scraping", tech: "asyncio, aiohttp, tenacity",
      points: ["ArXiv, GitHub, StackOverflow, HuggingFace", "Adaptive rate limiting (token bucket + 429 backoff)", "SQLite-backed resumability", "JSONL batch output"], metrics: "~50K docs/hr" }},
  { id: "cleaning", label: "Data Cleaning", icon: "🧹", group: "data", x: 210, y: 80,
    details: { title: "Dedup + PII + Quality", tech: "MinHash LSH, regex, langdetect",
      points: ["MinHash LSH (128 perms, 32 bands) near-duplicate detection", "PII scrubbing: email, phone, SSN, IP, credit card", "Quality filter: length, repetition, language", "Boilerplate removal"], metrics: "~85% retention" }},
  { id: "scoring", label: "LLM Judge", icon: "⚖️", group: "data", x: 360, y: 80,
    details: { title: "Multi-Dimensional Scoring", tech: "Claude / GPT-4 / local",
      points: ["5 dimensions: relevance, quality, complexity, diversity, instruction-following", "SQLite score cache", "Calibration vs human annotations (Cohen's κ)", "Async batched scoring"], metrics: "threshold: 0.7" }},
  { id: "assembly", label: "Dataset Assembly", icon: "📦", group: "data", x: 510, y: 80,
    details: { title: "Format + Pack + Split", tech: "HuggingFace datasets, Arrow",
      points: ["Chat templates: ChatML, Llama, Alpaca, Vicuna", "First-fit decreasing sequence packing", "Stratified train/val/test splits", "Arrow + Parquet output"], metrics: "~5-8% waste" }},
  { id: "sft", label: "SFT Training", icon: "🏋️", group: "training", x: 110, y: 230,
    details: { title: "QLoRA Fine-Tuning", tech: "Transformers, TRL, PEFT, DeepSpeed",
      points: ["4-bit NF4 quantization + double quant", "LoRA r=64, α=128, dropout=0.05", "DeepSpeed ZeRO-3 / FSDP distributed", "Flash Attention 2, NEFTune noise", "Custom gradient monitoring callbacks"], metrics: "8× A100 80GB" }},
  { id: "dpo", label: "DPO Alignment", icon: "🎯", group: "training", x: 310, y: 230,
    details: { title: "Direct Preference Optimization", tech: "TRL DPOTrainer",
      points: ["Preference pairs: chosen vs rejected", "β=0.1 KL penalty, lr=5e-7", "Smaller LoRA (r=16) — subtle adjustments", "No reward model needed"], metrics: "reward acc >70%" }},
  { id: "merging", label: "Model Merging", icon: "🔀", group: "training", x: 510, y: 230,
    details: { title: "From-Scratch Merging", tech: "PyTorch, custom implementations",
      points: ["TIES: trim → elect sign → merge", "DARE: random drop + rescale", "SLERP: spherical interpolation", "Linear: weighted task vectors"], metrics: "4 methods" }},
  { id: "eval", label: "Evaluation", icon: "📊", group: "eval", x: 60, y: 380,
    details: { title: "Multi-Benchmark Harness", tech: "lm-evaluation-harness, custom",
      points: ["MC benchmarks (log-likelihood scoring)", "Generation: ROUGE-L, BERTScore, LLM-as-judge", "MMLU, HellaSwag, TruthfulQA, GSM8K, HumanEval", "Paired bootstrap + McNemar significance tests"], metrics: "9 benchmarks" }},
  { id: "contamination", label: "Contamination", icon: "🔍", group: "eval", x: 260, y: 380,
    details: { title: "Benchmark Leakage Detection", tech: "13-gram overlap, SHA256",
      points: ["N-gram overlap against all eval benchmarks", "Exact match via content hashing", "Containment similarity scoring", "Per-benchmark contamination report"], metrics: "80% threshold" }},
  { id: "serving", label: "vLLM Serving", icon: "🚀", group: "deploy", x: 460, y: 380,
    details: { title: "Production Inference", tech: "vLLM, FastAPI, AWQ",
      points: ["Tensor parallel (TP=2)", "AWQ/GPTQ 4-bit quantization", "Prefix caching + chunked prefill", "FastAPI wrapper with Prometheus metrics", "Locust load testing"], metrics: "p99 < 2s" }},
  { id: "infra", label: "Infrastructure", icon: "☁️", group: "deploy", x: 260, y: 500,
    details: { title: "Cloud + Monitoring", tech: "Docker, Terraform, AWS, Prometheus",
      points: ["Multi-stage Docker builds", "Terraform: VPC, S3, spot fleets, ASG", "Spot interruption handler → emergency checkpoint", "Prometheus + Grafana dashboards", "GitHub Actions CI/CD"], metrics: "p4d.24xlarge" }},
];

const CONNECTIONS = [
  ["scraping", "cleaning"], ["cleaning", "scoring"], ["scoring", "assembly"], ["assembly", "sft"],
  ["sft", "dpo"], ["dpo", "merging"], ["merging", "eval"], ["merging", "contamination"],
  ["merging", "serving"], ["eval", "infra"], ["serving", "infra"], ["contamination", "infra"],
];

const GROUP_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  data: { bg: "#0f2b1a", border: "#22c55e", text: "#4ade80" },
  training: { bg: "#1a1a2e", border: "#6366f1", text: "#a5b4fc" },
  eval: { bg: "#2a1a0e", border: "#f59e0b", text: "#fcd34d" },
  deploy: { bg: "#1a0e2a", border: "#ec4899", text: "#f9a8d4" },
};

const GROUP_LABELS: Record<string, string> = { data: "DATA CURATION", training: "TRAINING & MERGING", eval: "EVALUATION", deploy: "DEPLOYMENT" };

const W = 660, H = 580, NW = 130, NH = 54;

// --- Training results (real numbers from Colab T4 run) ---
const TRAINING_LOG = [
  { step: 5, loss: 1.332 }, { step: 10, loss: 1.299 }, { step: 15, loss: 1.197 },
  { step: 20, loss: 1.212 }, { step: 25, loss: 1.134 }, { step: 30, loss: 1.228 },
  { step: 40, loss: 1.219 }, { step: 50, loss: 1.172 }, { step: 60, loss: 1.148 },
  { step: 70, loss: 1.113 }, { step: 80, loss: 1.098 }, { step: 90, loss: 1.074 },
  { step: 100, loss: 1.056 }, { step: 110, loss: 1.089 }, { step: 120, loss: 1.042 },
  { step: 130, loss: 1.067 }, { step: 140, loss: 1.032 }, { step: 150, loss: 1.018 },
  { step: 165, loss: 1.001 }, { step: 175, loss: 0.986 }, { step: 180, loss: 0.970 },
  { step: 190, loss: 0.966 }, { step: 200, loss: 0.972 }, { step: 210, loss: 1.023 },
  { step: 220, loss: 1.035 }, { step: 230, loss: 0.991 }, { step: 240, loss: 1.012 },
  { step: 250, loss: 1.003 },
];

const RESULTS = {
  finalLoss: 1.003,
  startLoss: 1.332,
  reduction: "24.7%",
  evalLoss: 1.127,
  perplexity: 3.09,
  gpu: "Tesla T4 (15.6 GB)",
  trainableParams: "25.2M / 1.13B (2.24%)",
  trainingTime: "~80 min",
  throughput: "0.42 samples/s",
};

// --- Components ---

function PipelineSVG({ active, setActive, animStep }: { active: string | null; setActive: (s: string | null) => void; animStep: number }) {
  const stageMap = Object.fromEntries(STAGES.map((s) => [s.id, s]));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 700 }}>
      <defs>
        {Object.entries(GROUP_COLORS).map(([k, v]) => (
          <filter key={k} id={`glow-${k}`}><feGaussianBlur stdDeviation="6" result="blur" /><feFlood floodColor={v.border} floodOpacity="0.3" /><feComposite in2="blur" operator="in" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        ))}
        <marker id="arrow" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#555" /></marker>
      </defs>
      {CONNECTIONS.map(([from, to], i) => {
        const a = stageMap[from], b = stageMap[to];
        const ax = a.x + NW / 2, ay = a.y + NH / 2, bx = b.x + NW / 2, by = b.y + NH / 2;
        const isActive = active === from || active === to;
        return <line key={`${from}-${to}`} x1={ax} y1={ay} x2={bx} y2={by} stroke={isActive ? "#fff" : "#333"} strokeWidth={isActive ? 2 : 1} strokeDasharray={isActive ? "none" : "4 4"} markerEnd="url(#arrow)" style={{ opacity: animStep > i ? 1 : 0, transition: "opacity 0.4s, stroke 0.3s", transitionDelay: `${i * 0.12}s` }} />;
      })}
      {STAGES.map((s, i) => {
        const c = GROUP_COLORS[s.group]; const isActive = active === s.id;
        return (
          <g key={s.id} onClick={() => setActive(isActive ? null : s.id)} style={{ cursor: "pointer", opacity: animStep > 0 ? 1 : 0, transition: `opacity 0.5s ${i * 0.06}s, transform 0.5s ${i * 0.06}s` }}>
            <rect x={s.x} y={s.y} width={NW} height={NH} rx={10} fill={isActive ? c.border + "22" : c.bg} stroke={isActive ? c.border : c.border + "66"} strokeWidth={isActive ? 2.5 : 1.2} filter={isActive ? `url(#glow-${s.group})` : undefined} />
            <text x={s.x + NW / 2} y={s.y + 22} textAnchor="middle" fontSize="15" fill={isActive ? "#fff" : "#ccc"}>{s.icon}</text>
            <text x={s.x + NW / 2} y={s.y + 42} textAnchor="middle" fontSize="10" fill={isActive ? c.text : "#999"} fontWeight={isActive ? 700 : 400} fontFamily="'SF Mono', 'Fira Code', monospace">{s.label}</text>
          </g>
        );
      })}
      {[{ g: "data", x: 10, y: 62 }, { g: "training", x: 10, y: 212 }, { g: "eval", x: 10, y: 362 }, { g: "deploy", x: 200, y: 488 }].map(({ g, x, y }) => (
        <text key={g} x={x} y={y} fontSize="9" fill={GROUP_COLORS[g].border + "99"} fontFamily="'SF Mono', monospace" letterSpacing="1.5">{GROUP_LABELS[g]}</text>
      ))}
    </svg>
  );
}

function DetailPanel({ stage }: { stage: string | null }) {
  if (!stage) return null;
  const s = STAGES.find((s) => s.id === stage);
  if (!s) return null;
  const c = GROUP_COLORS[s.group];
  return (
    <div style={{ background: "#111110", border: `1px solid ${c.border}44`, borderRadius: 10, padding: "16px 20px", marginTop: 12, animation: "fadeUp 0.3s ease-out" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 20 }}>{s.icon}</span>
        <div>
          <div style={{ color: "#eee", fontSize: 15, fontWeight: 700, fontFamily: "'SF Mono', monospace" }}>{s.details.title}</div>
          <div style={{ color: c.text, fontSize: 11, fontFamily: "'SF Mono', monospace", marginTop: 2 }}>{s.details.tech}</div>
        </div>
        <div style={{ marginLeft: "auto", background: c.border + "22", border: `1px solid ${c.border}44`, borderRadius: 6, padding: "3px 10px", fontSize: 11, color: c.text, fontFamily: "'SF Mono', monospace" }}>{s.details.metrics}</div>
      </div>
      {s.details.points.map((p, i) => (
        <div key={i} style={{ color: "#999", fontSize: 12, lineHeight: 1.6, paddingLeft: 14, position: "relative", fontFamily: "'SF Mono', monospace" }}>
          <span style={{ position: "absolute", left: 0, color: c.border }}>›</span>{p}
        </div>
      ))}
    </div>
  );
}

function LossChart() {
  const maxLoss = Math.max(...TRAINING_LOG.map((d) => d.loss));
  const minLoss = Math.min(...TRAINING_LOG.map((d) => d.loss));
  const maxStep = Math.max(...TRAINING_LOG.map((d) => d.step));
  const pad = 40;
  const w = 600, h = 200;

  const toX = (step: number) => pad + ((step / maxStep) * (w - pad * 2));
  const toY = (loss: number) => pad + ((maxLoss - loss) / (maxLoss - minLoss + 0.05)) * (h - pad * 2);

  // EMA
  const ema: number[] = [TRAINING_LOG[0].loss];
  for (let i = 1; i < TRAINING_LOG.length; i++) {
    ema.push(0.15 * TRAINING_LOG[i].loss + 0.85 * ema[i - 1]);
  }

  const rawPath = TRAINING_LOG.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(d.step).toFixed(1)} ${toY(d.loss).toFixed(1)}`).join(" ");
  const emaPath = TRAINING_LOG.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(d.step).toFixed(1)} ${toY(ema[i]).toFixed(1)}`).join(" ");

  return (
    <div style={{ background: "#111110", border: "1px solid #2a2a28", borderRadius: 10, padding: 16, marginTop: 16 }}>
      <div style={{ fontSize: 13, color: "#ccc", fontWeight: 600, marginBottom: 8, fontFamily: "'SF Mono', monospace" }}>Training Loss — TinyLlama 1.1B QLoRA</div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxWidth: 600 }}>
        {/* grid */}
        {[0.95, 1.0, 1.1, 1.2, 1.3].map((v) => (
          <g key={v}>
            <line x1={pad} y1={toY(v)} x2={w - pad} y2={toY(v)} stroke="#1a1a18" strokeWidth={1} />
            <text x={pad - 4} y={toY(v) + 3} textAnchor="end" fontSize="9" fill="#555" fontFamily="monospace">{v.toFixed(1)}</text>
          </g>
        ))}
        {[0, 50, 100, 150, 200, 250].map((s) => (
          <text key={s} x={toX(s)} y={h - 8} textAnchor="middle" fontSize="9" fill="#555" fontFamily="monospace">{s}</text>
        ))}
        {/* raw */}
        <path d={rawPath} fill="none" stroke="#6366f1" strokeWidth={1} opacity={0.3} />
        {/* ema */}
        <path d={emaPath} fill="none" stroke="#6366f1" strokeWidth={2.5} />
        {/* dots */}
        {TRAINING_LOG.map((d, i) => (
          <circle key={i} cx={toX(d.step)} cy={toY(d.loss)} r={2} fill="#6366f1" opacity={0.4} />
        ))}
        <text x={w - pad} y={pad - 8} textAnchor="end" fontSize="9" fill="#666" fontFamily="monospace">steps →</text>
      </svg>
      <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: "#666", fontFamily: "'SF Mono', monospace" }}>
        <span>Start: <span style={{ color: "#f87171" }}>1.332</span></span>
        <span>Final: <span style={{ color: "#4ade80" }}>1.003</span></span>
        <span>Reduction: <span style={{ color: "#fcd34d" }}>24.7%</span></span>
      </div>
    </div>
  );
}

function ResultsTab() {
  const metrics = [
    { label: "Final Train Loss", value: RESULTS.finalLoss.toFixed(3), color: "#4ade80" },
    { label: "Eval Loss", value: RESULTS.evalLoss.toFixed(3), color: "#a5b4fc" },
    { label: "Loss Reduction", value: RESULTS.reduction, color: "#fcd34d" },
    { label: "GPU Memory", value: RESULTS.gpu, color: "#f9a8d4" },
    { label: "Trainable Params", value: RESULTS.trainableParams, color: "#93c5fd" },
    { label: "Training Time", value: RESULTS.trainingTime, color: "#c4b5fd" },
  ];

  return (
    <div style={{ padding: 20, overflowY: "auto", height: "100%" }}>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 12, fontFamily: "'SF Mono', monospace" }}>
        Real results from Google Colab (T4 GPU, 2K examples, 2 epochs)
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: "#111110", border: "1px solid #2a2a28", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "'SF Mono', monospace" }}>{m.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: m.color, marginTop: 4, fontFamily: "'SF Mono', monospace" }}>{m.value}</div>
          </div>
        ))}
      </div>
      <LossChart />
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 13, color: "#ccc", fontWeight: 600, marginBottom: 8, fontFamily: "'SF Mono', monospace" }}>Inference Samples</div>
        {[
          { prompt: "Explain the difference between supervised and unsupervised learning.", response: "Supervised and unsupervised learning are two different types of machine learning. In supervised learning, the machine learns from data by using labeled examples. In unsupervised learning, the model finds patterns in data without explicit labels..." },
          { prompt: "Write a Python function to compute the Fibonacci sequence.", response: "def fibonacci(n: int) -> list:\n    if n == 0: return [0, 1]\n    elif n == 1: return [0, 1]\n    else: return fibonacci(n - 1) + fibonacci(n - 2)" },
          { prompt: "What is the attention mechanism in transformers?", response: "The attention mechanism is a crucial component of the transformer architecture. It works by assigning a weight to each word based on its relationship to the previous words in the sequence..." },
        ].map((ex, i) => (
          <div key={i} style={{ background: "#111110", border: "1px solid #2a2a28", borderRadius: 8, padding: "12px 14px", marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "#f59e0b", fontFamily: "'SF Mono', monospace", marginBottom: 6 }}>→ {ex.prompt}</div>
            <div style={{ fontSize: 11, color: "#999", fontFamily: "'SF Mono', monospace", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{ex.response}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchitectureTab() {
  const [active, setActive] = useState<string | null>(null);
  const [animStep, setAnimStep] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimStep(20), 200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ padding: 20, overflowY: "auto", height: "100%" }}>
      <PipelineSVG active={active} setActive={setActive} animStep={animStep} />
      <div style={{ textAlign: "center", marginTop: -4 }}>
        <span style={{ fontSize: 10, color: "#444" }}>click any stage for details</span>
      </div>
      <DetailPanel stage={active} />
    </div>
  );
}

// --- Main Page ---

export default function DistributedPipelineDemo() {
  const [tab, setTab] = useState<"arch" | "results">("arch");
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a09", color: "#ccc", fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace" }}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } } * { box-sizing: border-box; }`}</style>
      {/* Nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid #2a2a28" }}>
        <a href="/" style={{ color: "#7F77DD", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>TT.</a>
        <span style={{ color: "#333" }}>/</span>
        <span style={{ fontSize: 13, color: "#888" }}>projects</span>
        <span style={{ color: "#333" }}>/</span>
        <span style={{ fontSize: 13, color: "#ccc", fontWeight: 600 }}>distributed-finetune-pipeline</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {(["arch", "results"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "5px 14px", borderRadius: 6, border: "1px solid", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                background: tab === t ? "#1a1a3a" : "transparent", color: tab === t ? "#AFA9EC" : "#666", borderColor: tab === t ? "#534AB7" : "#2a2a28" }}>
              {t === "arch" ? "Architecture" : "Results"}
            </button>
          ))}
        </div>
        <a href="https://github.com/TammineniTanay/distributed-finetune-pipeline" target="_blank" rel="noopener"
          style={{ fontSize: 12, color: "#666", textDecoration: "none", marginLeft: 8 }}>GitHub ↗</a>
        <a href="https://colab.research.google.com/github/TammineniTanay/distributed-finetune-pipeline/blob/main/Distributed_LLM_Pipeline_Demo.ipynb" target="_blank" rel="noopener"
          style={{ fontSize: 12, color: "#f59e0b", textDecoration: "none", marginLeft: 4 }}>Colab ↗</a>
      </div>
      {/* Header */}
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #2a2a28" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#eee", margin: "0 0 6px" }}>
          Distributed LLM Fine-Tuning Pipeline <span style={{ fontSize: 12, fontWeight: 400, color: "#534AB7", marginLeft: 8 }}>v1.0.0</span>
        </h1>
        <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
          Data curation → QLoRA + DPO training → TIES/DARE/SLERP merging → Evaluation → vLLM deployment
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {["Python", "PyTorch", "DeepSpeed", "TRL/PEFT", "vLLM", "Docker", "Terraform", "Prometheus"].map((t) => (
            <span key={t} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, border: "1px solid #2a2a28", color: "#666" }}>{t}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          {[{ label: "Files", value: "66" }, { label: "LoC", value: "11K+" }, { label: "Stages", value: "11" }, { label: "Tests", value: "11/11" }].map((s, i) => (
            <div key={i} style={{ fontSize: 11, fontFamily: "'SF Mono', monospace" }}>
              <span style={{ color: "#fff", fontWeight: 700 }}>{s.value}</span> <span style={{ color: "#555" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Content */}
      <div style={{ height: "calc(100vh - 170px)" }}>
        {tab === "arch" ? <ArchitectureTab /> : <ResultsTab />}
      </div>
    </div>
  );
}