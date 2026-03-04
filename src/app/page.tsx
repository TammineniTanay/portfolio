"use client";
import React, { useEffect, useRef } from 'react';

// Upgraded Project Card with Bullet Points and 3D Z-Index Fix for Links
const ProjectCard = ({ className, year, title, bullets, tags, link, linkText = "View Repository" }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0deg)`;
  };

  return (
    <div
      ref={cardRef}
      className={`project-card ${className} flex flex-col justify-between group`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.1s ease, border-color 0.3s ease' }}
    >
      <div className="relative z-10" style={{ transform: 'translateZ(15px)' }}>
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

      <div className="mt-auto pt-6 border-t border-[#1e2535] flex flex-wrap justify-between items-end gap-4 relative z-50" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex flex-wrap gap-2 max-w-[70%]">
          {tags.map((tag: string, i: number) => (
            <span key={i} className="font-mono text-[10px] uppercase tracking-wider bg-[#111620] text-[#a0aec0] px-2 py-1 rounded border border-[#1e2535]">{tag}</span>
          ))}
        </div>
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#00e5ff] hover:text-white font-mono text-sm tracking-widest uppercase transition-colors cursor-pointer p-2 -mr-2"
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

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const animCursor = () => {
      if (cursor) cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
      rx += (mx - rx) * 0.12; // Controls the trailing speed
      ry += (my - ry) * 0.12;
      if (ring) ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      rafId = requestAnimationFrame(animCursor);
    };

    document.addEventListener('mousemove', onMouseMove);
    animCursor();

    // Add expansion effect when hovering over links or buttons
    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (ring) {
          ring.style.width = '50px';
          ring.style.height = '50px';
          ring.style.transform = `translate(${rx - 25}px, ${ry - 25}px)`;
          ring.style.borderColor = '#00ff94'; // Turns green on hover
        }
      });
      el.addEventListener('mouseleave', () => {
        if (ring) {
          ring.style.width = '36px';
          ring.style.height = '36px';
          ring.style.borderColor = 'rgba(0, 229, 255, 0.4)'; // Back to blue
        }
      });
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Fixed: Grouped Skill Bar Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const bars = e.target.querySelectorAll('.skill-bar-fill');
            bars.forEach((b) => {
              (b as HTMLElement).style.animationPlayState = 'running';
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const skillSection = document.querySelector('#skills-container');
    if (skillSection) observer.observe(skillSection);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#050709]/80 backdrop-blur-md border-b border-[#1e2535]">
        <div className="max-w-[1400px] mx-auto px-[5%] py-4 flex justify-between items-center">
          <a href="#" className="font-mono text-[#00e5ff] font-bold tracking-widest text-lg">TT.</a>
          <div className="flex gap-6 text-xs md:text-sm font-mono text-[#5a6478] uppercase tracking-widest">
            <a href="#projects" className="hover:text-[#00e5ff] transition-colors">Projects</a>
            <a href="#experience" className="hover:text-[#00e5ff] transition-colors">Experience</a>
            <a href="#skills" className="hover:text-[#00e5ff] transition-colors">Skills</a>
          </div>
        </div>
      </nav>

      {/* Background Elements */}
      <div className="bg-grid"></div>
      <div className="bg-noise"></div>
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      {/* Custom Cursor Elements */}
      <div ref={cursorRef} className="cursor-dot"></div>
      <div ref={ringRef} className="cursor-ring"></div>

      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center px-[5%] max-w-[1400px] mx-auto relative pt-32">
        <div className="text-[0.85rem] font-mono text-[#00e5ff] uppercase tracking-[3px] mb-6">
          Irving, TX // System Status: Online
        </div>
        <h1 className="text-[clamp(3rem,8vw,6rem)] leading-[1.1] font-bold title-font mb-6 tracking-tight text-white">
          TANAY<br />TAMMINENI.
        </h1>
        
        {/* Upgraded Subtitle */}
        <p className="text-xl md:text-2xl text-[#5a6478] max-w-[800px] mb-12 font-light leading-relaxed">
          <strong className="text-white font-medium">MS CS · 3.9 GPA · Published Researcher · AI Engineer @ Automate365</strong><br/>
          Bridging the gap between deep learning architectures, applied cryptography, and high-performance cloud deployments.
        </p>
        
        <div className="flex gap-4 flex-wrap">
          <a href="#projects" className="btn primary">Deployments</a>
          <a href="/resume.pdf" target="_blank" className="btn">Execute Resume</a>
          <a href="https://github.com/TammineniTanay" target="_blank" className="btn">GitHub</a>
        </div>
      </section>

      {/* Upgraded Stats Bar */}
      <section className="border-y border-[#1e2535] bg-[#0c0f14]/80 backdrop-blur-md relative z-20">
        <div className="max-w-[1400px] mx-auto px-[5%] py-8 flex flex-wrap justify-between items-center gap-8 font-mono uppercase tracking-widest">
          <div className="flex flex-col"><span className="text-[#00e5ff] text-xs mb-1">SYS.PERF</span><strong className="text-2xl text-white">3.9 GPA</strong></div>
          <div className="flex flex-col"><span className="text-[#7c3aed] text-xs mb-1">OUTPUT</span><strong className="text-2xl text-white">CVR JOURNAL</strong></div>
          <div className="flex flex-col"><span className="text-[#00ff94] text-xs mb-1">NODES</span><strong className="text-2xl text-white">16 PROJECTS</strong></div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-container border-b-0 border-t-0 mt-20 mb-32 opacity-60">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="marquee-item"><span>//</span> Python</div>
              <div className="marquee-item"><span>//</span> Deep Learning</div>
              <div className="marquee-item"><span>//</span> TensorFlow</div>
              <div className="marquee-item"><span>//</span> Cryptography</div>
              <div className="marquee-item"><span>//</span> Computer Vision</div>
              <div className="marquee-item"><span>//</span> Fast API</div>
              <div className="marquee-item"><span>//</span> WebSockets</div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 16 Projects Grid */}
      <section id="projects" className="px-[5%] max-w-[1400px] mx-auto mb-32 relative z-20">
        <h2 className="text-4xl title-font mb-12 text-white"><span className="text-[#00e5ff] font-mono text-lg mr-4 block mb-2">01.</span>Architectures & Deployments</h2>
        <div className="projects-grid">
          
          <ProjectCard 
            className="featured"
            year="2023 // Published"
            title="Real-Time Vehicle Detection (CVR Journal)"
            bullets={[
              "Published in CVR Journal of Science and Technology and awarded 3rd Prize at Project Expo2K23.",
              "Developed a real-time vehicle detection, counting, and classification system from live traffic video streams.",
              "Built object detection pipelines using SSD MobileNet achieving 88%+ detection accuracy.",
              "Implemented directional vehicle tracking across multi-lane traffic scenarios."
            ]}
            tags={['Python', 'OpenCV', 'SSD MobileNet']}
            link="https://github.com/TammineniTanay/vechiledetection"
          />

          <ProjectCard 
            className="half"
            year="2025 // Production"
            title="Live-Wire-AI Meeting Transcription"
            bullets={[
              "Developed an AI-powered backend system for real-time meeting transcription and automated summarization.",
              "Implemented audio capture pipelines recording microphone and system audio simultaneously.",
              "Built WebSocket-based communication architecture for low-latency real-time streaming."
            ]}
            tags={['FastAPI', 'WebSockets', 'OpenAI']}
            link="https://github.com/TammineniTanay/Live-Wire-AI"
          />

          <ProjectCard 
            className="half"
            year="2024 // Computer Vision"
            title="Face Recognition Attendance"
            bullets={[
              "Built an automated face recognition attendance system processing live camera feeds in real time.",
              "Implemented multi-face detection and recognition pipelines identifying individuals from stored datasets.",
              "Reduced manual tracking effort through fully automated logging workflows."
            ]}
            tags={['Python', 'Computer Vision']}
            link="https://github.com/TammineniTanay/face-recognition-attendance-system"
          />

          <ProjectCard 
            className="third"
            year="2024"
            title="Vehicle Detection (PP-YOLO)"
            bullets={[
              "Implemented PP-YOLO-based object detection models for accurate vehicle identification.",
              "Applied bounding box detection and confidence scoring to evaluate prediction quality."
            ]}
            tags={['PP-YOLO', 'Deep Learning']}
            link="https://github.com/TammineniTanay/vehicle-detection-pp-yolo"
          />

          <ProjectCard 
            className="third"
            year="2024"
            title="Shamir's Secret Sharing"
            bullets={[
              "Implemented threshold cryptography using polynomial interpolation over finite fields.",
              "Built key splitting modules to distribute sensitive data across multiple secure shares."
            ]}
            tags={['Cryptography', 'Math']}
            link="https://github.com/TammineniTanay/Shamir-s-Secret-Sharing"
          />

          <ProjectCard 
            className="third"
            year="2023"
            title="Hospital Management System"
            bullets={[
              "Developed an MVC-based modular architecture handling patient records and doctor allocation.",
              "Built database-backed modules for patient registration and medical history tracking."
            ]}
            tags={['Java', 'MySQL', 'MVC']}
            link="https://github.com/TammineniTanay/hospital-management-system-ase"
          />

          <ProjectCard 
            className="half"
            year="2024"
            title="Earthquake Impact Prediction"
            bullets={[
              "Built cloud-based ML models to predict earthquake impact patterns from seismic datasets.",
              "Applied ensemble learning techniques to evaluate magnitude, depth, and impact zones.",
              "Visualized model results and trends through comprehensive analysis reports."
            ]}
            tags={['Scikit-learn', 'Cloud Computing']}
            link="https://github.com/TammineniTanay/Prredicting-the-Effects-of-Earthquakes-Using-Cloud-Based-ML"
          />

          <ProjectCard 
            className="half"
            year="2024"
            title="Machine Learning Coursework"
            bullets={[
              "Implemented core algorithms including Decision Trees, SVM, Logistic, and Ridge Regression.",
              "Built end-to-end data preprocessing pipelines for feature engineering and normalization.",
              "Applied Kernel PCA for dimensionality reduction across high-dimensional datasets."
            ]}
            tags={['Pandas', 'NumPy', 'Jupyter']}
            link="https://github.com/TammineniTanay/machine-learning-coursework"
          />

          <ProjectCard 
            className="third"
            year="2024"
            title="Distributed Cloud Computing"
            bullets={[
              "Designed workflows demonstrating parallel task execution across multiple nodes.",
              "Analyzed processing trade-offs including latency, throughput, and fault tolerance."
            ]}
            tags={['Distributed Systems', 'Cloud']}
            link="https://github.com/TammineniTanay/distributed-cloud-computing-project"
          />

          <ProjectCard 
            className="third"
            year="2024"
            title="APL Mini Interpreter"
            bullets={[
              "Built a custom interpreter implementing lexing, parsing, and expression evaluation.",
              "Applied recursive descent parsing to convert commands into executable instructions."
            ]}
            tags={['Python', 'Compiler Design']}
            link="https://github.com/TammineniTanay/apl-mini-language-interpreter"
          />

          <ProjectCard 
            className="third"
            year="2023"
            title="AI Maze Search"
            bullets={[
              "Implemented BFS, DFS, Greedy, and A* algorithms for optimal pathfinding.",
              "Benchmarked performance comparing search depth, visits, and path optimality."
            ]}
            tags={['Python', 'AI Algorithms']}
            link="https://github.com/TammineniTanay/ai-maze-search"
          />

          <ProjectCard 
            className="third"
            year="2025"
            title="IIoT Research Survey"
            bullets={[
              "Surveyed Intelligent IoT architectures covering edge computing and distributed intelligence.",
              "Analyzed 20+ publications on federated learning and real-time sensor communication."
            ]}
            tags={['Research', 'IoT', 'Edge AI']}
            link="https://github.com/TammineniTanay/research-methods-iiot-survey"
            linkText="View Research"
          />

          <ProjectCard 
            className="third"
            year="2024"
            title="HCI Case Studies"
            bullets={[
              "Conducted heuristic evaluations and think-aloud tests to identify interaction issues.",
              "Designed workflows and interface prototypes following user-centered design methodologies."
            ]}
            tags={['UX Design', 'Usability']}
            link="https://github.com/TammineniTanay/human-computer-interaction-projects"
            linkText="View Case Studies"
          />

          <ProjectCard 
            className="third"
            year="2023"
            title="Traffic Monitoring AI"
            bullets={[
              "AI-based vehicle detection system for analyzing and monitoring video streams.",
              "Extracted vehicle movement data from live traffic footage for smart city analytics."
            ]}
            tags={['OpenCV', 'Object Detection']}
            link="https://github.com/TammineniTanay/realtime-Vechile-Detection-using-AI"
          />

          <ProjectCard 
            className="half"
            year="2025"
            title="Developer Branding"
            bullets={[
              "Designed a professional GitHub profile README centralizing 15+ projects.",
              "Structured repository documentation with organized categories for clear navigation.",
              "Highlighted core technical skills to drastically improve recruiter discoverability."
            ]}
            tags={['GitHub', 'Markdown']}
            link="https://github.com/TammineniTanay/TammineniTanay"
            linkText="View Profile"
          />

          <ProjectCard 
            className="half"
            year="2026"
            title="Cyberpunk Portfolio"
            bullets={[
              "Developed a responsive personal portfolio website showcasing ML, AI, and systems engineering.",
              "Integrated complex 3D CSS physics, intersection observers, and custom framer-motion hooks.",
              "Deployed using modern Next.js architecture ensuring extreme performance and SEO."
            ]}
            tags={['React', 'Next.js', 'Tailwind']}
            link="https://github.com/TammineniTanay/portfolio"
            linkText="View Source"
          />

        </div>
      </section>

      {/* Skills & Experience Section */}
      <section id="experience" className="px-[5%] max-w-[1400px] mx-auto mb-32 grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Experience Timeline */}
        <div>
          <h2 className="text-4xl title-font mb-12 text-white"><span className="text-[#00e5ff] font-mono text-lg mr-4 block mb-2">02.</span>System Logs</h2>
          
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <span className="font-mono text-sm text-[#00e5ff]">Apr 2025 — Present</span>
            <h3 className="text-xl title-font text-white mt-2">AI Systems Developer Intern</h3>
            <h4 className="text-md text-[#5a6478] mb-4">Automate365</h4>
            <p className="text-sm text-[#e8eaf0]/70">Developing "LiveWire," a real-time AI sales co-pilot Chrome extension. Managing CI/CD pipelines and integrating low-latency OpenAI transcription models via WebSockets.</p>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <span className="font-mono text-sm text-[#00e5ff]">Jan 2024 — Dec 2025</span>
            <h3 className="text-xl title-font text-white mt-2">MS, Computer & Information Sciences</h3>
            <h4 className="text-md text-[#5a6478] mb-4">Southeast Missouri State University</h4>
            <p className="text-sm text-[#e8eaf0]/70">Graduated with a 3.9 GPA. Core focus on Advanced AI, Machine Learning, Distributed Cloud Computing, and Cybersecurity architectures.</p>
          </div>

          <div className="timeline-item" style={{ borderLeftColor: 'transparent' }}>
            <div className="timeline-dot"></div>
            <span className="font-mono text-sm text-[#00e5ff]">Aug 2019 — May 2023</span>
            <h3 className="text-xl title-font text-white mt-2">Bachelor of Engineering, Computer Science</h3>
            <h4 className="text-md text-[#5a6478] mb-4">India</h4>
            <p className="text-sm text-[#e8eaf0]/70">Foundational engineering coursework including Data Structures, Algorithms, Software Engineering, and Database Management Systems.</p>
          </div>
        </div>

        {/* Upgraded Technical Skills */}
        <div id="skills">
          <h2 className="text-4xl title-font mb-12 text-white"><span className="text-[#00e5ff] font-mono text-lg mr-4 block mb-2">03.</span>Capabilities</h2>
          
          <div id="skills-container">
            <div className="skill-group mb-8">
              <div className="flex justify-between font-mono text-sm mb-2"><span className="text-white">Python / C / Java / SQL</span><span className="text-[#00e5ff]">95%</span></div>
              <div className="skill-bar"><div className="skill-bar-fill" style={{ '--p': '95%' } as React.CSSProperties}></div></div>
            </div>

            <div className="skill-group mb-8">
              <div className="flex justify-between font-mono text-sm mb-2"><span className="text-white">Machine Learning (TensorFlow / Scikit)</span><span className="text-[#00e5ff]">90%</span></div>
              <div className="skill-bar"><div className="skill-bar-fill" style={{ '--p': '90%' } as React.CSSProperties}></div></div>
            </div>

            <div className="skill-group mb-8">
              <div className="flex justify-between font-mono text-sm mb-2"><span className="text-white">Computer Vision (OpenCV / YOLO)</span><span className="text-[#00e5ff]">88%</span></div>
              <div className="skill-bar"><div className="skill-bar-fill" style={{ '--p': '88%' } as React.CSSProperties}></div></div>
            </div>

            <div className="skill-group mb-8">
              <div className="flex justify-between font-mono text-sm mb-2"><span className="text-white">Cloud & Web (AWS / FastAPI / React)</span><span className="text-[#00e5ff]">85%</span></div>
              <div className="skill-bar"><div className="skill-bar-fill" style={{ '--p': '85%' } as React.CSSProperties}></div></div>
            </div>

            <div className="skill-group mb-8">
              <div className="flex justify-between font-mono text-sm mb-2"><span className="text-white">Cryptography & Cybersecurity</span><span className="text-[#00e5ff]">80%</span></div>
              <div className="skill-bar"><div className="skill-bar-fill" style={{ '--p': '80%' } as React.CSSProperties}></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact (Bottom Line Removed) */}
      <footer className="pt-10 pb-10 text-center relative overflow-hidden">
        <div className="glow-orb orb-2" style={{ top: '0', left: '50%', transform: 'translateX(-50%)' }}></div>
        <h2 className="text-[clamp(2rem,5vw,4rem)] title-font mb-8 text-white">INITIATE_CONTACT</h2>
        <a href="mailto:tanaytammineni22@gmail.com" className="btn primary text-lg px-12 py-4 mb-20 relative z-50">tanaytammineni22@gmail.com</a>
        <div className="flex justify-center gap-6 font-mono text-sm text-[#5a6478] uppercase relative z-50">
          <a href="https://www.linkedin.com/in/tanay-tammineni-ba6a9918b/" className="hover:text-[#00e5ff] transition-colors cursor-pointer">LinkedIn</a>
          <a href="https://github.com/TammineniTanay" className="hover:text-[#00e5ff] transition-colors cursor-pointer">GitHub</a>
        </div>
      </footer>
    </>
  );
}