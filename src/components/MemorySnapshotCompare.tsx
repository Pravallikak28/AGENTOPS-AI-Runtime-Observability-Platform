import React from "react";
import { X, Database, Check, History, ArrowRight, ChevronRight, FileText } from "lucide-react";
import { AgentSession } from "../types";

interface MemorySnapshotCompareProps {
  sessionA: AgentSession;
  sessionB: AgentSession;
  onClose: () => void;
}

export default function MemorySnapshotCompare({ sessionA, sessionB, onClose }: MemorySnapshotCompareProps) {
  
  // Custom context diff simulation to look hyper-realistic
  const addedLines = [
    "+ Context frame: added AWS_SESSION_TOKEN profile validation checks.",
    "+ Vector index: mapped table public.metrics(cpu_pct, timestamp) coordinates.",
    "+ Episodic preference: user requested compact, high-contrast dashboard visualization layouts."
  ];

  const removedLines = [
    "- Context frame: purged local staging mock server credentials.",
    "- Vector index: expired column layout constraints on dev-sandbox replicas."
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6 select-none overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#0B0F14]/95 border border-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-gray-200">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-gray-800 flex items-center justify-between bg-gray-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-950/20 text-blue-400 rounded-lg border border-blue-900/40">
              <Database className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white font-display">Memory Snapshot Comparison</h3>
              <p className="text-xs text-gray-400">Auditing dynamic context mutations and semantic index additions</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* Side-by-side Snapshots Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-850">
              <div className="flex justify-between items-center text-[10px] font-mono text-blue-400 uppercase">
                <span>Snapshot A (Base Epoch)</span>
                <span>{new Date(sessionA.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-xs font-bold text-white mt-1.5 font-mono">{sessionA.id}</p>
              <div className="mt-3 text-[11px] text-gray-400 font-sans space-y-1">
                <p><span className="text-gray-500 font-mono">Workspace:</span> Default Workspace</p>
                <p><span className="text-gray-500 font-mono">Query:</span> "{sessionA.query.substring(0, 50)}..."</p>
              </div>
            </div>
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-850">
              <div className="flex justify-between items-center text-[10px] font-mono text-indigo-400 uppercase">
                <span>Snapshot B (Current Epoch)</span>
                <span>{new Date(sessionB.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-xs font-bold text-white mt-1.5 font-mono">{sessionB.id}</p>
              <div className="mt-3 text-[11px] text-gray-400 font-sans space-y-1">
                <p><span className="text-gray-500 font-mono">Workspace:</span> Default Workspace</p>
                <p><span className="text-gray-500 font-mono">Query:</span> "{sessionB.query.substring(0, 50)}..."</p>
              </div>
            </div>
          </div>

          {/* Added & Removed Visualizer Context split */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Dynamic Context Modifications</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              
              {/* Added Context (Green) */}
              <div className="p-4.5 bg-emerald-950/10 border border-emerald-900/35 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[9px] tracking-wider mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>Added Context (+{addedLines.length} updates)</span>
                </div>
                <div className="space-y-2">
                  {addedLines.map((line, idx) => (
                    <div key={idx} className="p-2.5 bg-gray-950/80 rounded border border-emerald-950/30 text-emerald-400 font-mono text-[11px] leading-relaxed">
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {/* Purged/Removed Context (Red) */}
              <div className="p-4.5 bg-red-950/10 border border-red-900/25 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-red-400 font-bold uppercase text-[9px] tracking-wider mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  <span>Removed / Expired Context (-{removedLines.length} updates)</span>
                </div>
                <div className="space-y-2">
                  {removedLines.map((line, idx) => (
                    <div key={idx} className="p-2.5 bg-gray-950/80 rounded border border-red-950/20 text-red-400 font-mono text-[11px] leading-relaxed">
                      {line}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Conversation and Session Memory differences */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Conversation & Session Memory comparison</span>
            <div className="space-y-3 font-mono">
              <div className="bg-gray-950/40 border border-gray-800 rounded-xl p-4 space-y-2.5">
                <span className="text-[10px] text-gray-500 uppercase block">Snapshot A (Session Memory):</span>
                <p className="text-gray-300 font-sans leading-relaxed">{sessionA.memory.sessionMemory}</p>
              </div>
              <div className="bg-gray-950/40 border border-gray-800 rounded-xl p-4 space-y-2.5">
                <span className="text-[10px] text-gray-500 uppercase block">Snapshot B (Session Memory):</span>
                <p className="text-gray-300 font-sans leading-relaxed">{sessionB.memory.sessionMemory}</p>
              </div>
            </div>
          </div>

          {/* Retrieved Documents comparison */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Injected Knowledge Vector comparison</span>
            <div className="grid grid-cols-2 gap-6 font-sans">
              <div className="p-4 bg-gray-950/40 border border-gray-850 rounded-xl">
                <span className="text-[10px] font-mono text-gray-500 block mb-2 uppercase">A retrieved documents</span>
                <ul className="space-y-1 text-gray-300">
                  {sessionA.memory.retrievedDocs.map((doc, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-[11px]">
                      <ChevronRight className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-gray-950/40 border border-gray-850 rounded-xl">
                <span className="text-[10px] font-mono text-gray-500 block mb-2 uppercase">B retrieved documents</span>
                <ul className="space-y-1 text-gray-300">
                  {sessionB.memory.retrievedDocs.map((doc, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-[11px]">
                      <ChevronRight className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-950 text-[10px] text-gray-500 font-mono border-t border-gray-800 text-right shrink-0">
          State diff complete. Purged contexts represent active garbage-collection routines.
        </div>

      </div>
    </div>
  );
}
