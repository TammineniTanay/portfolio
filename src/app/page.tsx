"use client";
import { motion } from "framer-motion";
import React, { useState } from 'react';

// ... (ProjectCard component remains the same as previous)
interface ProjectProps {
  title: string;
  overview: string;
  contributions: string[];
  tags: string[];
  metric: string;
  accentColor: string;
  lessons: string;
  paperLink?: string; 
}

const ProjectCard = ({ title, overview, contributions, tags, metric, accentColor, lessons, paperLink }: ProjectProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="group h-[560px] [perspective:1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d]" animate={{ rotateY: isFlipped ? 180 : 0 }}>
        <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] p-[1px] rounded-[2.5rem] bg-gradient-to-br ${accentColor} via-transparent to-transparent shadow-2xl`}>
          <div className="bg-slate-950/90 backdrop-blur-xl p-10 rounded-[2.4rem] h-full flex flex-col border border-white/5">
            <h3 className="text-2xl font-black text-white tracking-tight uppercase italic mb-6">{title}</h3>
            <p className="text-slate-200 text-lg leading-relaxed font-medium italic">{overview}</p>
            <div className="mt-auto flex flex-col gap-4">
              <div className="h-[1px] w-full bg-slate-800"></div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-mono text-blue-400 uppercase tracking-widest font-bold italic">{metric}</span>
                <span className="text-[10px] text-slate-500 font-mono uppercase italic font-bold tracking-tighter">Tap to Flip</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] p-[1px] rounded-[2.5rem] bg-gradient-to-br ${accentColor} via-transparent to-transparent shadow-2xl`}>
          <div className="bg-slate-900/95 backdrop-blur-2xl p-10 rounded-[2.4rem] h-full flex flex-col border border-white/5 overflow-y-auto">
            <h4 className="text-blue-400 font-mono text-xs uppercase mb-2 font-bold italic">Engineering Outcome</h4>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4 text-[11px] italic text-blue-200">
              <strong>Lesson:</strong> {lessons}
            </div>
            <ul className="text-slate-300 text-[12px] space-y-3 italic mb-4">
              {contributions.map((point, i) => (
                <li key={i} className="flex gap-2"><span className="text-blue-500 font-bold">0{i+1}</span>{point}</li>
              ))}
            </ul>
            {paperLink && (
              <a href={paperLink} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-blue-600/20 border border-blue-500/40 text-blue-300 text-[10px] font-mono uppercase tracking-widest text-center rounded-xl hover:bg-blue-600/40 transition-all mb-4">
                View Full Paper (CVR Journal)
              </a>
            )}
            <div className="flex flex-wrap gap-2 mt-auto pt-4">
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
          <span className="text-xs font-mono tracking-[0.4em] uppercase text-blue-400 font-bold italic">AI Systems Developer | MS Computer Science</span>
          <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter text-white leading-none tracking-tighter">TANAY</h1>
          <div className="flex flex-wrap gap-4 mt-6 font-bold italic text-sm">
             <div className="px-6 py-2 rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-md text-blue-300">3.9 GRADUATE GPA</div>
             <div className="px-6 py-2 rounded-xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-md text-purple-300">CVR JOURNAL PUBLISHED AUTHOR</div>
          </div>
        </motion.header>

        {/* PROJECTS SECTION */}
        <section id="projects">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard 
              title="Vehicle Detection" accentColor="from-purple-500/50" metric="Peer-Reviewed Research"
              paperLink="https://www.researchgate.net/publication/372595973_Real_Time_Video_based_Vehicle_Detection_Counting_and_Classification_System"
              overview="Research on real-time traffic monitoring using Computer Vision and YOLO algorithms."
              lessons="Lighting changes broke early models; implemented noise reduction preprocessing to stabilize detection to 88%."
              contributions={["YOLOv3 algorithm implementation.", "Background Subtraction modules.", "Published in CVR Journal.", "COCO Dataset utilization."]}
              tags={["OpenCV", "YOLO", "Python"]}
            />
            <ProjectCard 
              title="LiveWire" accentColor="from-blue-500/50" metric="40% Latency Reduction"
              overview="AI sales co-pilot for real-time transcription and conversation analysis."
              lessons="Solved audio routing conflicts by shifting to a WASAPI-based approach for multi-source capture."
              contributions={["Captured 48kHz audio streams.", "Designed WebSocket pipelines.", "95% transcription accuracy.", "Automated CRM summaries."]}
              tags={["Whisper", "WebSockets", "LLMs"]}
            />
            <ProjectCard 
              title="Chat Application" accentColor="from-emerald-500/50" metric="Sub-100ms Latency"
              overview="Scalable messaging platform with JWT authentication and MongoDB."
              lessons="Optimized database indexing to solve bottlenecks during peak concurrent user spikes."
              contributions={["Socket.io integration.", "MongoDB schema optimization.", "JWT Security.", "React Interface."]}
              tags={["Node.js", "Socket.io", "MongoDB"]}
            />
          </div>
        </section>

        {/* EXPANDED CERTIFICATIONS SECTION */}
        <section>
          <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.5em] mb-12 italic font-bold underline decoration-blue-500 underline-offset-8 font-bold">Licenses & Technical Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cert 1 */}
            <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-white/5 backdrop-blur-sm flex justify-between items-center group">
              <div><h3 className="text-white font-bold italic underline decoration-blue-500 underline-offset-4">Cloud Data Engineering</h3><p className="text-slate-500 text-[10px] font-mono uppercase mt-1 italic">Focus: Azure Databricks</p></div>
              <a href="https://www.linkedin.com/in/tanay-tammineni-ba6a9918b/details/certifications/" target="_blank" className="px-4 py-2 rounded-lg bg-blue-600/10 text-blue-400 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all font-bold italic">Verify</a>
            </div>
            {/* Cert 2 */}
            <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-white/5 backdrop-blur-sm flex justify-between items-center group">
              <div><h3 className="text-white font-bold italic underline decoration-blue-500 underline-offset-4">AI & Machine Learning</h3><p className="text-slate-500 text-[10px] font-mono uppercase mt-1 italic">Focus: YOLO & Neural Networks</p></div>
              <a href="https://www.linkedin.com/in/tanay-tammineni-ba6a9918b/details/certifications/" target="_blank" className="px-4 py-2 rounded-lg bg-blue-600/10 text-blue-400 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all font-bold italic">Verify</a>
            </div>
            {/* Cert 3 - NEW */}
            <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-white/5 backdrop-blur-sm flex justify-between items-center group">
              <div><h3 className="text-white font-bold italic underline decoration-blue-500 underline-offset-4">Full Stack Development</h3><p className="text-slate-500 text-[10px] font-mono uppercase mt-1 italic">Focus: Node.js & React</p></div>
              <a href="https://www.linkedin.com/in/tanay-tammineni-ba6a9918b/details/certifications/" target="_blank" className="px-4 py-2 rounded-lg bg-blue-600/10 text-blue-400 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all font-bold italic">Verify</a>
            </div>
            {/* Cert 4 - NEW */}
            <div className="p-8 rounded-[2rem] bg-slate-900/30 border border-white/5 backdrop-blur-sm flex justify-between items-center group">
              <div><h3 className="text-white font-bold italic underline decoration-blue-500 underline-offset-4">Database Management</h3><p className="text-slate-500 text-[10px] font-mono uppercase mt-1 italic">Focus: MongoDB & ETL</p></div>
              <a href="https://www.linkedin.com/in/tanay-tammineni-ba6a9918b/details/certifications/" target="_blank" className="px-4 py-2 rounded-lg bg-blue-600/10 text-blue-400 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all font-bold italic">Verify</a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="sticky bottom-10 z-50 p-[1px] rounded-[2.5rem] bg-gradient-to-r from-blue-500/30 via-slate-800/50 to-purple-500/30 backdrop-blur-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="bg-slate-950/80 px-10 py-6 rounded-[2.4rem] flex flex-wrap justify-between items-center gap-8 border border-white/5">
            <div className="flex flex-col font-bold italic">
              <span className="text-lg text-white font-mono tracking-tight underline decoration-blue-500 decoration-2 underline-offset-4 tracking-tighter">tanaytammineni22@gmail.com</span>
              <span className="text-xs text-slate-500 font-mono tracking-widest">+1 816-277-9463</span>
            </div>
            <div className="flex gap-8 items-center font-black italic uppercase text-xs">
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