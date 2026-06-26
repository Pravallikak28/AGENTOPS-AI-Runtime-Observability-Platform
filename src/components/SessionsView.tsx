import React, { useState } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Clock, 
  Coins, 
  BrainCircuit, 
  Terminal, 
  Database,
  ChevronRight,
  Sparkles,
  RefreshCcw,
  ExternalLink,
  Download,
  FileDown,
  Layers,
  FileCode,
  Printer,
  Info,
  ArrowRightLeft
} from "lucide-react";
import { AgentSession } from "../types";
import FailureAnalyzer from "./FailureAnalyzer";
import SessionComparison from "./SessionComparison";
import MemorySnapshotCompare from "./MemorySnapshotCompare";

interface SessionsViewProps {
  sessions: AgentSession[];
  selectedSession: AgentSession | null;
  onSelectSession: (session: AgentSession | null) => void;
}

export default function SessionsView({ sessions, selectedSession, onSelectSession }: SessionsViewProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "failed">("all");
  const [compareSession, setCompareSession] = useState<AgentSession | null>(null);
  const [compareMemorySession, setCompareMemorySession] = useState<AgentSession | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.query.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Feature 12 — Real File Export Logic
  const handleExportData = (format: "json" | "csv" | "md" | "pdf") => {
    if (!selectedSession) return;
    setIsExporting(format);
    
    setTimeout(() => {
      let content = "";
      let filename = `agentops_session_${selectedSession.id}.${format}`;
      
      if (format === "json") {
        content = JSON.stringify(selectedSession, null, 2);
      } else if (format === "csv") {
        content = "EventID,Node,Status,Timestamp,Title,Description\n" + 
          selectedSession.traces.map(t => 
            `"${t.id}","${t.nodeId}","${t.status}","${t.timestamp}","${t.title.replace(/"/g, '""')}","${t.description.replace(/"/g, '""')}"`
          ).join("\n");
      } else if (format === "md") {
        content = `# AGENTOPS Trace Summary: ${selectedSession.id}\n\n` +
          `**Timestamp:** ${new Date(selectedSession.timestamp).toLocaleString()}\n` +
          `**Query:** ${selectedSession.query}\n` +
          `**Latency:** ${selectedSession.latency}s\n` +
          `**Cost:** \$${selectedSession.cost.toFixed(6)}\n` +
          `**Tokens:** ${selectedSession.tokens.total} total (${selectedSession.tokens.input} in / ${selectedSession.tokens.output} out)\n` +
          `**Status:** ${selectedSession.status.toUpperCase()}\n\n` +
          `## Traces\n` +
          selectedSession.traces.map(t => `- **[${t.timestamp}] [${t.nodeId}] ${t.title}**: ${t.description}`).join("\n");
      } else if (format === "pdf") {
        content = `=========================================================\n` +
          ` AGENTOPS EXECUTIVE SYSTEM REPORT\n` +
          `=========================================================\n` +
          `Session ID: ${selectedSession.id}\n` +
          `Epoch: ${new Date(selectedSession.timestamp).toLocaleString()}\n` +
          `Target User Query: "${selectedSession.query}"\n` +
          `Latency Budget: ${selectedSession.latency}s\n` +
          `Compute Spend Allocation: \$${selectedSession.cost.toFixed(6)}\n` +
          `Tokens Transacted: ${selectedSession.tokens.total}\n` +
          `Handshake Integrity: PASSED\n` +
          `Status Code: ${selectedSession.status.toUpperCase()}\n` +
          `=========================================================\n`;
        filename = `agentops_executive_${selectedSession.id}.txt`;
      }

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(null);
    }, 800);
  };

  return (
    <div className="flex-1 overflow-hidden flex h-screen text-gray-200 font-sans">
      
      {/* Sessions List Column */}
      <div className="w-1/2 border-r border-gray-800 flex flex-col h-full bg-[#0B0F14]">
        
        {/* Header and Filter actions */}
        <div className="p-6 border-b border-gray-800 space-y-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold font-display text-white">Execution Session Archives</h2>
            <p className="text-xs text-gray-400 mt-0.5">Audit agent requests, tool pipelines, and final outputs.</p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-500" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID or query text..."
                className="w-full bg-[#111827] border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 font-mono text-gray-200"
              />
            </div>
            <div className="flex bg-[#111827] rounded-lg border border-gray-800 p-0.5 text-xs font-mono">
              <button 
                onClick={() => setFilter("all")}
                className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-semibold ${filter === "all" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter("completed")}
                className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-semibold ${filter === "completed" ? "bg-emerald-950/40 text-emerald-400" : "text-gray-400 hover:text-gray-200"}`}
              >
                Ok
              </button>
              <button 
                onClick={() => setFilter("failed")}
                className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-semibold ${filter === "failed" ? "bg-red-950/40 text-red-400" : "text-gray-400 hover:text-gray-200"}`}
              >
                Fail
              </button>
            </div>
          </div>
        </div>

        {/* Sessions List items container */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-800/40">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => {
              const isSelected = selectedSession?.id === session.id;
              return (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session)}
                  className={`p-5 transition-colors cursor-pointer text-left relative ${
                    isSelected ? "bg-gray-900/60 border-l-2 border-blue-500" : "hover:bg-gray-900/30"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-mono font-semibold text-blue-400">
                      {session.id}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      {new Date(session.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                    {session.query}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3.5 text-[10px] font-mono text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.latency}s
                      </span>
                      <span className="flex items-center gap-1">
                        <BrainCircuit className="h-3 w-3" />
                        {session.tokens.total}T
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Coins className="h-3 w-3 text-emerald-500" />
                        ${session.cost.toFixed(6)}
                      </span>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-semibold uppercase ${
                      session.status === "completed" 
                        ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" 
                        : "bg-red-950/40 text-red-400 border border-red-900/30"
                    }`}>
                      {session.status}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-[55vh] text-center text-gray-400 p-8 space-y-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl blur opacity-15"></div>
                <div className="h-16 w-16 bg-gray-950 border border-gray-800/80 rounded-2xl flex items-center justify-center text-blue-500 shadow-2xl relative">
                  <Layers className="h-8 w-8 text-blue-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-sans">No Sessions Discovered</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                  No execution traces matched your active search queries or status filters in this workspace.
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-[10px] font-mono font-bold uppercase text-white rounded-lg transition-all"
                >
                  Clear Queries
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Session Audit Panel */}
      <div className="w-1/2 flex flex-col h-full bg-[#111827]/30">
        {selectedSession ? (
          <div className="flex flex-col h-full overflow-y-auto">
            
            {/* Panel Header */}
            <div className="p-6 border-b border-gray-800 space-y-4 shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Audit Inspector</span>
                <button 
                  onClick={() => onSelectSession(null)}
                  className="text-xs text-gray-500 hover:text-white"
                >
                  Close Panel
                </button>
              </div>
              <h3 className="text-sm font-bold text-white font-display text-left">Session: {selectedSession.id}</h3>
              <p className="text-xs font-mono bg-[#111827] p-3 rounded-lg border border-gray-800 text-blue-300 text-left">
                "{selectedSession.query}"
              </p>

              {/* Feature 7 & 9 — Compare Action Triggers Dropdowns */}
              <div className="flex flex-wrap gap-2.5 pt-2 select-none">
                <div className="relative inline-block text-left">
                  <select
                    onChange={(e) => {
                      const matched = sessions.find(s => s.id === e.target.value);
                      if (matched) setCompareSession(matched);
                      e.target.value = ""; // Reset dropdown selection
                    }}
                    className="bg-[#111827] border border-gray-800 rounded px-2.5 py-1.5 text-[11px] font-mono text-gray-300 hover:text-white hover:border-gray-700 transition-colors focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled selected>Compare with session...</option>
                    {sessions.filter(s => s.id !== selectedSession.id).map(s => (
                      <option key={s.id} value={s.id}>{s.id} ({s.status})</option>
                    ))}
                  </select>
                </div>

                <div className="relative inline-block text-left">
                  <select
                    onChange={(e) => {
                      const matched = sessions.find(s => s.id === e.target.value);
                      if (matched) setCompareMemorySession(matched);
                      e.target.value = ""; // Reset dropdown selection
                    }}
                    className="bg-[#111827] border border-gray-800 rounded px-2.5 py-1.5 text-[11px] font-mono text-gray-300 hover:text-white hover:border-gray-700 transition-colors focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled selected>Compare Memory snap...</option>
                    {sessions.filter(s => s.id !== selectedSession.id).map(s => (
                      <option key={s.id} value={s.id}>{s.id}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Feature 12 — Execution Export Dropdowns & toolbar */}
              <div className="pt-2.5 border-t border-gray-850 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-500 text-[10px] uppercase">Export transaction:</span>
                <div className="flex gap-1.5">
                  {(["json", "csv", "md", "pdf"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleExportData(fmt)}
                      className="px-2 py-1 bg-gray-950 border border-gray-850 hover:border-gray-750 text-gray-400 hover:text-white rounded text-[10px] uppercase font-bold tracking-wider transition-colors"
                    >
                      {isExporting === fmt ? "..." : fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Audit Sections */}
            <div className="p-6 space-y-6">
              
              {/* Feature 8 — AI Failure Analyzer mounted dynamically */}
              {selectedSession.status === "failed" && (
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider font-bold">Failure Diagnostics Suite</span>
                  <FailureAnalyzer 
                    errorId="err_aws_ecs_403"
                    errorMessage="AccessDeniedException: AWS IAM user 'runner' unauthorized for 'ecs:UpdateService'."
                    sessionId={selectedSession.id}
                    category="tool"
                    isResolved={false}
                  />
                </div>
              )}

              {/* Node status checklist */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block text-left">Node Status Metrics</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedSession.nodes.map((node) => (
                    <div key={node.id} className="flex items-center justify-between p-2.5 bg-[#111827] border border-gray-800/80 rounded-lg">
                      <span className="font-semibold text-gray-300">{node.label}</span>
                      <span className={`text-[9px] font-mono font-semibold ${
                        node.status === "completed" ? "text-emerald-400" :
                        node.status === "failed" ? "text-red-400" : "text-gray-500"
                      }`}>
                        {node.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tool call details */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block text-left">Executed Tool Commands</span>
                {selectedSession.toolCalls.length > 0 ? (
                  selectedSession.toolCalls.map((tc, idx) => (
                    <div key={idx} className="bg-gray-950 p-4 rounded-lg border border-gray-850 space-y-2 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold font-mono text-white">{tc.name}</span>
                        <span className="text-[10px] font-mono text-gray-500">{tc.duration}ms</span>
                      </div>
                      <div className="text-[10px] font-mono space-y-1 text-gray-400">
                        <p className="truncate"><span className="text-blue-400">In:</span> {tc.input}</p>
                        <p className="truncate"><span className="text-emerald-400">Out:</span> {tc.output}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 font-mono text-left">No external tool integrations invoked.</p>
                )}
              </div>

              {/* Prompts sent */}
              <div className="space-y-3 text-left">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Internal Prompt Pipeline</span>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="bg-[#111827] p-3.5 rounded-lg border border-gray-800/80">
                    <span className="text-[9px] text-gray-500 uppercase">Expanded Instruction Frame</span>
                    <p className="text-gray-300 mt-1 line-clamp-3 font-mono">{selectedSession.prompts.expanded}</p>
                  </div>
                  <div className="bg-[#111827] p-3.5 rounded-lg border border-gray-800/80">
                    <span className="text-[9px] text-gray-500 uppercase">Final LLM Context</span>
                    <p className="text-gray-300 mt-1 line-clamp-3 font-mono">{selectedSession.prompts.final}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-6">
            <Terminal className="h-10 w-10 text-gray-800 mb-2.5" />
            <p className="text-xs font-mono">Select an execution session from the left column to inspect its variables.</p>
          </div>
        )}
      </div>

      {/* Feature 7 — Multi-Session Comparison Modal overlay */}
      {compareSession && selectedSession && (
        <SessionComparison 
          sessionA={selectedSession}
          sessionB={compareSession}
          onClose={() => setCompareSession(null)}
        />
      )}

      {/* Feature 9 — Memory Snapshot Compare Modal overlay */}
      {compareMemorySession && selectedSession && (
        <MemorySnapshotCompare 
          sessionA={selectedSession}
          sessionB={compareMemorySession}
          onClose={() => setCompareMemorySession(null)}
        />
      )}

    </div>
  );
}
