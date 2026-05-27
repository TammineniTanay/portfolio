"use client";
import { useState } from 'react';

const BULLET_BANK = [
  { keywords: ['rag', 'retrieval', 'vector', 'llm', 'langchain', 'llamaindex'], bullet: 'Built production RAG pipeline with hybrid retrieval (FAISS + BM25) and CRAG self-correction, achieving 23.7% faithfulness gain' },
  { keywords: ['fine-tun', 'lora', 'qlora', 'training', 'llm', 'model'], bullet: 'Engineered distributed LLM fine-tuning pipeline with QLoRA + DeepSpeed ZeRO-3, reducing per-GPU memory by 41.2%' },
  { keywords: ['deploy', 'inference', 'vllm', 'throughput', 'production'], bullet: 'Deployed vLLM inference server on Llama 3 8B achieving 3.8x throughput improvement with tensor parallelism' },
  { keywords: ['transcri', 'audio', 'whisper', 'real-time', 'speech'], bullet: 'Built real-time dual-channel AI transcription system (Chrome MV3 + Python WebSocket) using OpenAI Whisper for enterprise clients' },
  { keywords: ['computer vision', 'detection', 'yolo', 'opencv', 'image'], bullet: 'Published peer-reviewed computer vision research achieving 88% accuracy on real-time vehicle detection (CVR Journal, 2023)' },
  { keywords: ['fastapi', 'api', 'backend', 'rest', 'microservice'], bullet: 'Designed and deployed FastAPI microservices with Docker/CI-CD on Azure achieving 99.5% uptime in production' },
  { keywords: ['databricks', 'pyspark', 'etl', 'pipeline', 'data engineer'], bullet: 'Delivered PySpark/Databricks data pipelines processing enterprise datasets, reducing manual operations by 60%' },
  { keywords: ['aws', 'cloud', 'azure', 'gcp', 'infrastructure'], bullet: 'Architected cloud ML infrastructure on AWS/Azure with Terraform, Docker containers, and automated CI/CD pipelines' },
  { keywords: ['react', 'frontend', 'ui', 'dashboard', 'next'], bullet: 'Built React/Next.js dashboards with real-time data visualization and RAGAS evaluation metrics for AI system monitoring' },
  { keywords: ['pytorch', 'tensorflow', 'deep learning', 'neural', 'model'], bullet: 'Developed deep learning models with PyTorch and TensorFlow; implemented custom training loops, optimizers, and evaluation harnesses' },
  { keywords: ['agenti', 'agent', 'workflow', 'automat', 'orchestrat'], bullet: 'Engineered multi-agent agentic workflows with LangChain tools and LangGraph orchestration for enterprise automation' },
  { keywords: ['nlp', 'text', 'classification', 'sentiment', 'language'], bullet: 'Built NLP pipelines for text classification and sentiment analysis achieving 87% accuracy on production datasets' },
];

export default function ResumeOptimizer() {
  const [jd, setJd] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [analyzed, setAnalyzed] = useState(false);

  const analyze = () => {
    if (!jd.trim()) return;
    const lower = jd.toLowerCase();
    const matched = BULLET_BANK
      .filter(b => b.keywords.some(k => lower.includes(k)))
      .map(b => b.bullet);
    // Deduplicate and limit
    setSuggestions([...new Set(matched)].slice(0, 6));
    setAnalyzed(true);
  };

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '0.4rem' }}>⚡ Resume Bullet Optimizer</h3>
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: 'var(--muted)', marginBottom: '1rem' }}>Paste a JD — get matching resume bullets from Tanay's real experience. 100% client-side.</p>

      <textarea value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste job description here..."
        style={{ width: '100%', height: '90px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.75rem', color: 'var(--text)', fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', resize: 'vertical', outline: 'none' }} />

      <button onClick={analyze} style={{
        marginTop: '0.75rem', fontFamily: 'DM Mono, monospace', fontSize: '0.7rem',
        letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.5rem 1.25rem',
        background: 'transparent', border: '1px solid #00ff94', color: '#00ff94', cursor: 'pointer',
      }}>
        Generate Bullets →
      </button>

      {analyzed && (
        <div style={{ marginTop: '1rem' }}>
          {suggestions.length === 0 ? (
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: 'var(--muted)' }}>No strong keyword matches found. Try a more technical JD.</p>
          ) : (
            <>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: '#00ff94', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
                {suggestions.length} matching bullets found
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {suggestions.map((s, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: 'var(--surface2)', borderLeft: '2px solid #00ff94', borderRadius: '0 4px 4px 0', position: 'relative' }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>▸ {s}</p>
                    <button onClick={() => navigator.clipboard?.writeText(s)} style={{
                      position: 'absolute', top: '0.5rem', right: '0.5rem',
                      fontFamily: 'DM Mono, monospace', fontSize: '0.55rem', textTransform: 'uppercase',
                      padding: '0.15rem 0.4rem', border: '1px solid rgba(0,255,148,0.25)',
                      background: 'transparent', color: '#00ff94', cursor: 'pointer', letterSpacing: '0.08em',
                    }}>Copy</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
