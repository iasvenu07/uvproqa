import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShieldAlert, Cpu, HardDrive, Key, UserCheck, Activity, Terminal, RefreshCw, Users, Mail, Phone, Calendar, Clock, AlertCircle } from "lucide-react";
import { AuditLog, ContactSubmission, SystemMetrics } from "../types";
import ActivityHeatmap from "./ActivityHeatmap";

interface DashboardMetricsProps {
  currentRole: "Guest" | "Lead" | "Admin";
  onChangeRole: (role: "Guest" | "Lead" | "Admin") => void;
}

export default function DashboardMetrics({ currentRole, onChangeRole }: DashboardMetricsProps) {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [leads, setLeads] = useState<ContactSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<"metrics" | "logs" | "leads">("metrics");
  const [accessDeniedMsg, setAccessDeniedMsg] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/system-health");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Failed to fetch system metrics", err);
    }
  };

  const fetchLogsAndLeads = async (roleToUse: string = currentRole) => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/logs", {
        headers: {
          "x-role": roleToUse
        }
      });

      if (res.status === 403) {
        const errData = await res.json();
        setAccessDeniedMsg(errData.error);
        setLogs([]);
        setLeads([]);
      } else if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setLeads(data.submissions);
        setAccessDeniedMsg(null);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000); // refresh system metrics every 3 seconds

    if (currentRole === "Admin" || activeTab !== "metrics") {
      fetchLogsAndLeads();
    } else {
      setAccessDeniedMsg(null);
    }

    return () => clearInterval(interval);
  }, [currentRole, activeTab]);

  const handleTabChange = (tab: "metrics" | "logs" | "leads") => {
    setActiveTab(tab);
    if (tab !== "metrics" && currentRole !== "Admin") {
      setAccessDeniedMsg("ACCESS DENIED: Standard user tier does not have administrative clearance. Switch your session role to 'Admin' in the control panel to view raw audit trails and collected leads.");
    } else {
      setAccessDeniedMsg(null);
      fetchLogsAndLeads();
    }
  };

  const handleSimulateAlert = () => {
    if (currentRole !== "Admin") {
      alert("Role elevation required: Only Admins can invoke synthetic stress testing alerts!");
      return;
    }
    alert("Simulating automated infrastructure alert: Sending notification to SRE Slack channel. High CPU Stress thresholds bypassed (Simulated).");
  };

  return (
    <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl shadow-2xl p-6 transition-all duration-300 backdrop-blur-xl">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Activity size={18} />
            </span>
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">Admin Control & Security Logs</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Simulate secure IAM permissions, audit trails, and microservices health telemetry.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
          <span className="text-[10px] font-bold text-slate-400 px-1 flex items-center gap-1 uppercase tracking-wider font-mono">
            <Key size={12} className="text-amber-500" />
            IAM Role:
          </span>
          <div className="flex gap-1.5">
            {(["Guest", "Lead", "Admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  onChangeRole(r);
                  if (activeTab !== "metrics" && r !== "Admin") {
                    setAccessDeniedMsg("ACCESS DENIED: Standard user tier does not have administrative clearance. Switch your session role to 'Admin' in the control panel to view raw audit trails and collected leads.");
                  } else {
                    setAccessDeniedMsg(null);
                    fetchLogsAndLeads(r);
                  }
                }}
                className={`text-[10px] uppercase tracking-widest font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                  currentRole === r
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:bg-white/5"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1.5 bg-black/30 p-1 rounded-xl mb-6 border border-white/5">
        <button
          onClick={() => handleTabChange("metrics")}
          className={`flex-1 py-2 px-3 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "metrics"
              ? "bg-white/10 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Cpu size={14} />
          Real-time Metrics
        </button>
        <button
          onClick={() => handleTabChange("logs")}
          className={`flex-1 py-2 px-3 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "logs"
              ? "bg-white/10 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Terminal size={14} />
          Audit Logs ({logs.length > 0 && currentRole === "Admin" ? logs.length : "Locked"})
        </button>
        <button
          onClick={() => handleTabChange("leads")}
          className={`flex-1 py-2 px-3 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "leads"
              ? "bg-white/10 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Users size={14} />
          Collected Leads ({leads.length > 0 && currentRole === "Admin" ? leads.length : "Locked"})
        </button>
      </div>

      {/* Main Tab Area */}
      <div>
        {/* ACCESS DENIED ERROR SCREEN */}
        {accessDeniedMsg && (
          <div className="bg-rose-950/15 border border-rose-950/50 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
            <span className="p-3 bg-rose-900/30 text-rose-400 rounded-full mb-3.5 animate-pulse">
              <ShieldAlert size={26} />
            </span>
            <h4 className="text-sm font-bold text-rose-400 tracking-wide">ROLE AUDIT: RESTRICTED ACCESS</h4>
            <p className="text-xs text-rose-300 mt-2 max-w-md mx-auto leading-relaxed">
              {accessDeniedMsg}
            </p>
            <button
              onClick={() => onChangeRole("Admin")}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-2 px-4 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-md"
            >
              <UserCheck size={13} />
              Elevate Role to Admin
            </button>
          </div>
        )}

        {!accessDeniedMsg && activeTab === "metrics" && (
          <div>
            {metrics ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* CPU usage */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold tracking-wider uppercase">CPU Load</span>
                    <Cpu size={14} className="text-indigo-400" />
                  </div>
                  <h4 className="text-xl font-extrabold text-white mt-1.5">{metrics.cpu}</h4>
                  <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full transition-all duration-300"
                      style={{ width: metrics.cpu }}
                    ></div>
                  </div>
                </div>

                {/* RAM usage */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold tracking-wider uppercase">Mem Usage</span>
                    <HardDrive size={14} className="text-emerald-400" />
                  </div>
                  <h4 className="text-xl font-extrabold text-white mt-1.5">{metrics.memory}</h4>
                  <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: metrics.memory }}
                    ></div>
                  </div>
                </div>

                {/* API latency */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold tracking-wider uppercase">API Latency</span>
                    <Clock size={14} className="text-sky-400" />
                  </div>
                  <h4 className="text-xl font-extrabold text-white mt-1.5">{metrics.latency}</h4>
                  <span className="text-[9px] text-emerald-400 font-medium block mt-3">⚡ Sub-50ms Low-Latency</span>
                </div>

                {/* SRE Connections */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold tracking-wider uppercase">Active WS</span>
                    <Users size={14} className="text-purple-400" />
                  </div>
                  <h4 className="text-xl font-extrabold text-white mt-1.5">{metrics.activeConnections}</h4>
                  <span className="text-[9px] text-purple-400 font-medium block mt-3">🔒 AES-256 WebSockets</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-12 text-slate-400 text-xs">
                <RefreshCw size={14} className="animate-spin mr-2" />
                Querying telemetry streams...
              </div>
            )}

            {/* Simulated Architecture Panel */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Distributed Stack Readiness</h4>
                <div className="space-y-2.5 mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Database Status (Firestore/Cloud SQL)</span>
                    <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-500/10">Connected</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">API Gateway Proxy Routing</span>
                    <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-500/10">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Security Standard Alignment</span>
                    <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-500/10">100% Compliant</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-5 rounded-xl border border-white/5 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Simulated Site Stress Control</h4>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Test Venugopal's cloud notification pipeline. Clicking the stress button triggers an instant high-CPU synthetic threshold alert.
                  </p>
                </div>
                <button
                  onClick={handleSimulateAlert}
                  className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs py-2 px-4 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <AlertCircle size={13} />
                  Trigger Stress Alert
                </button>
              </div>
            </div>
          </div>
        )}

        {!accessDeniedMsg && activeTab === "logs" && (
          <div className="space-y-3">
            <ActivityHeatmap />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Historical Audit Logs (Latest first)</span>
              <button
                onClick={() => fetchLogsAndLeads()}
                disabled={isRefreshing}
                className="text-xs text-indigo-400 flex items-center gap-1 cursor-pointer hover:underline disabled:opacity-50"
              >
                <RefreshCw size={11} className={isRefreshing ? "animate-spin" : ""} />
                Refresh Logs
              </button>
            </div>
            <div className="max-h-[280px] overflow-y-auto space-y-2 border border-white/5 rounded-xl p-3 bg-black/20">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg gap-2 text-xs text-slate-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        log.status === "Success" ? "bg-emerald-500" : log.status === "Warning" ? "bg-amber-500" : "bg-rose-500"
                      }`}></span>
                      <div className="font-mono text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</div>
                      <span className="font-semibold text-slate-200">{log.action}</span>
                      <span className="px-1.5 py-0.5 bg-white/5 text-[10px] text-slate-400 rounded border border-white/5">
                        {log.role}
                      </span>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-3 text-slate-400 font-mono text-[11px]">
                      <span>{log.details}</span>
                      <span className="bg-black/40 px-2 py-0.5 rounded border border-white/5">
                        IP: {log.ip}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-slate-400 text-xs">No logs recorded yet.</div>
              )}
            </div>
          </div>
        )}

        {!accessDeniedMsg && activeTab === "leads" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Captured Leads & Proposals</span>
              <button
                onClick={() => fetchLogsAndLeads()}
                disabled={isRefreshing}
                className="text-xs text-indigo-400 flex items-center gap-1 cursor-pointer hover:underline disabled:opacity-50"
              >
                <RefreshCw size={11} className={isRefreshing ? "animate-spin" : ""} />
                Refresh Leads
              </button>
            </div>
            <div className="max-h-[280px] overflow-y-auto space-y-3">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 bg-white/5 border border-white/5 rounded-xl"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2.5 mb-2.5">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          {lead.name}
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-300 py-0.5 px-2 rounded-full border border-indigo-500/10 font-normal">
                            ID: {lead.id}
                          </span>
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1.5 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Mail size={12} className="text-indigo-400" />
                            {lead.email}
                          </span>
                          {lead.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={12} className="text-indigo-400" />
                              {lead.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono shrink-0">
                        <Calendar size={11} />
                        {new Date(lead.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-300">
                        Subject: <span className="font-normal text-slate-400">{lead.subject}</span>
                      </h5>
                      <p className="text-xs text-slate-300 mt-2 bg-black/40 p-3 rounded-lg border border-white/5 leading-relaxed whitespace-pre-wrap">
                        {lead.message}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/5 p-8 text-slate-400 text-xs">
                  No leads submitted yet. Be the first to send a query using the Contact form below!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
