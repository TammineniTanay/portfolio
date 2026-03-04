"use client";
import React, { useEffect, useRef } from 'react';

// Optimized Project Card Component
const ProjectCard = ({ className, year, title, bullets, tags, link, linkText = "View Repository" }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    // We keep the tilt but remove internal translateZ to avoid browser clipping
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
        <span className="project-year text-[#00e5ff] font-mono text-sm mb-3 block">{year}</span>
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
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#00e5ff] hover:text-white font-mono text-sm tracking-widest uppercase transition-colors p-2 -mr-2 relative z-30"
        >
          {linkText} →
        </a>
      </div>
    </div>
  );
};

export default function Portfolio() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Custom Cursor Logic
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

  // Skill Bar Animation Observer
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
      {/* Fixed Navigation with Contact Link */}
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

      {/* Background & Custom Cursor */}
      <div className="bg-grid"></div>
      <div className="bg-noise"></div>
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>
      <div ref={cursorRef} className="cursor-dot"></div>
      <div ref={ringRef} className="cursor-ring"></div>

      {/* Hero Section with GitHub Button */}
      <section className="min-h-[100vh] flex flex-col justify-center px-[5%] max-w-[1400px] mx-auto relative pt-32">
        <div className="text-[0.85rem] font-mono text-[#00e5ff] uppercase tracking-[3px] mb-6 italic">Irving, TX // Status: Online</div>
        <h1 className="text-[clamp(3rem,8vw,6rem)] leading-[1.1] font-bold title-font mb-6 tracking-tight text-white uppercase italic">TANAY<br />TAMMINENI.</h1>
        <p className="text-xl md:text-2xl text-[#5a6478] max-w-[800px] mb-12 font-light leading-relaxed italic">
          <strong className="text-white font-medium italic">MS CS · 3.9 GPA · Published Researcher · AI Systems Intern @ Automate365</strong><br/>
          Bridging real-time deep learning performance with cryptographic system integrity.
        </p>
        <div className="flex gap-4 flex-wrap relative z-50">
          <a href="#projects" className="btn primary">Deployments</a>
          <a href="/resume.pdf" target="_blank" className="btn">Execute Resume</a>
          <a href="https://github.com/TammineniTanay" target="_blank" className="btn">GitHub ↗</a>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-[#1e2535] bg-[#0c0f14]/80 backdrop-blur-md relative z-20">
        <div className="max-w-[1400px] mx-auto px-[5%] py-8 flex flex-wrap justify-between items-center gap-8 font-mono uppercase tracking-widest">
          <div className="flex flex-col"><span className="text-[#00e5ff] text-xs mb-1">GPA.PERF</span><strong className="text-2xl text-white">3.9 GPA</strong></div>
          <div className="flex flex-col"><span className="text-[#7c3aed] text-xs mb-1">OUTPUT</span><strong className="text-2xl text-white">CVR JOURNAL</strong></div>
          <div className="flex flex-col"><span className="text-[#00ff94] text-xs mb-1">NODES</span><strong className="text-2xl text-white">16 PROJECTS</strong></div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-container mt-20 mb-32 opacity-60">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="marquee-item"><span>//</span> Python</div>
              <div className="marquee-item"><span>//</span> Deep Learning</div>
              <div className="marquee-item"><span>//</span> Computer Vision</div>
              <div className="marquee-item"><span>//</span> Cryptography</div>
              <div className="marquee-item"><span>//</span> WebSockets</div>
              <div className="marquee-item"><span>//</span> Fast API</div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ALL 16 PROJECTS COMPLETED */}
      <section id="projects" className="px-[5%] max-w-[1400px] mx-auto py-32 relative z-20">
        <h2 className="text-4xl title-font mb-16 text-white uppercase italic font-bold"><span className="text-[#00e5ff] font-mono text-lg mr-4 block mb-2">01.</span>Architectures & Deployments</h2>
        <div className="projects-grid">
          <ProjectCard 
            className="featured" year="2023 // Published" title="Real-Time Vehicle Detection (CVR Journal)"
            bullets={[
              "Published in CVR Journal of Science and Technology; 3rd Prize at Expo2K23.",
              "Developed real-time vehicle counting and classification using SSD MobileNet.",
              "Achieved 88%+ detection accuracy on traffic video streams."
            ]}
            tags={['Python', 'OpenCV', 'Deep Learning']} link="https://github.com/TammineniTanay/vechiledetection"
          />
          <ProjectCard 
            className="half" year="2025 // Production" title="Live-Wire-AI Meeting Transcription"
            bullets={[
              "AI sales co-pilot featuring real-time transcription and LLM summarization.",
              "WebSocket-based audio streaming for low-latency capture.",
              "Integrated OpenAI API for automated, structured meeting insights."
            ]}
            tags={['FastAPI', 'WebSockets', 'OpenAI']} link="https://github.com/TammineniTanay/Live-Wire-AI"
          />
          <ProjectCard 
            className="half" year="2024 // Computer Vision" title="Face Recognition Attendance"
            bullets={[
              "Automated system processing live camera feeds for multi-face identification.",
              "Implemented recognition pipelines identifying individuals from datasets.",
              "Reduced manual effort via fully automated attendance logging."
            ]}
            tags={['Python', 'OpenCV', 'Deep Learning']} link="https://github.com/TammineniTanay/face-recognition-attendance-system"
          />
          <ProjectCard 
            className="third" year="2024" title="Vehicle Detection (PP-YOLO)"
            bullets={["PP-YOLO-based object detection for traffic monitoring.", "Built preprocessing pipelines for deep learning inference."]}
            tags={['Python', 'PP-YOLO', 'OpenCV']} link="https://github.com/TammineniTanay/vehicle-detection-pp-yolo"
          />
          <ProjectCard 
            className="third" year="2024" title="Shamir's Secret Sharing"
            bullets={["Implemented threshold cryptography via polynomial interpolation.", "Distributed sensitive data across multiple secure shares."]}
            tags={['Python', 'Cryptography', 'Math']} link="https://github.com/TammineniTanay/Shamir-s-Secret-Sharing"
          />
          <ProjectCard 
            className="third" year="2023" title="Hospital Management System"
            bullets={["MVC-based modular system for records and appointments.", "Built secure patient registration and medical history modules."]}
            tags={['Java', 'MySQL', 'MVC Architecture']} link="https://github.com/TammineniTanay/hospital-management-system-ase"
          />
          <ProjectCard 
            className="half" year="2024" title="Earthquake Impact Prediction"
            bullets={["Built cloud ML models to predict damage patterns.", "Applied ensemble learning to seismic and geological datasets."]}
            tags={['Python', 'Scikit-learn', 'Cloud Computing']} link="https://github.com/TammineniTanay/Prredicting-the-Effects-of-Earthquakes-Using-Cloud-Based-ML"
          />
          <ProjectCard 
            className="half" year="2024" title="Machine Learning Coursework"
            bullets={["Implemented Decision Trees, SVM, and Ridge/Lasso models.", "Applied Kernel PCA for dimensionality reduction."]}
            tags={['Python', 'Scikit-learn', 'Pandas']} link="https://github.com/TammineniTanay/machine-learning-coursework"
          />
          <ProjectCard 
            className="third" year="2024" title="Distributed Cloud Computing"
            bullets={["Parallel task execution across multiple cloud nodes.", "Analyzed fault tolerance and system scalability trade-offs."]}
            tags={['Cloud Computing', 'Distributed Systems']} link="https://github.com/TammineniTanay/distributed-cloud-computing-project"
          />
          <ProjectCard 
            className="third" year="2024" title="APL Mini Language Interpreter"
            bullets={["Built lexing, parsing, and expression evaluation from scratch.", "Demonstrated AST construction and compiler design concepts."]}
            tags={['Python', 'Parsing', 'Interpreter Design']} link="https://github.com/TammineniTanay/apl-mini-language-interpreter"
          />
          <ProjectCard 
            className="third" year="2023" title="AI Maze Search"
            bullets={["Implemented A*, BFS, and DFS for pathfinding simulations.", "Benchmarked performance comparing node visits and optimality."]}
            tags={['Python', 'A* Search', 'AI']} link="https://github.com/TammineniTanay/ai-maze-search"
          />
          <ProjectCard 
            className="third" year="2025" title="IIoT Research Survey"
            bullets={["Surveyed architectures for edge AI and federated learning.", "Analyzed 20+ publications on industrial IoT security."]}
            tags={['Research', 'IoT', 'Edge AI']} link="https://github.com/TammineniTanay/research-methods-iiot-survey"
          />
          <ProjectCard 
            className="third" year="2024" title="HCI Case Studies"
            bullets={["Conducted heuristic evaluations and usability testing.", "Designed workflows following user-centered principles."]}
            tags={['UX Design', 'Usability Testing', 'HCI']} link="https://github.com/TammineniTanay/human-computer-interaction-projects"
          />
          <ProjectCard 
            className="third" year="2023" title="Traffic Monitoring AI"
            bullets={["Computer vision pipeline for smart traffic monitoring.", "Extracted movement data from live traffic video frames."]}
            tags={['Python', 'Computer Vision', 'OpenCV']} link="https://github.com/TammineniTanay/realtime-Vechile-Detection-using-AI"
          />
          <ProjectCard 
            className="half" year="2025" title="Developer Branding"
            bullets={["Centralized 15+ projects across ML, AI, and systems.", "Structured repository documentation for clear navigation."]}
            tags={['GitHub', 'Markdown', 'Branding']} link="https://github.com/TammineniTanay/TammineniTanay"
          />
          <ProjectCard 
            className="half" year="2026" title="Portfolio Redesign"
            bullets={["Developed responsive site with Next.js and 3D animations.", "Integrated intersection observers and custom cursor hooks."]}
            tags={['React', 'Next.js', 'Tailwind CSS']} link="https://github.com/TammineniTanay/portfolio"
          />
        </div>
      </section>

      {/* Experience & Skills */}
      <section id="experience" className="px-[5%] max-w-[1400px] mx-auto py-32 grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-20">
        <div>
          <h2 className="text-4xl title-font mb-16 text-white uppercase italic font-bold"><span className="text-[#00e5ff] font-mono text-lg mr-4 block mb-2">02.</span>System Logs</h2>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <span className="font-mono text-sm text-[#00e5ff]">Apr 2025 — Present</span>
            <h3 className="text-xl title-font text-white mt-2 font-bold">AI Systems Developer Intern @ Automate365</h3>
            <p className="text-sm text-[#e8eaf0]/70 mt-4 italic">Deploying real-time sales co-pilots and high-performance transcription pipelines.</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <span className="font-mono text-sm text-[#00e5ff]">Jan 2024 — Dec 2025</span>
            <h3 className="text-xl title-font text-white mt-2 font-bold">MS, Computer Science @ SEMO</h3>
            <p className="text-sm text-[#e8eaf0]/70 mt-4 italic">3.9 GPA. Specialization in Advanced Artificial Intelligence and Distributed Systems.</p>
          </div>
          <div className="timeline-item" style={{ borderLeftColor: 'transparent' }}>
            <div className="timeline-dot"></div>
            <span className="font-mono text-sm text-[#00e5ff]">2019 — 2023</span>
            <h3 className="text-xl title-font text-white mt-2 font-bold">BE, Computer Science @ CVR College of Engineering</h3>
            <p className="text-sm text-[#e8eaf0]/70 mt-4 italic">Engineering foundation in Algorithms, Data Structures, and Database Management.</p>
          </div>
        </div>

        <div id="skills">
          <h2 className="text-4xl title-font mb-16 text-white uppercase italic font-bold"><span className="text-[#00e5ff] font-mono text-lg mr-4 block mb-2">03.</span>Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {[ 
              ['Python / SQL / C / Java', '95%'], ['ML (TF / Scikit)', '90%'], ['CV (OpenCV / YOLO)', '88%'], ['FastAPI / WebSockets', '85%'],
              ['Cloud (AWS / Azure)', '82%'], ['Cryptography', '80%'], ['Node.js / React', '78%'], ['Git / CI-CD', '85%']
            ].map(([name, p]) => (
              <div key={name} className="skill-group">
                <div className="flex justify-between font-mono text-xs mb-2 uppercase tracking-widest italic font-bold"><span className="text-white">{name}</span><span className="text-[#00e5ff]">{p}</span></div>
                <div className="skill-bar"><div className="skill-bar-fill" style={{ '--p': p } as React.CSSProperties}></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="pt-20 pb-20 text-center relative overflow-hidden border-t border-[#1e2535]">
        <h2 className="text-[clamp(2rem,8vw,4rem)] title-font mb-8 text-white uppercase italic font-bold tracking-tighter italic">Let's_Build_Together</h2>
        <a href="mailto:tanaytammineni22@gmail.com" className="btn primary text-lg px-12 py-4 mb-20 relative z-50">tanaytammineni22@gmail.com</a>
        <div className="flex justify-center gap-10 font-mono text-sm text-[#5a6478] uppercase relative z-50 italic font-bold">
          <a href="https://www.linkedin.com/in/tanay-tammineni-ba6a9918b/" className="hover:text-[#00e5ff] transition-colors italic">LinkedIn</a>
          <a href="https://github.com/TammineniTanay" className="hover:text-[#00e5ff] transition-colors italic">GitHub</a>
        </div>
      </footer>
    </>
  );
}