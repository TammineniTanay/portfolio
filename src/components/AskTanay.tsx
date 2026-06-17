"use client";
import { useState, useRef, useEffect } from 'react';

interface Message { role: 'user' | 'assistant'; content: string; }

const SYSTEM_PROMPT = `You are Tanay Tammineni's AI portfolio assistant. Answer questions about Tanay concisely and professionally.

Key facts about Tanay:
- MS Computer Science, Southeast Missouri State University, GPA 3.9, Dec 2025
- AI Systems Developer Intern at VoiceBotics AI, Irving TX, Apr 2025-present
- AI/ML Engineer Intern at Globalshala, Jun-Dec 2022
- Published peer-reviewed researcher: "Real-Time Vehicle Detection, Counting & Classification System", CVR Journal Vol.24, June 2023
- Skills: Python, PyTorch, TensorFlow, LangChain, LlamaIndex, RAG, Agentic AI, FastAPI, Docker, AWS, Azure, MongoDB, Redis, SQL
- 18 projects including: Distributed Fine-Tune Pipeline, Hybrid RAG System, LiveWire AI Transcription, Job Command Center
- Open to full-time AI/ML Engineer, GenAI Engineer, ML Engineer, Data Scientist roles across the US
- Email: tanaytammineni22@gmail.com
- GitHub: github.com/TammineniTanay
- LinkedIn: linkedin.com/in/tanay-tammineni
- Location: Irving, TX, open to full relocation

Answer questions about his experience, projects, skills, education, and availability. Be concise (2-4 sentences max). If asked something you don't know, say so politely.`;

const SUGGESTED = [
  "What's Tanay's strongest skill?",
  "Tell me about the RAG project",
  "Is Tanay open to remote work?",
  "What makes Tanay different?",
];

export default function AskTanay() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Tanay's AI assistant. Ask me anything about his experience, projects, or skills." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Try to get key from env or prompt
  useEffect(() => {
    // Check if NEXT_PUBLIC_GROQ_API_KEY is set
    const k = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (k) { setApiKey(k); setHasKey(true); }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const key = apiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY;
      if (!key) {
        // Fallback: smart static responses without API
        const lower = text.toLowerCase();
        let reply = "I'd love to answer that! For the full interactive experience, set NEXT_PUBLIC_GROQ_API_KEY in your .env.local file (free at console.groq.com).";

        if (lower.includes('skill') || lower.includes('tech') || lower.includes('stack')) {
          reply = "Tanay's strongest skills are Python, LLM fine-tuning (QLoRA/LoRA), RAG pipelines (LangChain + LlamaIndex), and FastAPI. He's built production systems at VoiceBotics AI using these daily.";
        } else if (lower.includes('rag') || lower.includes('retrieval')) {
          reply = "Tanay built a production Hybrid RAG System with Qdrant + Elasticsearch + Neo4j retrieval, Corrective RAG via LangGraph, and a RAGAS evaluation dashboard. It features self-correction loops and NLI-based hallucination filtering.";
        } else if (lower.includes('remote') || lower.includes('relocat') || lower.includes('location')) {
          reply = "Tanay is based in Irving, TX and is open to full relocation anywhere in the US. He's also open to remote roles.";
        } else if (lower.includes('different') || lower.includes('stand out') || lower.includes('unique')) {
          reply = "Tanay is one of the few candidates who combines peer-reviewed published research, production LLM deployments at a real company (VoiceBotics AI), and a 3.9 GPA MS degree. He ships real systems, not just notebooks.";
        } else if (lower.includes('project') || lower.includes('built') || lower.includes('work')) {
          reply = "Tanay's top projects are: Distributed Fine-Tune Pipeline (QLoRA + DeepSpeed), Hybrid RAG System (Qdrant + CRAG), LiveWire AI Transcription (Chrome extension + Whisper), and Job Command Center (FastAPI + Claude Haiku). All are real deployed systems.";
        } else if (lower.includes('contact') || lower.includes('hire') || lower.includes('email')) {
          reply = "You can reach Tanay at tanaytammineni22@gmail.com or connect on LinkedIn at linkedin.com/in/tanay-tammineni. He's actively interviewing for full-time AI/ML roles.";
        } else if (lower.includes('gpa') || lower.includes('education') || lower.includes('degree')) {
          reply = "Tanay has an MS in Computer Science from Southeast Missouri State University with a 3.9 GPA (Dec 2025) and a BE in CS from CVR College of Engineering (2023).";
        }
        setMessages(m => [...m, { role: 'assistant', content: reply }]);
        setLoading(false);
        return;
      }

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: text }
          ],
          max_tokens: 200, temperature: 0.7,
        }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response right now.";
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Email Tanay directly at tanaytammineni22@gmail.com!" }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{
      position: 'fixed', bottom: '2rem', right: '5rem', zIndex: 200,
      fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.1em',
      textTransform: 'uppercase', padding: '0.75rem 1.25rem',
      background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(124,58,237,0.15))',
      border: '1px solid rgba(0,229,255,0.4)', color: '#00e5ff',
      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
      boxShadow: '0 0 20px rgba(0,229,255,0.15)',
      animation: 'askPulse 3s ease-in-out infinite',
    }}>
      <span style={{ fontSize: '1rem' }}>◈</span> Ask Tanay AI
      <style>{`@keyframes askPulse { 0%,100%{box-shadow:0 0 20px rgba(0,229,255,0.15)} 50%{box-shadow:0 0 35px rgba(0,229,255,0.35)} }`}</style>
    </button>
  );

  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1rem', zIndex: 200,
      width: 'min(380px, calc(100vw - 2rem))',
      background: 'rgba(10,10,18,0.97)', border: '1px solid rgba(0,229,255,0.25)',
      backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column', maxHeight: '520px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', borderBottom: '1px solid rgba(0,229,255,0.12)', background: 'rgba(0,229,255,0.04)' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5ff', boxShadow: '0 0 8px #00e5ff', animation: 'askPulse 2s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Ask Tanay AI</span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.55rem', color: 'var(--muted)', marginLeft: 'auto', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {hasKey ? 'Groq · llama3' : 'Smart FAQ'}
        </span>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>×</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%', padding: '0.6rem 0.9rem',
              background: m.role === 'user' ? 'rgba(0,229,255,0.12)' : 'rgba(124,58,237,0.1)',
              border: `1px solid ${m.role === 'user' ? 'rgba(0,229,255,0.25)' : 'rgba(124,58,237,0.2)'}`,
              fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.6,
              fontFamily: 'DM Sans, sans-serif',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '0.3rem', padding: '0.6rem 0.9rem', width: 'fit-content' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e5ff', animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested */}
      {messages.length <= 1 && (
        <div style={{ padding: '0 0.85rem 0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {SUGGESTED.map((s, i) => (
            <button key={i} onClick={() => send(s)} style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.05em',
              padding: '0.25rem 0.6rem', background: 'rgba(0,229,255,0.05)',
              border: '1px solid rgba(0,229,255,0.2)', color: '#00e5ff', cursor: 'pointer',
              transition: 'all 0.15s', borderRadius: '2px',
            }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', borderTop: '1px solid rgba(0,229,255,0.12)' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Ask about experience, projects..."
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            padding: '0.75rem 1rem', color: 'var(--text)',
            fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', caretColor: '#00e5ff',
          }}
        />
        <button onClick={() => send(input)} disabled={!input.trim() || loading} style={{
          padding: '0 1rem', background: 'rgba(0,229,255,0.08)',
          border: 'none', borderLeft: '1px solid rgba(0,229,255,0.12)',
          color: '#00e5ff', cursor: 'pointer', fontFamily: 'DM Mono, monospace',
          fontSize: '0.7rem', transition: 'all 0.2s',
          opacity: (!input.trim() || loading) ? 0.4 : 1,
        }}>→</button>
      </div>

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes askPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
}