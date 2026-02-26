"use client";
import { motion } from "framer-motion";
import React, { useState } from 'react';

// TypeScript Interface for Project Props
interface ProjectProps {
  title: string;
  overview: string;
  contributions: string[];
  tags: string[];
  metric: string;
  accentColor: string;
  lessons: string; // Added for the "How I Think" narrative
}

// Enhanced Flip Card Component
const ProjectCard = ({ title, overview, contributions, tags, metric, accentColor, lessons }: ProjectProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group h-[560px] [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div 
        className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* FRONT SIDE - PROJECT OVERVIEW */}
        <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] p-[1px] rounded-[2.5rem] bg-gradient-to-br ${accentColor} via-transparent to-transparent shadow-2xl`}>
          <div className="bg-slate-950/90 backdrop-blur-xl p-10 rounded-[2.4rem] h-full flex flex-col border border-white/5">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">{title}</h3>
              <div className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-pulse"></div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-blue-400 font-mono text-[10px] uppercase tracking-[0.3em] mb-3 font-bold">The Vision</h4>
              <p className="text-slate-200 text-lg leading-relaxed font-medium italic">
                {overview}
              </p>
            </div>
            
            <div className="mt-auto flex flex-col gap-4">
              <div className="h-[1px] w-full bg-slate-800"></div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono text-blue-400 uppercase tracking-widest font-bold italic">{metric}</span>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter italic font-bold border-b border-slate-700">How I Built It</span>
              </div>
            </div>
          </div>
        </div>

        {/* BACK SIDE - WHAT I HAVE DONE & LESSONS */}
        <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] p-[1px] rounded-[2.5rem] bg-gradient-to-br ${accentColor} via-transparent to-transparent shadow-2xl`}>
          <div className="bg-slate-900/95 backdrop-blur-2xl p-10 rounded-[2.4rem] h-full flex flex-col border border-white/5 overflow-y-auto custom-scrollbar">
            <div className="mb-6">
              <h3 className="text-xs font-mono text-blue-400 uppercase tracking-[0.3em] mb-2 font-bold italic">Engineering Deep-Dive</h3>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4 text-[12px] italic text-blue-200">
                <strong>Lesson Learned:</strong> {lessons}
              </div>
            </div>
            
            <ul className="text-slate-300 text-[13px] leading-relaxed space-y-4 italic">
              {contributions.map((point, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-blue-500 font-bold">0{i+1}</span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 mt-auto pt-6">
              {tags.map(tag => (
                <span key={tag} className="text-[10px] font-mono text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden selection:bg-blue-500/30">
      {/* Immersive Depth Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse opacity-50"></div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col gap-40">
        
        {/* HERO SECTION */}
        <motion.header initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
            <span className="text-xs font-mono tracking-[0.4em] uppercase text-blue-400 font-bold italic">AI Systems Developer | MS Computer Science</span>
          </div>
          <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter text-white drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)] leading-none">TANAY</h1>
          <p className="text-2xl md:text-4xl text-slate-400 max-w-4xl leading-tight font-light italic">
            Engineering <span className="text-white font-bold underline decoration-blue-500 decoration-4 underline-offset-8">real-time AI applications</span> and scalable infrastructure.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 font-bold italic text-sm">
             <div className="px-6 py-2 rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-md text-blue-300 tracking-wide">3.9 GRADUATE GPA</div>
             <div className="px-6 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-slate-300 tracking-wide underline underline-offset-4 tracking-tighter">SOUTHEAST MISSOURI STATE UNIVERSITY</div>
          </div>
        </motion.header>

        {/* NEW: MINDSET / CASE STUDY OVERVIEW SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 backdrop-blur-sm">
            <h2 className="text-blue-400 font-mono text-xs uppercase tracking-widest mb-4 font-bold">How I Think</h2>
            <p className="text-slate-300 italic text-lg leading-relaxed">
              "I break complex system requirements into modular, testable units. My priority is always reducing latency and ensuring data integrity before scaling features."
            </p>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 backdrop-blur-sm">
            <h2 className="text-purple-400 font-mono text-xs uppercase tracking-widest mb-4 font-bold">Current Learning</h2>
            <p className="text-slate-300 italic text-lg leading-relaxed">
              "Exploring advanced real-time transcription scaling and RAG (Retrieval-Augmented Generation) architectures to improve AI co-pilot responsiveness."
            </p>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects">
          <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.5em] mb-16 italic font-bold">Interactive Case Studies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard 
              title="LiveWire"
              accentColor="from-blue-500/50"
              overview="An AI sales co-pilot Chrome extension designed for real-time conversation analysis."
              lessons="Solved audio routing conflicts by utilizing a WASAPI-based capture approach for seamless multi-source recording."
              contributions={[
                "Captured 48kHz audio streams via MediaStream APIs.",
                "Designed low-latency WebSocket pipelines, cutting latency by 40%.",
                "Achieved 95% transcription accuracy using OpenAI Whisper.",
                "Automated data flow from transcription to structured CRM summaries."
              ]}
              tags={["Whisper", "WebSockets", "LLMs", "Node.js"]}
              metric="40% Latency Reduction"
            />
            <ProjectCard 
              title="Vehicle Detection"
              accentColor="from-purple-500/50"
              overview="Published research on traffic monitoring and classification in real-time video feeds."
              lessons="Model accuracy fluctuated in low-light; I implemented noise reduction preprocessing to stabilize detection to 88%."
              contributions={[
                "Built core detection using OpenCV, YOLO, and TensorFlow.",
                "Published findings in CVR Journal of Science and Technology.",
                "Implemented counting algorithms for traffic flow analysis.",
                "Developed preprocessing pipelines for robust noise reduction."
              ]}
              tags={["OpenCV", "YOLO", "TensorFlow", "Python"]}
              metric="88% Accuracy | Published"
            />
            <ProjectCard 
              title="Chat Application"
              accentColor="from-emerald-500/50"
              overview="Instant messaging platform engineered for high concurrency and security."
              lessons="Optimized database indexing to solve message retrieval bottlenecks during peak concurrent user spikes."
              contributions={[
                "Delivered sub-100ms message speed using Socket.io.",
                "Optimized MongoDB schemas for high-speed indexing.",
                "Implemented JWT-based secure user authentication.",
                "Built a responsive React interface for seamless UX."
              ]}
              tags={["Socket.io", "Node.js", "MongoDB", "React"]}
              metric="Sub-100ms Latency"
            />
          </div>
        </section>

        {/* EXPERIENCE TIMELINE */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-1">
            <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.5em] mb-6 italic font-bold">Experience</h2>
            <p className="text-slate-400 italic font-medium leading-relaxed">From optimizing Java multi-threading to architecting AI-driven automation pipelines.</p>
          </div>
          <div className="lg:col-span-2 space-y-16 border-l border-slate-800 pl-10 ml-4 relative">
            <div className="relative">
              <div className="absolute left-[-50px] top-2 h-5 w-5 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6]"></div>
              <h3 className="text-2xl font-bold text-white italic uppercase tracking-tighter">AI Systems Developer Intern — Automate365</h3>
              <p className="text-blue-400 font-mono text-sm mb-4 italic font-bold">2025 – Present</p>
              <p className="text-slate-400 text-sm italic leading-relaxed">Orchestrated the integration of Whisper and LLM pipelines into real-world sales workflows. Solved critical audio routing challenges for multi-source capture.</p>
            </div>
            <div className="relative">
              <div className="absolute left-[-50px] top-2 h-5 w-5 rounded-full bg-slate-800 border border-slate-600"></div>
              <h3 className="text-2xl font-bold text-white italic uppercase tracking-tighter">Software Engineer Intern — Globalshala</h3>
              <p className="text-slate-500 font-mono text-sm mb-4 italic font-bold">2022</p>
              <p className="text-slate-400 text-sm italic leading-relaxed">Boosted backend productivity by 30% through multi-threading. Built high-performance ETL pipelines with Azure Databricks for real-time analytics.</p>
            </div>
          </div>
        </section>

        {/* FOOTER DASHBOARD */}
        <footer className="sticky bottom-10 z-50 p-[1px] rounded-[2.5rem] bg-gradient-to-r from-blue-500/30 via-slate-800/50 to-purple-500/30 backdrop-blur-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="bg-slate-950/80 px-10 py-6 rounded-[2.4rem] flex flex-wrap justify-between items-center gap-8 border border-white/5">
            <div className="flex flex-col">
              <span className="text-lg font-black text-white font-mono tracking-tight italic underline decoration-blue-500 decoration-2 underline-offset-4 font-bold">tanaytammineni22@gmail.com</span>
              <span className="text-xs text-slate-500 font-mono italic tracking-widest font-bold">+1 816-277-9463</span>
            </div>
            <div className="flex gap-8 items-center font-black italic tracking-widest uppercase text-xs">
              <a href="https://www.linkedin.com/in/tanay-tammineni-ba6a9918b/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-all font-bold">LinkedIn</a>
              <a href="https://github.com/TammineniTanay" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-all font-bold">GitHub</a>
              <a href="/resume.pdf" target="_blank" className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-500 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.3)] font-bold italic">Access Resume</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}