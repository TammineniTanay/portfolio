"use client";

import { useState, useEffect, useRef } from "react";

// ── Simulated query data ─────────────────────────────────────
const QUERIES = [
  {
    q: "What evaluation metrics does the attention paper use?",
    time: 342,
    crag: null,
    answer:
      'The "Attention Is All You Need" paper primarily uses two evaluation metrics:\n\n1. BLEU score — measured on the WMT 2014 English-to-German (28.4 BLEU) and English-to-French (41.8 BLEU) translation tasks, achieving state-of-the-art results [Source 1, 3].\n\n2. Perplexity — used for English constituency parsing evaluation on the Penn Treebank dataset [Source 2].',
    sources: [
      { retriever: "dense", score: 0.9412, preview: "The Transformer achieves 28.4 BLEU on the WMT 2014 EN-DE translation task...", source: "attention_is_all_you_need.pdf" },
      { retriever: "graph", score: 0.8834, preview: "Paper: Attention Is All You Need → USES_METHOD → BLEU Score, Perplexity", source: "knowledge_graph" },
      { retriever: "sparse", score: 0.7621, preview: "...perplexity evaluation on Penn Treebank constituency parsing benchmarks...", source: "attention_is_all_you_need.pdf" },
    ],
  },
  {
    q: "Compare dropout rates across transformer variants",
    time: 1847,
    crag: "Query rewritten",
    answer:
      'After rewriting the query for better retrieval:\n\nThe original Transformer uses dropout of 0.1 on each sub-layer output and attention weights [Source 1]. BERT uses 0.1 across all layers. GPT-2 removed dropout during pre-training [Source 2]. ViT uses 0.1 in MLP heads only [Source 3].\n\nNote: CRAG detected initial retrieval was insufficient and rewrote the query from "dropout rates transformer variants" to "regularization dropout configuration BERT GPT ViT original transformer".',
    sources: [
      { retriever: "dense", score: 0.8765, preview: "Residual dropout: we apply dropout to the output of each sub-layer...", source: "attention_is_all_you_need.pdf" },
      { retriever: "sparse", score: 0.8123, preview: "BERT-base uses dropout probability of 0.1 on all fully connected layers...", source: "bert_paper.pdf" },
      { retriever: "web", score: 0.7456, preview: "[Web: ViT paper summary] Vision Transformer applies 0.1 dropout to MLP...", source: "tavily_web_search" },
    ],
  },
  {
    q: "What datasets did Vaswani et al. use for training?",
    time: 289,
    crag: null,
    answer:
      "Vaswani et al. used:\n\n1. WMT 2014 English-German — ~4.5M sentence pairs, byte-pair encoding, shared vocab of ~37K tokens [Source 1, 2].\n\n2. WMT 2014 English-French — ~36M sentence pairs, 32K word-piece vocabulary [Source 1].\n\n3. Penn Treebank WSJ — for constituency parsing generalization [Source 3].",
    sources: [
      { retriever: "graph", score: 0.9534, preview: "Paper: Attention Is All You Need → EVALUATED_ON → WMT 2014 EN-DE, EN-FR", source: "knowledge_graph" },
      { retriever: "dense", score: 0.9021, preview: "We trained on the standard WMT 2014 English-German dataset consisting of ~4.5M...", source: "attention_is_all_you_need.pdf" },
      { retriever: "sparse", score: 0.7234, preview: "...Penn Treebank WSJ portion for English constituency parsing evaluation...", source: "attention_is_all_you_need.pdf" },
    ],
  },
  {
    q: "How does multi-head attention differ from single-head?",
    time: 267,
    crag: null,
    answer:
      "Multi-head attention projects Q, K, V through h separate learned projections (h=8, d_k=64 each), allowing the model to attend to different representation subspaces simultaneously [Source 1].\n\nSingle-head attention uses the full d_model dimension in one pass, which averages away position-specific patterns. The computational cost is similar due to reduced per-head dimension [Source 2].",
    sources: [
      { retriever: "dense", score: 0.9678, preview: "Multi-head attention allows the model to jointly attend to information from different...", source: "attention_is_all_you_need.pdf" },
      { retriever: "sparse", score: 0.8432, preview: "We employ h=8 parallel attention layers, or heads. For each d_k = d_v = d_model/h = 64...", source: "attention_is_all_you_need.pdf" },
    ],
  },
  {
    q: "What is the latest pricing for Claude API?",
    time: 2134,
    crag: "Web fallback",
    answer:
      "This question is outside the indexed corpus. CRAG detected all retrieved chunks were irrelevant and triggered web search.\n\nBased on web results: Claude API pricing varies by model — Opus (most capable, higher cost), Sonnet (balanced), and Haiku (fastest, most affordable) [Source 1]. For current pricing, refer to Anthropic's official page.",
    sources: [
      { retriever: "web", score: 0.8912, preview: "[Web: Anthropic pricing] Claude API offers three model tiers...", source: "tavily_web_search" },
      { retriever: "web", score: 0.7654, preview: "[Web: Anthropic docs] Usage is billed per input and output token...", source: "tavily_web_search" },
    ],
  },
];

const RETRIEVER_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  dense: { bg: "#1a3a5c", text: "#85B7EB", label: "Semantic" },
  sparse: { bg: "#1a3319", text: "#97C459", label: "Keyword" },
  graph: { bg: "#2a2350", text: "#AFA9EC", label: "Graph" },
  web: { bg: "#3a2010", text: "#F0997B", label: "Web" },
};

const CRAG_STYLES: Record<string, { bg: string; text: string }> = {
  "Query rewritten": { bg: "#3a2f10", text: "#FAC775" },
  "Web fallback": { bg: "#3a2010", text: "#F0997B" },
};

// ── Eval data generation ─────────────────────────────────────
function genHistory() {
  const h = [];
  for (let i = 0; i < 30; i++) {
    const base = 0.7 + (i / 30) * 0.2;
    h.push({
      batch: i + 1,
      faithfulness: Math.min(0.98, +(base + Math.random() * 0.06).toFixed(3)),
      relevancy: Math.min(0.95, +(base - 0.04 + Math.random() * 0.06).toFixed(3)),
      precision: Math.min(0.92, +(base - 0.08 + Math.random() * 0.06).toFixed(3)),
    });
  }
  return h;
}

// ── Small components ─────────────────────────────────────────
function Badge({ type }: { type: string }) {
  const s = RETRIEVER_STYLES[type] || { bg: "#2a2a28", text: "#aaa", label: type };
  return (
    <span style={{ display: "inline-flex", padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: s.bg, color: s.text, letterSpacing: 0.3 }}>
      {s.label}
    </span>
  );
}

function CragBadge({ action }: { action: string | null }) {
  if (!action) return null;
  const s = CRAG_STYLES[action] || CRAG_STYLES["Query rewritten"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: s.bg, color: s.text }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
      CRAG: {action}
    </span>
  );
}

function Stars() {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [done, setDone] = useState(false);
  if (done) return <span style={{ fontSize: 11, color: "#5DCAA5", background: "#0a2a1a", padding: "3px 10px", borderRadius: 99 }}>Feedback saved</span>;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
      <span style={{ fontSize: 11, color: "#666" }}>Rate:</span>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} onClick={() => setSelected(n)} onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
          style={{ cursor: "pointer", fontSize: 16, color: n <= (hovered || selected) ? "#EF9F27" : "#444", transition: "color 0.15s" }}>&#9733;</span>
      ))}
      {selected > 0 && (
        <button onClick={() => setDone(true)} style={{ fontSize: 11, padding: "3px 12px", background: "#7F77DD", color: "#fff", border: "none", borderRadius: 99, cursor: "pointer" }}>
          Submit
        </button>
      )}
    </div>
  );
}

// ── Mini SVG line chart (no external deps) ──────────────────
function MiniLineChart({ data, keys, colors, height = 200 }: { data: any[]; keys: string[]; colors: string[]; height?: number }) {
  const w = 500;
  const pad = 40;
  const chartW = w - pad * 2;
  const chartH = height - 40;

  function toPath(key: string) {
    return data
      .map((d, i) => {
        const x = pad + (i / (data.length - 1)) * chartW;
        const y = 20 + (1 - d[key]) * chartH;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }

  const yTicks = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: "100%", height }}>
      {yTicks.map((t) => {
        const y = 20 + (1 - t) * chartH;
        return (
          <g key={t}>
            <line x1={pad} y1={y} x2={w - pad} y2={y} stroke="#333" strokeWidth="0.5" />
            <text x={pad - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#666">{(t * 100).toFixed(0)}%</text>
          </g>
        );
      })}
      {keys.map((key, ki) => (
        <path key={key} d={toPath(key)} fill="none" stroke={colors[ki]} strokeWidth="2" />
      ))}
    </svg>
  );
}

function MiniBarChart({ data, colors, height = 160 }: { data: { name: string; value: number }[]; colors: string[]; height?: number }) {
  const maxVal = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "8px 0" }}>
      {data.map((d, i) => (
        <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "#888", width: 80, textAlign: "right" }}>{d.name}</span>
          <div style={{ flex: 1, height: 20, background: "#1a1a18", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${(d.value / maxVal) * 100}%`, height: "100%", background: colors[i], borderRadius: 4, transition: "width 0.6s" }} />
          </div>
          <span style={{ fontSize: 11, color: "#888", width: 30 }}>{d.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Radar chart (pure SVG) ──────────────────────────────────
function RadarChart({ data, size = 220 }: { data: { label: string; value: number }[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 30;
  const n = data.length;
  const angles = data.map((_, i) => (Math.PI * 2 * i) / n - Math.PI / 2);

  function pointAt(angle: number, radius: number) {
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  }

  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const dataPoints = data.map((d, i) => pointAt(angles[i], d.value * r));
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size, margin: "0 auto", display: "block" }}>
      {gridLevels.map((level) => (
        <polygon key={level} points={angles.map((a) => { const p = pointAt(a, level * r); return `${p.x},${p.y}`; }).join(" ")}
          fill="none" stroke="#333" strokeWidth="0.5" />
      ))}
      {angles.map((a, i) => {
        const edge = pointAt(a, r);
        const labelPt = pointAt(a, r + 16);
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={edge.x} y2={edge.y} stroke="#333" strokeWidth="0.5" />
            <text x={labelPt.x} y={labelPt.y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#888">{data[i].label}</text>
          </g>
        );
      })}
      <polygon points={polygon} fill="rgba(127,119,221,0.15)" stroke="#7F77DD" strokeWidth="2" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#7F77DD" />
      ))}
    </svg>
  );
}

// ── Chat tab ─────────────────────────────────────────────────
function ChatTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoIdx, setDemoIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { type: "user", text: q }]);
    setLoading(true);
    const demo = QUERIES[demoIdx % QUERIES.length];
    setDemoIdx((p) => p + 1);
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", ...demo }]);
      setLoading(false);
    }, 500 + Math.random() * 500);
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: "1px solid #2a2a28" }}>
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: "#666", marginTop: 60 }}>
              <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>&#9670;</div>
              <p style={{ fontSize: 15, fontWeight: 500, color: "#aaa" }}>Hybrid RAG system</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Ask a question about ingested research papers</p>
              <p style={{ fontSize: 12, color: "#555", marginTop: 8 }}>Try: &quot;What evaluation metrics does the attention paper use?&quot;</p>
            </div>
          )}
          {messages.map((m: any, i: number) =>
            m.type === "user" ? (
              <div key={i} style={{ alignSelf: "flex-end", background: "#534AB7", color: "#fff", padding: "8px 14px", borderRadius: "14px 14px 4px 14px", fontSize: 13, maxWidth: "70%" }}>
                {m.text}
              </div>
            ) : (
              <div key={i} style={{ alignSelf: "flex-start", background: "#1a1a18", border: "1px solid #2a2a28", padding: "12px 14px", borderRadius: "14px 14px 14px 4px", fontSize: 13, maxWidth: "85%", lineHeight: 1.65, color: "#ccc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <CragBadge action={m.crag} />
                  <span style={{ fontSize: 11, color: "#555" }}>{m.time}ms</span>
                </div>
                <div style={{ whiteSpace: "pre-wrap" }}>{m.answer}</div>
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #2a2a28" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 6 }}>Sources:</div>
                  {m.sources.map((s: any, j: number) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#777", marginBottom: 5 }}>
                      <Badge type={s.retriever} />
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.preview}</span>
                      <span style={{ color: "#555", flexShrink: 0 }}>{s.score.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
                <Stars />
              </div>
            )
          )}
          {loading && (
            <div style={{ alignSelf: "flex-start", background: "#1a1a18", border: "1px solid #2a2a28", padding: "12px 18px", borderRadius: "14px 14px 14px 4px", display: "flex", gap: 5 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#666", animation: `pulse 1s ease-in-out ${i * 0.15}s infinite` }} />
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: 12, borderTop: "1px solid #2a2a28", display: "flex", gap: 8 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about your documents..." disabled={loading}
            style={{ flex: 1, padding: "9px 14px", border: "1px solid #333", borderRadius: 8, fontSize: 13, background: "#111", color: "#ccc", outline: "none" }} />
          <button onClick={send} disabled={loading || !input.trim()}
            style={{ padding: "9px 18px", background: "#534AB7", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, opacity: loading || !input.trim() ? 0.4 : 1 }}>
            Send
          </button>
        </div>
      </div>
      <div style={{ width: 240, overflowY: "auto", padding: 16, background: "#111", fontSize: 12, color: "#888" }}>
        <div style={{ fontWeight: 600, color: "#aaa", marginBottom: 12 }}>Pipeline status</div>
        {["Qdrant (dense)", "Elasticsearch (BM25)", "Neo4j (graph)", "PostgreSQL"].map((svc) => (
          <div key={svc} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#5DCAA5" }} />
            {svc}
          </div>
        ))}
        <div style={{ fontWeight: 600, color: "#aaa", margin: "20px 0 10px" }}>Retrieval config</div>
        <div style={{ lineHeight: 1.9 }}>
          <div>Embedding: all-MiniLM-L6-v2</div>
          <div>Chunk size: 512</div>
          <div>RRF k: 60</div>
          <div>CRAG threshold: 60%</div>
          <div>Max retries: 2</div>
          <div>Reward blend: 70/30</div>
        </div>
        <div style={{ fontWeight: 600, color: "#aaa", margin: "20px 0 10px" }}>Indexed corpus</div>
        <div style={{ lineHeight: 1.9 }}>
          <div>12 papers</div>
          <div>2,847 chunks</div>
          <div>423 entities</div>
          <div>1,156 relationships</div>
        </div>
      </div>
    </div>
  );
}

// ── Eval tab ─────────────────────────────────────────────────
function EvalTab() {
  const [history] = useState(genHistory);

  const radarData = [
    { label: "Faithfulness", value: 0.912 },
    { label: "Relevancy", value: 0.876 },
    { label: "Precision", value: 0.834 },
    { label: "Recall", value: 0.798 },
  ];

  const barData = [
    { name: "Dense", value: 812 },
    { name: "Sparse", value: 745 },
    { name: "Graph", value: 523 },
    { name: "Web", value: 155 },
  ];

  return (
    <div style={{ padding: 24, overflowY: "auto", height: "100%", color: "#ccc" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#eee", margin: 0 }}>Evaluation dashboard</h2>
        <p style={{ fontSize: 13, color: "#666", marginTop: 4 }}>RAGAS metrics across 847 evaluated queries</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Faithfulness", value: "91.2%" },
          { label: "Relevancy", value: "87.6%" },
          { label: "Precision", value: "83.4%" },
          { label: "Recall", value: "79.8%" },
          { label: "User rating", value: "4.2 / 5" },
          { label: "CRAG rate", value: "18.3%" },
        ].map((m) => (
          <div key={m.label} style={{ background: "#1a1a18", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#eee" }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ border: "1px solid #2a2a28", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#aaa", marginBottom: 12 }}>Metrics over time</div>
          <MiniLineChart data={history} keys={["faithfulness", "relevancy", "precision"]} colors={["#378ADD", "#5DCAA5", "#7F77DD"]} />
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
            {[{ l: "Faithfulness", c: "#378ADD" }, { l: "Relevancy", c: "#5DCAA5" }, { l: "Precision", c: "#7F77DD" }].map((x) => (
              <span key={x.l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#666" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: x.c, display: "inline-block" }} />{x.l}
              </span>
            ))}
          </div>
        </div>
        <div style={{ border: "1px solid #2a2a28", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#aaa", marginBottom: 12 }}>Current performance</div>
          <RadarChart data={radarData} />
        </div>
      </div>
      <div style={{ border: "1px solid #2a2a28", borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#aaa", marginBottom: 12 }}>Retriever utilization</div>
        <MiniBarChart data={barData} colors={["#378ADD", "#639922", "#7F77DD", "#D85A30"]} />
      </div>
      <div style={{ border: "1px solid #2a2a28", borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#aaa", marginBottom: 12 }}>Reward model status</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, fontSize: 12, color: "#888" }}>
          <div><span style={{ color: "#555" }}>Samples: </span>423</div>
          <div><span style={{ color: "#555" }}>CV accuracy: </span>84.2%</div>
          <div><span style={{ color: "#555" }}>Last trained: </span>2h ago</div>
          <div><span style={{ color: "#555" }}>Features: </span>6</div>
          <div><span style={{ color: "#555" }}>Blend: </span>70/30</div>
          <div><span style={{ color: "#555" }}>Model: </span>GBM</div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────
export default function HybridRAGDemo() {
  const [tab, setTab] = useState<"chat" | "eval">("chat");

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a09", color: "#ccc", fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace" }}>
      <style>{`@keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } } * { box-sizing: border-box; cursor: auto !important; } .curs`}</style>

      {/* Nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid #2a2a28" }}>
        <a href="/" style={{ color: "#7F77DD", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>TT.</a>
        <span style={{ color: "#333" }}>/</span>
        <span style={{ fontSize: 13, color: "#888" }}>projects</span>
        <span style={{ color: "#333" }}>/</span>
        <span style={{ fontSize: 13, color: "#ccc", fontWeight: 600 }}>hybrid-rag</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {(["chat", "eval"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "5px 14px", borderRadius: 6, border: "1px solid", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                background: tab === t ? "#1a1a3a" : "transparent", color: tab === t ? "#AFA9EC" : "#666", borderColor: tab === t ? "#534AB7" : "#2a2a28" }}>
              {t === "chat" ? "Query" : "Evaluation"}
            </button>
          ))}
        </div>
        <a href="https://github.com/TammineniTanay/hybrid-rag-system" target="_blank" rel="noopener"
          style={{ fontSize: 12, color: "#666", textDecoration: "none", marginLeft: 8 }}>
          GitHub &#8599;
        </a>
      </div>

      {/* Header */}
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #2a2a28" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#eee", margin: "0 0 6px" }}>
          Hybrid RAG System <span style={{ fontSize: 12, fontWeight: 400, color: "#534AB7", marginLeft: 8 }}>v1.0.0</span>
        </h1>
        <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
          Dense + Sparse + Graph retrieval &middot; Corrective RAG via LangGraph &middot; Feedback-driven reward model &middot; RAGAS evaluation
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {["Python", "FastAPI", "LangGraph", "Qdrant", "Elasticsearch", "Neo4j", "React", "Docker"].map((t) => (
            <span key={t} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, border: "1px solid #2a2a28", color: "#666" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ height: "calc(100vh - 140px)" }}>
        {tab === "chat" ? <ChatTab /> : <EvalTab />}
      </div>
    </div>
  );
}