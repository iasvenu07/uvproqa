import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Play, ShieldAlert, Cpu, CheckCircle2, AlertTriangle, RefreshCw, Layers } from "lucide-react";

interface TerminalLine {
  text: string;
  type: "input" | "output" | "error" | "success" | "warning" | "header";
  delay?: number;
}

export default function TerminalSandbox() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: "System diagnostic tool initialized.", type: "header" },
    { text: "Type 'help' or click one of the automated scripts below to execute QA test suites on Venugopal's portfolio.", type: "output" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const addLinesWithDelay = async (lines: TerminalLine[]) => {
    setIsRunning(true);
    for (const line of lines) {
      await new Promise((resolve) => setTimeout(resolve, line.delay || 150));
      setHistory((prev) => [...prev, { text: line.text, type: line.type }]);
    }
    setIsRunning(false);
  };

  const executeCommand = async (command: string) => {
    if (isRunning) return;
    const trimmed = command.trim().toLowerCase();
    setHistory((prev) => [...prev, { text: `visitor@portfolio:~$ ${command}`, type: "input" }]);

    if (trimmed === "clear") {
      setHistory([]);
      return;
    }

    if (trimmed === "help") {
      setHistory((prev) => [
        ...prev,
        { text: "Available QA commands:", type: "header" },
        { text: "  run-tests          - Run full Python/unittest test cases on Venugopal's portfolio", type: "output" },
        { text: "  api-inspect        - Probe Venugopal's profile REST API & validate contract schema", type: "output" },
        { text: "  agent-diagnostics  - Launch Oracle Agentic AI Reasoning loop simulation", type: "output" },
        { text: "  cloud-scan         - Validate AWS & Microsoft Azure deployment rules", type: "output" },
        { text: "  clear              - Clear terminal log", type: "output" }
      ]);
      return;
    }

    if (trimmed === "run-tests" || trimmed === "pytest") {
      const suite: TerminalLine[] = [
        { text: "Launching test automation suite: python -m unittest discover -s tests/", type: "warning", delay: 100 },
        { text: "────────────────────────────────────────────────────────", type: "output", delay: 50 },
        { text: "test_manual_methodology (test_resume.TestSkills) ... ok [0.04s]", type: "success", delay: 300 },
        { text: "test_python_unittest (test_resume.TestSkills) ... ok [0.08s]", type: "success", delay: 250 },
        { text: "test_api_contract_validation (test_api.TestEndpoint) ... ok [0.12s]", type: "success", delay: 400 },
        { text: "test_aws_s3_bucket_acl (test_cloud.TestSecurity) ... ok [0.05s]", type: "success", delay: 200 },
        { text: "test_agentic_ai_decision_tree (test_agent.TestOracle) ... ok [0.22s]", type: "success", delay: 500 },
        { text: "test_responsive_ui_compat (test_web.TestCrossBrowser) ... ok [0.15s]", type: "success", delay: 300 },
        { text: "────────────────────────────────────────────────────────", type: "output", delay: 50 },
        { text: "Ran 6 tests in 1.442s", type: "header", delay: 100 },
        { text: "OK (PASSED=6, FAILED=0, WARNINGS=0) - 100% Test Coverage", type: "success", delay: 100 }
      ];
      await addLinesWithDelay(suite);
      return;
    }

    if (trimmed === "api-inspect" || trimmed === "curl") {
      const suite: TerminalLine[] = [
        { text: "curl -X GET https://api.ummadisetty.com/v1/profile -H 'Accept: application/json'", type: "warning", delay: 100 },
        { text: "HTTP/2 200 OK", type: "success", delay: 200 },
        { text: "Content-Type: application/json; charset=utf-8", type: "output", delay: 50 },
        { text: "Cache-Control: public, max-age=3600", type: "output", delay: 50 },
        { text: "X-Security-Compliant: OWASP-Top-10-Pass", type: "success", delay: 100 },
        { text: "{", type: "output", delay: 100 },
        { text: '  "candidate": "Venugopal Ummadisetty",', type: "output", delay: 50 },
        { text: '  "role": "QA Automation & Software Tester",', type: "output", delay: 50 },
        { text: '  "certifications": [', type: "output", delay: 50 },
        { text: '    "Oracle Agentic AI Certified Foundations Associate",', type: "output", delay: 50 },
        { text: '    "Oracle Cloud Infrastructure Certified Architect Associate",', type: "output", delay: 50 },
        { text: '    "Microsoft Certified: Azure Developer Associate"', type: "output", delay: 50 },
        { text: "  ],", type: "output", delay: 50 },
        { text: '  "status": "Available for Quality-Driven Engineering Teams"', type: "success", delay: 100 },
        { text: "}", type: "output", delay: 100 },
        { text: "Schema validation: PASSED. Contract assertions: 100% Correct.", type: "success", delay: 150 }
      ];
      await addLinesWithDelay(suite);
      return;
    }

    if (trimmed === "agent-diagnostics") {
      const suite: TerminalLine[] = [
        { text: "Initializing Agentic AI Reasoner Loop... (Oracle Certified Foundations)", type: "warning", delay: 150 },
        { text: "[Agent] System state: App has form inputs, API gateways, and cloud persistence.", type: "output", delay: 250 },
        { text: "[Agent] Task: Validate Contact form submission security against XSS injection.", type: "output", delay: 300 },
        { text: "[Agent] Executing heuristic reasoning steps...", type: "output", delay: 200 },
        { text: "  Step 1: Injecting mock payloads: '<script>alert(1)</script>' into fields... ", type: "output", delay: 400 },
        { text: "  Result: Backend server validation blocked execution (400 Bad Request). Safe.", type: "success", delay: 350 },
        { text: "  Step 2: Testing SQL Injection vectors on parameters...", type: "output", delay: 400 },
        { text: "  Result: Parametrization & ORM layers neutralized payloads. Safe.", type: "success", delay: 350 },
        { text: "[Agent] Diagnostics complete. Recommendation: Deploy Web Application Firewall.", type: "header", delay: 300 },
        { text: "Status: SECURE. Reasoning certainty: 99.4%", type: "success", delay: 150 }
      ];
      await addLinesWithDelay(suite);
      return;
    }

    if (trimmed === "cloud-scan") {
      const suite: TerminalLine[] = [
        { text: "Establishing secure shell connection to Cloud Infrastructure Scan Engine...", type: "warning", delay: 150 },
        { text: "Connected. Scanning AWS and Microsoft Azure configs...", type: "output", delay: 200 },
        { text: "  [AWS S3] Bucket Encryption validation ... ENABLED (AES-256)", type: "success", delay: 300 },
        { text: "  [AWS EC2] Public ingress rules check ... PASSED (Port 22 disabled)", type: "success", delay: 250 },
        { text: "  [Azure VM] Network Security Group (NSG) compliance ... PASSED", type: "success", delay: 300 },
        { text: "  [Azure KeyVault] Secrets access auditing ... ACTIVE", type: "success", delay: 200 },
        { text: "  [Docker] Container layer image vulnerability scan ... 0 critical, 2 low", type: "warning", delay: 400 },
        { text: "Cloud configuration aligns with OCI Architecture Best Practices.", type: "header", delay: 200 },
        { text: "Infrastructure Audit: 100% COMPLIANT", type: "success", delay: 100 }
      ];
      await addLinesWithDelay(suite);
      return;
    }

    setHistory((prev) => [
      ...prev,
      { text: `Command not found: '${command}'. Type 'help' to see list of valid scripts.`, type: "error" }
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      executeCommand(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="w-full bg-[#0c0c0c] text-slate-300 font-mono text-sm border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px] backdrop-blur-xl">
      {/* Title Bar */}
      <div className="bg-black/30 px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="text-xs text-slate-400 ml-2 font-mono flex items-center gap-1.5">
            <Terminal size={12} className="text-indigo-400" />
            qa-pipeline-sandbox.py
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-0.5 rounded text-[11px] text-emerald-400 border border-emerald-500/15 font-medium">
          <CheckCircle2 size={11} />
          SYSTEM STABLE
        </div>
      </div>

      {/* Output Console */}
      <div className="flex-1 p-5 overflow-y-auto space-y-2.5">
        <AnimatePresence>
          {history.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={`leading-relaxed break-words whitespace-pre-wrap ${
                line.type === "input" ? "text-indigo-400 font-semibold" :
                line.type === "error" ? "text-rose-400 font-medium" :
                line.type === "success" ? "text-emerald-400" :
                line.type === "warning" ? "text-amber-400" :
                line.type === "header" ? "text-slate-200 font-bold border-b border-white/5 pb-0.5" :
                "text-slate-400"
              }`}
            >
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={terminalEndRef} />
      </div>

      {/* Suggested Quick Triggers */}
      <div className="bg-black/40 p-3 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={() => executeCommand("run-tests")}
          disabled={isRunning}
          className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-[9px] uppercase tracking-widest text-emerald-400 py-1.5 px-2 rounded-lg border border-white/10 cursor-pointer font-bold transition-all"
        >
          <Play size={12} />
          Run QA Test Suite
        </button>
        <button
          onClick={() => executeCommand("api-inspect")}
          disabled={isRunning}
          className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-[9px] uppercase tracking-widest text-indigo-400 py-1.5 px-2 rounded-lg border border-white/10 cursor-pointer font-bold transition-all"
        >
          <Layers size={12} />
          Inspect Profile API
        </button>
        <button
          onClick={() => executeCommand("agent-diagnostics")}
          disabled={isRunning}
          className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-[9px] uppercase tracking-widest text-purple-400 py-1.5 px-2 rounded-lg border border-white/10 cursor-pointer font-bold transition-all"
        >
          <Cpu size={12} />
          Agentic AI Sandbox
        </button>
        <button
          onClick={() => executeCommand("cloud-scan")}
          disabled={isRunning}
          className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-[9px] uppercase tracking-widest text-amber-400 py-1.5 px-2 rounded-lg border border-white/10 cursor-pointer font-bold transition-all"
        >
          <ShieldAlert size={12} />
          Scan Cloud Rules
        </button>
      </div>

      {/* Terminal Input Bar */}
      <div className="bg-black/60 px-4 py-3.5 border-t border-white/5 flex items-center space-x-2">
        <span className="text-indigo-400 font-bold shrink-0">visitor@portfolio:~$</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isRunning}
          placeholder={isRunning ? "Test suite compiling & executing..." : "Type command (e.g. 'help', 'clear', 'pytest')..."}
          className="flex-1 bg-transparent text-slate-200 outline-none border-none caret-indigo-400 font-mono text-sm placeholder-slate-700 disabled:opacity-50"
        />
        {isRunning && (
          <RefreshCw size={14} className="text-indigo-400 animate-spin shrink-0" />
        )}
      </div>
    </div>
  );
}
