import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal as TerminalIcon, Sparkles, User, Briefcase, Award, Mail, 
  Moon, Sun, Download, ShieldAlert, Cpu, CheckCircle2, 
  MapPin, ExternalLink, GraduationCap, Code, Layers, FileSpreadsheet, 
  ChevronRight, Play, Info, AlertTriangle, Bug, ThumbsUp, Github, Linkedin
} from "lucide-react";

import TerminalSandbox from "./components/TerminalSandbox";
import AiTwinChat from "./components/AiTwinChat";
import DashboardMetrics from "./components/DashboardMetrics";
import ContactForm from "./components/ContactForm";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentRole, setCurrentRole] = useState<"Guest" | "Lead" | "Admin">("Guest");
  const [buggyMode, setBuggyMode] = useState(false);
  const [bugsFound, setBugsFound] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Interactive QA Bug Hunt Game
  const handleFindBug = (bugId: string) => {
    if (!bugsFound.includes(bugId)) {
      const updated = [...bugsFound, bugId];
      setBugsFound(updated);
      
      // Audit Log trigger simulation in backend
      fetch("/api/logs", {
        method: "GET",
        headers: { "x-role": "Admin" } // Quietly logs the interactive audit in system
      }).catch(() => {});

      if (updated.length === 3) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white transition-colors duration-300 relative selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      
      {/* Immersive UI Background Glow Overlays */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* QA Bug Hunt Floating Status Panel (Extraordinary QA Gamification!) */}
      {buggyMode && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#0c0c0c] border border-amber-500/30 shadow-2xl p-4 rounded-xl max-w-xs animate-bounce backdrop-blur-md">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Bug size={14} className="animate-spin" />
            <span>QA ACTIVE: FIND 3 INJECTED BUGS</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            We injected 3 visual/UI flaws. Find and click them to trigger Venugopal's testing suite!
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            {[1, 2, 3].map((idx) => (
              <span 
                key={idx} 
                className={`w-3.5 h-3.5 rounded-full border text-[9px] font-bold flex items-center justify-center ${
                  bugsFound.includes(`bug-${idx}`) 
                    ? "bg-emerald-500 text-white border-emerald-500" 
                    : "bg-white/5 border-white/20 text-gray-400"
                }`}
              >
                {bugsFound.includes(`bug-${idx}`) ? "✓" : idx}
              </span>
            ))}
            <span className="text-[10px] ml-1 text-gray-400 font-medium">
              {bugsFound.length}/3 Found
            </span>
          </div>
          {bugsFound.length === 3 && (
            <div className="mt-2.5 text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 p-1.5 rounded">
              <CheckCircle2 size={11} />
              All bugs caught! Resume verified.
            </div>
          )}
        </div>
      )}

      {/* Header / Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-black/40 border-b border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-lg flex items-center justify-center text-black font-black text-lg">
              U
            </div>
            <div>
              <span className="text-sm font-bold text-white block tracking-tighter uppercase">
                Venugopal Ummadisetty
              </span>
              <span className="text-[10px] text-indigo-400 block font-mono uppercase tracking-[0.2em] font-semibold">
                QA Specialist & SDET
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-[11px] uppercase tracking-[0.2em] font-medium text-slate-400">
            <a href="#summary" className="hover:text-white transition-colors">Summary</a>
            <a href="#sandbox" className="hover:text-white transition-colors">QA Sandbox</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#timeline" className="hover:text-white transition-colors">Work History</a>
            <a href="#certifications" className="hover:text-white transition-colors">Achievements</a>
            <a href="#metrics" className="hover:text-white transition-colors">Telemetry Logs</a>
            <a href="#contact" className="hover:text-white transition-colors">Connect</a>
          </nav>

          {/* Utility Buttons */}
          <div className="flex items-center space-x-3">
            {/* QA Bug Toggle */}
            <button
              onClick={() => {
                setBuggyMode(!buggyMode);
                setBugsFound([]);
              }}
              className={`px-4 py-2 rounded-full border text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 font-bold cursor-pointer ${
                buggyMode 
                  ? "bg-indigo-600 border-indigo-600 text-white" 
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
              title="Toggle QA Buggy Mode to locate injected flaws"
            >
              <Bug size={12} className={buggyMode ? "animate-spin" : ""} />
              <span className="hidden sm:inline">QA Bug Hunting</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer text-slate-300"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Resume Download */}
            <a
              href="mailto:ugopalv7@gmail.com?subject=Inquiry about Venugopal's Resume"
              className="bg-white text-black hover:bg-indigo-500 hover:text-white px-5 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 shrink-0"
            >
              <Download size={12} />
              <span>Contact SDE</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Text Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20 text-[10px] font-mono tracking-[0.2em] text-indigo-400 uppercase">
              <Sparkles size={11} className="animate-spin" style={{ animationDuration: '3s' }} />
              <span>Oracle Agentic AI & Cloud Architect Certified</span>
            </div>

            {/* Injected Bug 1 (Upside down title letter or text only visible when buggyMode active) */}
            <div className="relative">
              {buggyMode && !bugsFound.includes("bug-1") && (
                <div 
                  onClick={() => handleFindBug("bug-1")}
                  className="absolute -top-3 left-4 bg-rose-500/10 border border-rose-500 text-rose-500 text-[10px] py-0.5 px-1.5 rounded cursor-pointer animate-pulse font-bold z-10"
                >
                  ⚠ UI DEFECT DETECTED: Tap to validate
                </div>
              )}
              <h1 className={`text-4xl md:text-5xl lg:text-[76px] font-black leading-[0.9] tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500 ${
                buggyMode && !bugsFound.includes("bug-1") ? "rotate-1 cursor-pointer bg-amber-500/5 p-1 border-dashed border-amber-500" : ""
              }`}>
                Building <br/>
                <span className="text-white">Flawless QA</span> <br/>
                Pipelines.
              </h1>
            </div>

            <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-xl">
              Hello, I'm <strong className="text-white font-bold">Venugopal Ummadisetty</strong>. I design automated test ecosystems, validate API integrity, scan cloud architecture, and specialize in Agentic AI reasoning systems. M.Tech in Computer Science and an avid QA specialist.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full shadow-sm text-slate-300">
                <MapPin size={12} className="text-indigo-400" />
                Andhra Pradesh, India
              </span>
              <span className="flex items-center gap-1 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full shadow-sm text-slate-300">
                <GraduationCap size={12} className="text-indigo-400" />
                M.Tech CS Candidate (JNTUA)
              </span>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="#sandbox"
                className="bg-white text-black px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2"
              >
                <Play size={12} />
                Launch QA Pipeline
              </a>
              <a
                href="#contact"
                className="border border-white/20 px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all text-white flex items-center gap-1.5"
              >
                Let's Partner
                <ChevronRight size={13} />
              </a>
            </div>

            <div className="flex flex-wrap gap-12 pt-8 border-t border-white/5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-mono">Core Competency</p>
                <p className="text-sm font-medium text-white">System Testing & QA</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-mono">Certifications</p>
                <p className="text-sm font-medium text-white">Oracle Agentic AI, Azure</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-mono">Infrastructure</p>
                <p className="text-sm font-medium text-white">AWS Cloud, Docker, CI/CD</p>
              </div>
            </div>
          </div>

          {/* Hero Right Avatar/Mock Stats */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-1.5 overflow-hidden shadow-2xl">
              <div className="bg-[#0c0c0c] rounded-[22px] overflow-hidden border border-white/5 relative p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">v1.0.4_STABLE</span>
                </div>

                <div className="h-36 w-full bg-indigo-500/10 rounded-xl border border-white/5 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-20"></div>
                  <div className="relative flex flex-col items-center justify-center">
                    <Award size={36} className="text-indigo-400 animate-pulse mb-2" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">M.Tech Computer Science</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono font-bold">QA Certification Board</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Oracle Agentic AI & cloud infrastructure scanning (AWS/Azure) to optimize distributed software delivery cycles.
                  </p>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-3">
                  <div className="h-12 bg-white/5 rounded-lg border border-white/5 flex flex-col justify-center px-3">
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider font-mono">Assertion Score</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">100% Pass</span>
                  </div>
                  <div className="h-12 bg-white/5 rounded-lg border border-white/5 flex flex-col justify-center px-3">
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider font-mono">Lead SLA</span>
                    <span className="text-xs font-mono text-white">Sub-24h</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 100% Stable Badge */}
            <div className="absolute -right-4 -bottom-4 bg-indigo-600 text-white p-4 rounded-2xl shadow-xl border border-white/20 z-20 flex flex-col items-center justify-center rotate-6">
              <span className="text-xl font-black font-mono">100%</span>
              <span className="text-[8px] uppercase tracking-widest font-bold opacity-90">Stable</span>
            </div>
          </div>

        </div>
      </section>

      {/* Professional Summary Section */}
      <section id="summary" className="py-20 border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <span className="text-xs text-indigo-400 font-mono tracking-[0.3em] uppercase">Professional Summary</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500">
              QA Analytical Thinking
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
              Applying highly meticulous test scenarios, defect life-cycle management, and cloud infrastructure verification methodologies developed during internships at Chegg, BrainoVision, and CodSoft.
            </p>
          </div>

          {/* Highlights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 hover:border-white/20 transition-all shadow-xl group">
              <span className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform">
                <Code size={20} />
              </span>
              <h4 className="text-base font-bold text-white uppercase tracking-wider font-mono">SDLC & STLC Alignment</h4>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                Expertise designing complex test plans, implementing robust boundary value assertions, and managing defects seamlessly from discovery to patching.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 hover:border-white/20 transition-all shadow-xl group">
              <span className="p-3 bg-blue-500/10 text-blue-400 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform">
                <Layers size={20} />
              </span>
              <h4 className="text-base font-bold text-white uppercase tracking-wider font-mono">Multimodal API testing</h4>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                Proficient validating REST contracts, payloads schema structure, header validation, and response latency SLAs via Postman & custom scripting.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 hover:border-white/20 transition-all shadow-xl group">
              <span className="p-3 bg-purple-500/10 text-purple-400 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform">
                <Cpu size={20} />
              </span>
              <h4 className="text-base font-bold text-white uppercase tracking-wider font-mono">Agentic AI & DevOps</h4>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                Certified OCI Foundations Architect & Oracle Agentic AI Associate, bridging manual verification with automated LLM reasoning scripts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QA Sandbox Sandbox Interactive Dual Console (Extraordinary Component) */}
      <section id="sandbox" className="py-20 max-w-7xl mx-auto px-6 border-b border-white/5 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <span className="text-xs text-indigo-400 font-mono tracking-[0.3em] uppercase">Extraordinary Interactive Showcase</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500">
            QA Sandbox & AI Twin
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
            Run real-time testing assertions on Venugopal's profile using the terminal simulator on the left, or interview his intelligent Gemini 3.8 AI twin on the right.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <TerminalSandbox />
          <AiTwinChat />
        </div>
      </section>

      {/* Technical Skills Map */}
      <section id="skills" className="py-20 border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14 text-left">
            <span className="text-xs text-indigo-400 font-mono tracking-[0.3em] uppercase">Technical Expertise</span>
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500 mt-1">
              Verification & Testing Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Box 1 */}
            <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:border-indigo-500/20 transition-all shadow-lg space-y-4">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">Manual Testing</h4>
              <ul className="space-y-3 text-xs font-medium text-slate-400">
                <li className="flex items-center gap-1.5">✓ Test Case Design</li>
                <li className="flex items-center gap-1.5">✓ Regression & Smoke Tests</li>
                <li className="flex items-center gap-1.5">✓ UAT Execution</li>
                <li className="flex items-center gap-1.5">✓ Defect Lifecycle (Bug tracking)</li>
              </ul>
            </div>

            {/* Box 2 */}
            <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:border-indigo-500/20 transition-all shadow-lg space-y-4">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">Automation Testing</h4>
              <ul className="space-y-3 text-xs font-medium text-slate-400">
                <li className="flex items-center gap-1.5">✓ Python (unittest framework)</li>
                <li className="flex items-center gap-1.5">✓ Basic Selenium Concepts</li>
                <li className="flex items-center gap-1.5">✓ Bash Shell Scripting</li>
                <li className="flex items-center gap-1.5">✓ GitHub Version Controls</li>
              </ul>
            </div>

            {/* Box 3 */}
            <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:border-indigo-500/20 transition-all shadow-lg space-y-4">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">API & Databases</h4>
              <ul className="space-y-3 text-xs font-medium text-slate-400">
                <li className="flex items-center gap-1.5">✓ Postman API client</li>
                <li className="flex items-center gap-1.5">✓ Payload Contract asserts</li>
                <li className="flex items-center gap-1.5">✓ SQL query diagnostics</li>
                <li className="flex items-center gap-1.5">✓ BigQuery Analytics</li>
              </ul>
            </div>

            {/* Box 4 */}
            <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:border-indigo-500/20 transition-all shadow-lg space-y-4">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">Cloud & Platforms</h4>
              <ul className="space-y-3 text-xs font-medium text-slate-400">
                <li className="flex items-center gap-1.5">✓ AWS (EC2 config, S3 validation)</li>
                <li className="flex items-center gap-1.5">✓ Microsoft Azure SDKs</li>
                <li className="flex items-center gap-1.5">✓ Docker container isolation</li>
                <li className="flex items-center gap-1.5">✓ Red Hat / Linux OS core</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="timeline" className="py-20 max-w-7xl mx-auto px-6 border-b border-white/5 relative z-10">
        <div className="max-w-2xl mb-14">
          <span className="text-xs text-indigo-400 font-mono tracking-[0.3em] uppercase">Work History</span>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500 mt-1">
            QA Internship Timeline
          </h2>
        </div>

        <div className="relative border-l border-white/10 pl-6 space-y-12 max-w-4xl">
          {/* Item 1 */}
          <div className="relative">
            <span className="absolute -left-[31px] top-1.5 h-4.5 w-4.5 rounded-full bg-indigo-500 border-4 border-[#050505]"></span>
            <div>
              <span className="text-[10px] bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 font-mono font-bold px-2.5 py-1 rounded-md">
                Mar 2024 – Nov 2024
              </span>
              <h4 className="text-lg font-bold text-white mt-3 font-mono">
                Subject Matter Expert – Computer Science | <span className="text-indigo-400">Chegg Inc.</span>
              </h4>
              <ul className="list-disc list-inside space-y-2 text-xs text-slate-400 mt-3 leading-relaxed">
                <li>Reviewed and validated over 500+ technical CS solutions, verifying precision, algorithm complexity, and layout correctness.</li>
                <li>Authored and applied strict diagnostic checklist spreadsheets to prevent structural solution defects.</li>
                <li>Analyzed inconsistencies in documentation logs, reporting anomalies to internal platforms.</li>
              </ul>
            </div>
          </div>

          {/* Item 2 */}
          <div className="relative">
            <span className="absolute -left-[31px] top-1.5 h-4.5 w-4.5 rounded-full bg-indigo-500 border-4 border-[#050505]"></span>
            <div>
              <span className="text-[10px] bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 font-mono font-bold px-2.5 py-1 rounded-md">
                Dec 2023 – May 2024
              </span>
              <h4 className="text-lg font-bold text-white mt-3 font-mono">
                AWS Cloud Infrastructure Intern | <span className="text-indigo-400">BrainoVision Solutions</span>
              </h4>
              <ul className="list-disc list-inside space-y-2 text-xs text-slate-400 mt-3 leading-relaxed">
                <li>Audited cloud service credentials, resource scopes, and EC2 ingress/egress firewalls to enforce IAM compliance.</li>
                <li>Identified AWS S3 misconfigurations, optimizing bucket encryption schemas.</li>
                <li>Validated cloud infrastructure deployment scripts, documenting environment gaps.</li>
              </ul>
            </div>
          </div>

          {/* Item 3 */}
          <div className="relative">
            <span className="absolute -left-[31px] top-1.5 h-4.5 w-4.5 rounded-full bg-indigo-500 border-4 border-[#050505]"></span>
            <div>
              <span className="text-[10px] bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 font-mono font-bold px-2.5 py-1 rounded-md">
                Jun 2023 – Nov 2023
              </span>
              <h4 className="text-lg font-bold text-white mt-3 font-mono">
                Web Development Intern | <span className="text-indigo-400">CodSoft</span>
              </h4>
              <ul className="list-disc list-inside space-y-2 text-xs text-slate-400 mt-3 leading-relaxed">
                <li>Conducted rigorous cross-browser responsive design testing (Chrome, Safari, Firefox), documenting critical CSS rendering blocks.</li>
                <li>Created bug-tracking logs, managing validation tickets through code diagnostics.</li>
                <li>Integrated web modules with Git version control, maintaining code security.</li>
              </ul>
            </div>
          </div>

          {/* Item 4 */}
          <div className="relative">
            <span className="absolute -left-[31px] top-1.5 h-4.5 w-4.5 rounded-full bg-indigo-500 border-4 border-[#050505]"></span>
            <div>
              <span className="text-[10px] bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 font-mono font-bold px-2.5 py-1 rounded-md">
                Mar 2022 – Mar 2023
              </span>
              <h4 className="text-lg font-bold text-white mt-3 font-mono">
                Machine Learning Intern | <span className="text-indigo-400">Verzeo</span>
              </h4>
              <ul className="list-disc list-inside space-y-2 text-xs text-slate-400 mt-3 leading-relaxed">
                <li>Validated raw data schemas for medical records, stripping anomaly records before training.</li>
                <li>Measured machine learning classification models using Precision, Recall, and Accuracy F1 scores.</li>
                <li>Coded automated Python scripts to validate data consistency in ingestion pipelines.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Grid Section */}
      <section id="certifications" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <span className="text-xs text-indigo-400 font-mono tracking-[0.3em] uppercase">Verified Achievements</span>
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500 mt-1">
              Credentials & Achievements
            </h2>
          </div>

          {/* Bento-style Certification Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#0c0c0c] border border-white/5 p-5 rounded-2xl shadow-sm hover:border-indigo-500/30 transition-all flex items-start gap-4">
              <span className="p-3 bg-indigo-500/15 text-indigo-400 rounded-xl shrink-0">
                <Cpu size={20} />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Oracle AI</h4>
                <h5 className="text-sm font-bold text-white mt-1">Agentic AI Certified Associate</h5>
                <p className="text-[11px] text-slate-400 mt-1.5">Oracle Agentic AI Certified Foundations Associate</p>
              </div>
            </div>

            <div className="bg-[#0c0c0c] border border-white/5 p-5 rounded-2xl shadow-sm hover:border-indigo-500/30 transition-all flex items-start gap-4">
              <span className="p-3 bg-indigo-500/15 text-indigo-400 rounded-xl shrink-0">
                <Layers size={20} />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Oracle Cloud</h4>
                <h5 className="text-sm font-bold text-white mt-1">OCI Architect Associate</h5>
                <p className="text-[11px] text-slate-400 mt-1.5">Oracle Cloud Infrastructure Certified Architect</p>
              </div>
            </div>

            <div className="bg-[#0c0c0c] border border-white/5 p-5 rounded-2xl shadow-sm hover:border-indigo-500/30 transition-all flex items-start gap-4">
              <span className="p-3 bg-indigo-500/15 text-indigo-400 rounded-xl shrink-0">
                <Code size={20} />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Microsoft Azure</h4>
                <h5 className="text-sm font-bold text-white mt-1">Azure Developer Associate</h5>
                <p className="text-[11px] text-slate-400 mt-1.5">Microsoft Certified Developer (AZ-204)</p>
              </div>
            </div>

            <div className="bg-[#0c0c0c] border border-white/5 p-5 rounded-2xl shadow-sm hover:border-indigo-500/30 transition-all flex items-start gap-4">
              <span className="p-3 bg-indigo-500/15 text-indigo-400 rounded-xl shrink-0">
                <FileSpreadsheet size={20} />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Microsoft Azure</h4>
                <h5 className="text-sm font-bold text-white mt-1">MLOps Engineer Associate</h5>
                <p className="text-[11px] text-slate-400 mt-1.5">Machine Learning Operations Specialist</p>
              </div>
            </div>

            <div className="bg-[#0c0c0c] border border-white/5 p-5 rounded-2xl shadow-sm hover:border-indigo-500/30 transition-all flex items-start gap-4">
              <span className="p-3 bg-indigo-500/15 text-indigo-400 rounded-xl shrink-0">
                <Award size={20} />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Google Cloud</h4>
                <h5 className="text-sm font-bold text-white mt-1">Arcade Facilitator Legend</h5>
                <p className="text-[11px] text-slate-400 mt-1.5">GCP Facilitator - Arcade Legend Tier achieved</p>
              </div>
            </div>

            {/* Injected Bug 3 (Injected upside down Icon when buggyMode active) */}
            <div className={`bg-[#0c0c0c] border border-white/5 p-5 rounded-2xl shadow-sm transition-all flex items-start gap-4 ${
              buggyMode && !bugsFound.includes("bug-3") ? "bg-amber-500/5 border-dashed border-amber-500" : ""
            }`}>
              <span 
                onClick={() => buggyMode && handleFindBug("bug-3")}
                className={`p-3 bg-rose-500/10 text-rose-400 rounded-xl shrink-0 ${
                  buggyMode && !bugsFound.includes("bug-3") ? "rotate-180 animate-ping cursor-pointer" : ""
                }`}
              >
                <Award size={20} />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Competitions</h4>
                <h5 className="text-sm font-bold text-white mt-1">Quiz Champion Winner</h5>
                <p className="text-[11px] text-slate-400 mt-1.5">Recognized for strong analytical & debug reasoning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin metrics dashboard Section */}
      <section id="metrics" className="py-20 max-w-7xl mx-auto px-6 border-b border-white/5 relative z-10">
        <DashboardMetrics currentRole={currentRole} onChangeRole={setCurrentRole} />
      </section>

      {/* Contact Proposal Lead capturing Form Section */}
      <section id="contact" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs text-indigo-400 font-mono tracking-[0.3em] uppercase">Secure Leads Intake</span>
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500">
              Start Collaboration
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Have a testing strategy to discuss, or looking for an automated testing professional to scale your QA pipeline reliability? Submit a secure, fully validated lead.
            </p>
            <div className="space-y-3.5 pt-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-white/5 border border-white/10 text-indigo-400 rounded-xl shrink-0">
                  <Mail size={14} />
                </span>
                <span className="font-semibold text-slate-200 select-all font-mono">ugopalv7@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-white/5 border border-white/10 text-indigo-400 rounded-xl shrink-0">
                  <MapPin size={14} />
                </span>
                <span className="font-semibold text-slate-200">Andhra Pradesh, India</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md py-12 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
          <div className="flex items-center justify-center md:justify-start gap-5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
              <span className="text-slate-300 font-mono text-[10px]">Operational: Mainnet</span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <div>Tests: Passed</div>
          </div>
          <div className="flex items-center justify-center gap-6">
            <a href="https://linkedin.com/in/ias07" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Linkedin size={13} />
              LinkedIn
            </a>
            <a href="mailto:ugopalv7@gmail.com" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Mail size={13} />
              Email
            </a>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <p className="font-mono text-slate-500 lowercase">©2026 designed_for_scalability</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
