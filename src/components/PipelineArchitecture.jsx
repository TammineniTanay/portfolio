import { useState, useEffect } from "react";

const STAGES = [
  {
    id: "scraping",
    label: "Data Scraping",
    icon: "🌐",
    group: "data",
    x: 60,
    y: 80,
    details: {
      title: "Multi-Source Scraping",
      tech: "asyncio, aiohttp, tenacity",
      points: [
        "ArXiv, GitHub, StackOverflow, HuggingFace",
        "Adaptive rate limiting (token bucket + 429 backoff)",
        "SQLite-backed resumability",
        "JSONL batch output",
      ],
      metrics: "~50K docs/hour",
    },
  },
  {
    id: "cleaning",
    label: "Data Cleaning",
    icon: "🧹",
    group: "data",
    x: 210,
    y: 80,
    details: {
      title: "Dedup + PII + Quality",
      tech: "MinHash LSH, regex, langdetect",
      points: [
        "MinHash LSH (128 perms, 32 bands) near-duplicate detection",
        "PII scrubbing: email, phone, SSN, IP, credit card",
        "Quality filter: length, repetition, language",
        "Boilerplate removal",
      ],
      metrics: "~85% retention rate",
    },
  },
  {
    id: "scoring",
    label: "LLM Judge",
    icon: "⚖️",
    group: "data",
    x: 360,
    y: 80,
    details: {
      title: "Multi-Dimensional Scoring",
      tech: "Claude / GPT-4 / local models",
      points: [
        "5 dimensions: relevance, quality, complexity, diversity, instruction-following",
        "SQLite score cache (avoid redundant API calls)",
        "Calibration vs human annotations (Cohen's κ)",
        "Async batched scoring with semaphore",
      ],
      metrics: "min score threshold: 0.7",
    },
  },
  {
    id: "assembly",
    label: "Dataset Assembly",
    icon: "📦",
    group: "data",
    x: 510,
    y: 80,
    details: {
      title: "Format + Pack + Split",
      tech: "HuggingFace datasets, Arrow",
      points: [
        "Chat templates: ChatML, Llama, Alpaca, Vicuna",
        "First-fit decreasing sequence packing",
        "Stratified train/val/test splits",
        "Arrow + Parquet output",
      ],
      metrics: "~5-8% packing waste",
    },
  },
  {
    id: "sft",
    label: "SFT Training",
    icon: "🏋️",
    group: "training",
    x: 110,
    y: 230,
    details: {
      title: "QLoRA Fine-Tuning",
      tech: "Transformers, TRL, PEFT, DeepSpeed",
      points: [
        "4-bit NF4 quantization + double quant",
        "LoRA r=64, α=128, dropout=0.05",
        "DeepSpeed ZeRO-3 / FSDP distributed",
        "Flash Attention 2, NEFTune noise",
        "Custom gradient monitoring callbacks",
      ],
      metrics: "8× A100 80GB",
    },
  },
  {
    id: "dpo",
    label: "DPO Alignment",
    icon: "🎯",
    group: "training",
    x: 310,
    y: 230,
    details: {
      title: "Direct Preference Optimization",
      tech: "TRL DPOTrainer",
      points: [
        "Preference pairs: chosen vs rejected",
        "β=0.1 KL penalty, lr=5e-7",
        "Smaller LoRA (r=16) — subtle adjustments",
        "No reward model needed",
      ],
      metrics: "1 epoch, reward acc >70%",
    },
  },
  {
    id: "merging",
    label: "Model Merging",
    icon: "🔀",
    group: "training",
    x: 510,
    y: 230,
    details: {
      title: "From-Scratch Merging",
      tech: "PyTorch, custom implementations",
      points: [
        "TIES: trim → elect sign → merge",
        "DARE: random drop + rescale",
        "SLERP: spherical interpolation",
        "Linear: weighted task vectors",
      ],
      metrics: "4 merge methods",
    },
  },
  {
    id: "eval",
    label: "Evaluation",
    icon: "📊",
    group: "eval",
    x: 60,
    y: 380,
    details: {
      title: "Multi-Benchmark Harness",
      tech: "lm-evaluation-harness, custom",
      points: [
        "MC benchmarks (log-likelihood scoring)",
        "Generation: ROUGE-L, BERTScore, LLM-as-judge",
        "MMLU, HellaSwag, TruthfulQA, GSM8K, HumanEval",
        "Paired bootstrap + McNemar significance tests",
      ],
      metrics: "9 benchmarks × 5 models",
    },
  },
  {
    id: "contamination",
    label: "Contamination Check",
    icon: "🔍",
    group: "eval",
    x: 260,
    y: 380,
    details: {
      title: "Benchmark Leakage Detection",
      tech: "13-gram overlap, SHA256",
      points: [
        "N-gram overlap against all eval benchmarks",
        "Exact match via content hashing",
        "Containment similarity scoring",
        "Per-benchmark contamination report",
      ],
      metrics: "threshold: 80% overlap",
    },
  },
  {
    id: "serving",
    label: "vLLM Serving",
    icon: "🚀",
    group: "deploy",
    x: 460,
    y: 380,
    details: {
      title: "Production Inference",
      tech: "vLLM, FastAPI, AWQ",
      points: [
        "Tensor parallel (TP=2)",
        "AWQ/GPTQ 4-bit quantization",
        "Prefix caching + chunked prefill",
        "FastAPI wrapper with Prometheus metrics",
        "Locust load testing",
      ],
      metrics: "p99 < 2s latency",
    },
  },
  {
    id: "infra",
    label: "Infrastructure",
    icon: "☁️",
    group: "deploy",
    x: 260,
    y: 500,
    details: {
      title: "Cloud + Monitoring",
      tech: "Docker, Terraform, AWS, Prometheus",
      points: [
        "Multi-stage Docker builds",
        "Terraform: VPC, S3, spot fleets, ASG",
        "Spot interruption handler → emergency checkpoint",
        "Prometheus + Grafana dashboards",
        "GitHub Actions CI/CD",
      ],
      metrics: "p4d.24xlarge spot",
    },
  },
];

const CONNECTIONS = [
  ["scraping", "cleaning"],
  ["cleaning", "scoring"],
  ["scoring", "assembly"],
  ["assembly", "sft"],
  ["sft", "dpo"],
  ["dpo", "merging"],
  ["merging", "eval"],
  ["merging", "contamination"],
  ["merging", "serving"],
  ["eval", "infra"],
  ["serving", "infra"],
  ["contamination", "infra"],
];

const GROUP_COLORS = {
  data: { bg: "#0f2b1a", border: "#22c55e", text: "#4ade80", glow: "rgba(34,197,94,0.15)" },
  training: { bg: "#1a1a2e", border: "#6366f1", text: "#a5b4fc", glow: "rgba(99,102,241,0.15)" },
  eval: { bg: "#2a1a0e", border: "#f59e0b", text: "#fcd34d", glow: "rgba(245,158,11,0.15)" },
  deploy: { bg: "#1a0e2a", border: "#ec4899", text: "#f9a8d4", glow: "rgba(236,72,153,0.15)" },
};

const GROUP_LABELS = {
  data: "Data Curation",
  training: "Training & Merging",
  eval: "Evaluation",
  deploy: "Deployment",
};

const SCALE = 0.97;
const W = 660;
const H = 580;
const NODE_W = 130;
const NODE_H = 54;

function getCenter(s) {
  return { cx: s.x + NODE_W / 2, cy: s.y + NODE_H / 2 };
}

function PipelineSVG({ active, setActive, animStep }) {
  const stageMap = Object.fromEntries(STAGES.map((s) => [s.id, s]));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 700 }}>
      <defs>
        {Object.entries(GROUP_COLORS).map(([k, v]) => (
          <filter key={k} id={`glow-${k}`}>
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={v.border} floodOpacity="0.3" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
        <marker id="arrow" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
        </marker>
      </defs>

      {/* connections */}
      {CONNECTIONS.map(([from, to], i) => {
        const a = getCenter(stageMap[from]);
        const b = getCenter(stageMap[to]);
        const isActive = active === from || active === to;
        const animDelay = i * 0.12;
        return (
          <line
            key={`${from}-${to}`}
            x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
            stroke={isActive ? "#fff" : "#333"}
            strokeWidth={isActive ? 2 : 1}
            strokeDasharray={isActive ? "none" : "4 4"}
            markerEnd="url(#arrow)"
            style={{
              opacity: animStep > i ? 1 : 0,
              transition: "opacity 0.4s, stroke 0.3s",
              transitionDelay: `${animDelay}s`,
            }}
          />
        );
      })}

      {/* nodes */}
      {STAGES.map((s, i) => {
        const c = GROUP_COLORS[s.group];
        const isActive = active === s.id;
        return (
          <g
            key={s.id}
            onClick={() => setActive(isActive ? null : s.id)}
            style={{
              cursor: "pointer",
              opacity: animStep > 0 ? 1 : 0,
              transform: animStep > 0 ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 0.5s ${i * 0.06}s, transform 0.5s ${i * 0.06}s`,
            }}
          >
            <rect
              x={s.x} y={s.y} width={NODE_W} height={NODE_H} rx={10}
              fill={isActive ? c.border + "22" : c.bg}
              stroke={isActive ? c.border : c.border + "66"}
              strokeWidth={isActive ? 2.5 : 1.2}
              filter={isActive ? `url(#glow-${s.group})` : undefined}
            />
            <text
              x={s.x + NODE_W / 2} y={s.y + 22}
              textAnchor="middle" fontSize="15"
              fill={isActive ? "#fff" : "#ccc"}
            >
              {s.icon}
            </text>
            <text
              x={s.x + NODE_W / 2} y={s.y + 42}
              textAnchor="middle" fontSize="10"
              fill={isActive ? c.text : "#999"}
              fontWeight={isActive ? 700 : 400}
              fontFamily="'JetBrains Mono', monospace"
            >
              {s.label}
            </text>
          </g>
        );
      })}

      {/* group labels */}
      {[
        { group: "data", x: 10, y: 62 },
        { group: "training", x: 10, y: 212 },
        { group: "eval", x: 10, y: 362 },
        { group: "deploy", x: 200, y: 488 },
      ].map(({ group, x, y }) => (
        <text
          key={group} x={x} y={y}
          fontSize="9" fill={GROUP_COLORS[group].border + "99"}
          fontFamily="'JetBrains Mono', monospace"
          textTransform="uppercase"
          letterSpacing="1.5"
        >
          {GROUP_LABELS[group].toUpperCase()}
        </text>
      ))}
    </svg>
  );
}

function DetailPanel({ stage }) {
  if (!stage) return null;
  const s = STAGES.find((s) => s.id === stage);
  if (!s) return null;
  const c = GROUP_COLORS[s.group];

  return (
    <div
      style={{
        background: "#0a0a0a",
        border: `1px solid ${c.border}44`,
        borderRadius: 12,
        padding: "20px 24px",
        marginTop: 16,
        animation: "fadeSlideUp 0.3s ease-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>{s.icon}</span>
        <div>
          <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
            {s.details.title}
          </div>
          <div style={{ color: c.text, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
            {s.details.tech}
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            background: c.border + "22",
            border: `1px solid ${c.border}44`,
            borderRadius: 6,
            padding: "4px 10px",
            fontSize: 11,
            color: c.text,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {s.details.metrics}
        </div>
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        {s.details.points.map((p, i) => (
          <div
            key={i}
            style={{
              color: "#aaa",
              fontSize: 12.5,
              lineHeight: 1.5,
              paddingLeft: 14,
              position: "relative",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <span style={{ position: "absolute", left: 0, color: c.border }}>›</span>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stats() {
  const stats = [
    { label: "Files", value: "66" },
    { label: "Python LoC", value: "11K+" },
    { label: "Pipeline Stages", value: "11" },
    { label: "Merge Methods", value: "4" },
    { label: "Benchmarks", value: "9" },
    { label: "Tests Passing", value: "11/11" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 8,
        marginTop: 20,
      }}
    >
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            textAlign: "center",
            padding: "10px 4px",
            background: "#0a0a0a",
            borderRadius: 8,
            border: "1px solid #1a1a1a",
          }}
        >
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>
            {s.value}
          </div>
          <div style={{ color: "#666", fontSize: 9, marginTop: 2, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DistributedPipelineViz() {
  const [active, setActive] = useState(null);
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimStep(20), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        background: "#050505",
        color: "#e0e0e0",
        minHeight: "100vh",
        padding: "32px 24px",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* header */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
            Project Architecture
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.3 }}>
            Distributed LLM Fine-Tuning Pipeline
          </h1>
          <p style={{ fontSize: 12, color: "#666", margin: "6px 0 0", lineHeight: 1.5 }}>
            End-to-end: data curation → QLoRA + DPO → TIES/DARE/SLERP merging → eval → vLLM deployment
          </p>
        </div>

        <Stats />

        {/* diagram */}
        <div style={{ marginTop: 20, position: "relative" }}>
          <PipelineSVG active={active} setActive={setActive} animStep={animStep} />
          <div style={{ textAlign: "center", marginTop: -4 }}>
            <span style={{ fontSize: 10, color: "#444" }}>click any stage for details</span>
          </div>
        </div>

        <DetailPanel stage={active} />

        {/* links */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "center" }}>
          <a
            href="https://github.com/TammineniTanay/distributed-finetune-pipeline"
            target="_blank"
            rel="noopener"
            style={{
              color: "#fff",
              background: "#161616",
              border: "1px solid #2a2a2a",
              borderRadius: 8,
              padding: "8px 20px",
              fontSize: 12,
              textDecoration: "none",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "border-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.borderColor = "#555")}
            onMouseOut={(e) => (e.target.style.borderColor = "#2a2a2a")}
          >
            GitHub Repository →
          </a>
          <a
            href="https://colab.research.google.com/"
            target="_blank"
            rel="noopener"
            style={{
              color: "#fcd34d",
              background: "#1a1508",
              border: "1px solid #f59e0b33",
              borderRadius: 8,
              padding: "8px 20px",
              fontSize: 12,
              textDecoration: "none",
              fontFamily: "'JetBrains Mono', monospace",
              transition: "border-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.borderColor = "#f59e0b")}
            onMouseOut={(e) => (e.target.style.borderColor = "#f59e0b33")}
          >
            Run on Colab →
          </a>
        </div>
      </div>
    </div>
  );
}
