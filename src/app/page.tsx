"use client";
import { motion } from "framer-motion";
import React, { useState } from 'react';

interface ProjectProps {
  title: string;
  overview: string;
  contributions: string[];
  tags: string[];
  metric: string;
  accentColor: string;
  lessons: string;
  repoLink?: string;
  demoLink?: string;
  paperLink?: string;
}

const ProjectCard = ({ title, overview, contributions, tags, metric, accentColor, lessons, repoLink, demoLink, paperLink }: ProjectProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="group h-[600px] [perspective:1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d]" animate={{ rotateY: isFlipped ? 180 : 0 }}>
        {/* FRONT SIDE */}
        <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] p-[1px] rounded-[2.5rem] bg-gradient-to-br ${accentColor} via-transparent to-transparent shadow-2xl`}>
          <div className="bg-slate-950/90 backdrop-blur-xl p-10 rounded-[2.4rem] h-full flex flex-col border border-white/5">
            <h3 className="text-2xl font-black text-white tracking-tight uppercase italic mb-6">{title}</h3>
            <p className="text-slate-200 text-lg leading-relaxed font-medium italic">{overview}</p>
            <div className="mt-auto flex flex-col gap-4">
              <div className="h-[1px] w-full bg-slate-800"></div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono text-blue-400 uppercase tracking-widest font-bold italic">{metric}</span>
                <span className="text-[10px] text-slate-500 font-mono uppercase italic font-bold tracking-tighter">View Architecture</span>
              </div>
            </div>
          </div>
        </div>
        {/* BACK SIDE */}
        <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] p-[1px] rounded-[2.5rem] bg-gradient-to-br ${accentColor} via-transparent to-transparent shadow-2xl`}>
          <div className="bg-slate-900/95 backdrop-blur-2xl p-10 rounded-[2.4rem] h-full flex flex-col border border-white/5 overflow-y-auto custom-scrollbar">
            <h4 className="text-blue-400 font-mono text-xs uppercase mb-2 font-bold italic">Engineering Logic</h4>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4 text-[11px] italic text-blue-200">
              <strong>Challenge:</strong> {lessons}
            </div>
            <ul className="text-slate-300 text-[12px] space-y-3 italic mb-6">
              {contributions.map((point, i) => (
                <li key={i} className="flex gap-2"><span className="text-blue-500 font-bold">0{i+1}</span>{point}</li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {repoLink && <a href={repoLink} target="_blank" className="py-2 bg-white/5 border border-white/10 text-white text-[10px] font-mono uppercase text-center rounded-lg hover:bg-white/10 transition-all">Code Base</a>}
              {demoLink && <a href={demoLink} target="_blank" className="py-2 bg-blue-600/20 border border-blue-500/40 text-blue-300 text-[10px] font-mono uppercase text-center rounded-lg hover:bg-blue-600/40 transition-all">Live Demo</a>}
              {paperLink && <a href={paperLink} target="_blank" className="col-span-2 py-2 bg-purple-600/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono uppercase text-center rounded-lg hover:bg-purple-600/40 transition-all">Read Publication</a>}
            </div>
            <div className="flex flex-wrap gap-2 mt-auto">
              {tags.map(tag => <span key={tag} className="text-[10px] font-mono text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">{tag}</span>)}
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
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col gap-40">
        
        {/* HERO SECTION */}
        <motion.header initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="flex flex-col gap-8">
          <span className="text-xs font-mono tracking-[0.4em] uppercase text-blue-400 font-bold italic">AI Systems | Cybersecurity | MS Computer Science</span>
          <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter text-white leading-none">TANAY</h1>
          <div className="max-w-3xl p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 backdrop-blur-sm">
            <h2 className="text-blue-400 font-mono text-xs uppercase tracking-widest mb-4 font-bold">The Mission</h2>
            <p className="text-slate-300 italic text-xl leading-relaxed">
              "I build **secure and intelligent systems** by bridging the gap between real-time AI performance and cryptographic integrity. Currently focused on scaling low-latency transcription at **Automate365**."
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mt-6 font-bold italic text-sm">
             <div className="px-6 py-2 rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-md text-blue-300 tracking-wide">3.9 GRADUATE GPA</div>
             <div className="px-6 py-2 rounded-xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-md text-purple-300 tracking-wide">RESEARCH PUBLISHED: CVR JOURNAL</div>
          </div>
        </motion.header>

        {/* AI & SYSTEMS SECTION */}
        <section>
          <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.5em] mb-16 italic font-bold underline decoration-blue-500 underline-offset-8">AI & Machine Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard 
              title="Vehicle Detection" accentColor="from-purple-500/50" metric="Peer-Reviewed Research"
              paperLink="https://www.researchgate.net/publication/372595973_Real_Time_Video_based_Vehicle_Detection_Counting_and_Classification_System"
              overview="Research on real-time traffic monitoring using YOLOv3 and COCO dataset for 80-class detection."
              lessons="Lighting variance disrupted early models; stabilized detection to 88% accuracy via noise reduction preprocessing."
              contributions={["Applied YOLOv3 for real-time classification.", "Developed Background Learning modules.", "Published in CVR Journal of Science & Technology."]}
              tags={["OpenCV", "YOLOv3", "Python"]}
              repoLink="https://github.com/TammineniTanay"
            />
            <ProjectCard 
              title="LiveWire" accentColor="from-blue-500/50" metric="40% Latency Reduction"
              overview="AI sales co-pilot for real-time transcription and live agent assistance."
              lessons="Solved audio routing conflicts by shifting to a WASAPI-based approach for multi-source capture."
              contributions={["95% transcription accuracy via OpenAI Whisper.", "Reduced end-to-end pipeline latency by 40%.", "Implemented secure audio handling for data privacy."]}
              tags={["Whisper", "WebSockets", "LLMs"]}
              demoLink="https://tanaytammineni.vercel.app/"
            />
             <ProjectCard 
              title="Chat App" accentColor="from-emerald-500/50" metric="Sub-100ms Latency"
              overview="Scalable messaging platform built with Node.js and Socket.io for high-concurrency."
              lessons="Optimized database indexing to resolve bottlenecks during peak concurrent user spikes."
              contributions={["Sub-100ms message delivery.", "JWT-based secure authentication.", "MongoDB schema optimization for real-time queries."]}
              tags={["Node.js", "Socket.io", "MongoDB"]}
              repoLink="https://github.com/TammineniTanay"
            />
          </div>
        </section>

        {/* CYBERSECURITY SECTION */}
        <section>
          <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.5em] mb-16 italic font-bold underline decoration-emerald-500 underline-offset-8">Cybersecurity & Cryptography</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProjectCard 
              title="Secret Sharing" accentColor="from-emerald-500/50" metric="Threshold Cryptography"
              overview="Implementation of Shamir's Secret Sharing (SSS) for secure, distributed data storage."
              lessons="Used large prime fields (2^127 - 1) to ensure secure cryptographic operations and data integrity."
              contributions={["Utilized Lagrange Interpolation for secret recovery.", "Optimized modular division via Extended Euclidean Algorithm.", "Visualized share distribution along polynomial curves."]}
              tags={["Python", "Cryptography", "Math"]}
              repoLink="https://github.com/TammineniTanay"
            />
            <ProjectCard 
              title="Security Audit" accentColor="from-red-500/50" metric="Vulnerability Analysis"
              overview="Auditing stack-based buffer overflow vulnerabilities in memory-unsafe C systems."
              lessons="Identified how unchecked input buffers allow for memory manipulation and credential bypass."
              contributions={["Audited memory-unsafe C implementations (Dr. Naive).", "Analyzed impact of global vs. local buffer storage.", "Demonstrated secure alternatives using fgets/strncpy."]}
              tags={["C", "Security Audit", "Systems"]}
              repoLink="https://github.com/TammineniTanay"
            />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="sticky bottom-10 z-50 p-[1px] rounded-[2.5rem] bg-gradient-to-r from-blue-500/30 via-slate-800/50 to-purple-500/30 backdrop-blur-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="bg-slate-950/80 px-10 py-6 rounded-[2.4rem] flex flex-wrap justify-between items-center gap-8 border border-white/5">
            <div className="flex flex-col font-bold italic">
              <span className="text-lg text-white font-mono tracking-tight underline decoration-blue-500 decoration-2 underline-offset-4 tracking-tighter italic font-bold">tanaytammineni22@gmail.com</span>
              <span className="text-xs text-slate-500 font-mono tracking-widest font-bold">+1 816-277-9463</span>
            </div>
            <div className="flex gap-8 items-center font-black italic uppercase text-xs">
              <a href="https://www.linkedin.com/in/tanay-tammineni-ba6a9918b/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-all font-bold italic">LinkedIn</a>
              <a href="https://github.com/TammineniTanay" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-all font-bold italic">GitHub</a>
              <a href="/resume.pdf" target="_blank" className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-500 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.3)] font-bold italic">Access Resume</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}