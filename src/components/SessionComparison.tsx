import React from "react";
import { X, Clock, Coins, BrainCircuit, AlertTriangle, CheckCircle2, ArrowRightLeft, ArrowDown, ArrowUp } from "lucide-react";
import { AgentSession } from "../types";

interface SessionComparisonProps {
  sessionA: AgentSession;
  sessionB: AgentSession;
  onClose: () => void;
}

export default function SessionComparison({ sessionA, sessionB, onClose }: SessionComparisonProps) {
  
  // Calculate relative differences
  const latDiff = sessionB.latency - sessionA.latency;
  const latPct = ((latDiff / sessionA.latency) * 100).toFixed(1);

  const costDiff = sessionB.cost - sessionA.cost;
  const costPct = ((costDiff / sessionA.cost) * 100).toFixed(1);

  const tokenDiff = sessionB.tokens.total - sessionA.tokens.total;
  const tokenPct = ((tokenDiff / sessionA.tokens.total) * 100).toFixed(1);

  const formatDiffBadge = (val: number, pct: string, unit: string, isInverseGreen = false) => {
    if (val === 0) return <span className="text-gray-500 font-mono text-[10px]">No change</span>;
    
    // For cost/latency, smaller is better (so negative value is green, positive is red)
    const isNegative = val < 0;
    const isGood = isInverseGreen ? isNegative : !isNegative;

    return (
      <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
        isGood 
          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/20" 
          : "bg-red-950/40 text-red-400 border border-red-900/20"
      }`}>
        {isNegative ? "" : "+"}
        {val.toFixed(unit === "USD" ? 6 : 2)}{unit} ({isNegative ? "" : "+"}{pct}%)
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6 select-none overflow-y-auto">
      <div className="w-full max-w-5xl bg-[#0B0F14]/95 border border-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-gray-200">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-gray-800 flex items-center justify-between bg-gray-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-950/20 rounded-lg border border-blue-900/40 text-blue-400">
              <ArrowRightLeft className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white font-display">Multi-Session Comparison</h3>
              <p className="text-xs text-gray-400">Comparing transaction paths, latency profiles, and resource allocations</p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top side-by-side identifiers */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-850">
              <span className="text-[10px] font-mono text-blue-400 font-semibold uppercase">Session A (Base Reference)</span>
              <h4 className="text-sm font-mono font-bold text-white mt-1">{sessionA.id}</h4>
              <p className="text-xs text-gray-400 font-sans mt-2 italic">"{sessionA.query}"</p>
            </div>
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-850">
              <span className="text-[10px] font-mono text-indigo-400 font-semibold uppercase">Session B (Target Compare)</span>
              <h4 className="text-sm font-mono font-bold text-white mt-1">{sessionB.id}</h4>
              <p className="text-xs text-gray-400 font-sans mt-2 italic">"{sessionB.query}"</p>
            </div>
          </div>

          {/* Primary metrics diffs row */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-4">Core Efficiency Delta</h4>
            <div className="grid grid-cols-3 gap-6">
              
              {/* Latency Comparison */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-semibold text-gray-300">Process Latency</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold font-mono text-white">{sessionA.latency}s</span>
                  <span className="text-xs text-gray-500 font-mono">vs</span>
                  <span className="text-lg font-bold font-mono text-white">{sessionB.latency}s</span>
                </div>
                <div className="pt-1.5">{formatDiffBadge(latDiff, latPct, "s", true)}</div>
              </div>

              {/* Cost Comparison */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-gray-300">Compute Cost (USD)</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold font-mono text-white">${sessionA.cost.toFixed(6)}</span>
                  <span className="text-xs text-gray-500 font-mono">vs</span>
                  <span className="text-lg font-bold font-mono text-white">${sessionB.cost.toFixed(6)}</span>
                </div>
                <div className="pt-1.5">{formatDiffBadge(costDiff, costPct, "USD", true)}</div>
              </div>

              {/* Tokens Comparison */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-gray-300">Total Tokens</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold font-mono text-white">{sessionA.tokens.total}</span>
                  <span className="text-xs text-gray-500 font-mono">vs</span>
                  <span className="text-lg font-bold font-mono text-white">{sessionB.tokens.total}</span>
                </div>
                <div className="pt-1.5">{formatDiffBadge(tokenDiff, tokenPct, "T", true)}</div>
              </div>

            </div>
          </div>

          {/* Prompts comparison panels */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Prompts Context Comparison</span>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500">Session A Final Prompt:</span>
                <pre className="bg-gray-950 p-4 rounded-lg border border-gray-850 text-[11px] text-gray-300 font-mono max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {sessionA.prompts.final}
                </pre>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500">Session B Final Prompt:</span>
                <pre className="bg-gray-950 p-4 rounded-lg border border-gray-850 text-[11px] text-gray-300 font-mono max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {sessionB.prompts.final}
                </pre>
              </div>
            </div>
          </div>

          {/* Tools Comparison */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Executed Tools Diff</span>
            <div className="grid grid-cols-2 gap-6 text-xs">
              
              {/* Session A Tools */}
              <div className="space-y-2 bg-gray-950/40 p-4 rounded-lg border border-gray-850">
                <span className="text-[10px] font-mono text-gray-500">Session A Tools:</span>
                {sessionA.toolCalls.length > 0 ? (
                  sessionA.toolCalls.map((tc, idx) => (
                    <div key={idx} className="p-3 bg-gray-950 border border-gray-800 rounded">
                      <p className="font-bold text-white font-mono">{tc.name}</p>
                      <p className="text-[10px] text-gray-500 mt-1 font-mono">Duration: {tc.duration}ms | Status: {tc.status.toUpperCase()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No tools called.</p>
                )}
              </div>

              {/* Session B Tools */}
              <div className="space-y-2 bg-gray-950/40 p-4 rounded-lg border border-gray-850">
                <span className="text-[10px] font-mono text-gray-500">Session B Tools:</span>
                {sessionB.toolCalls.length > 0 ? (
                  sessionB.toolCalls.map((tc, idx) => (
                    <div key={idx} className="p-3 bg-gray-950 border border-gray-800 rounded">
                      <p className="font-bold text-white font-mono">{tc.name}</p>
                      <p className="text-[10px] text-gray-500 mt-1 font-mono">Duration: {tc.duration}ms | Status: {tc.status.toUpperCase()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No tools called.</p>
                )}
              </div>

            </div>
          </div>

          {/* Memory snap comparison */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Episodic Knowledge Comparison</span>
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-[#111827] border border-gray-800 rounded-lg">
                <span className="text-[10px] font-mono text-gray-500 block mb-2">Session A Retrieved Docs:</span>
                <ul className="space-y-1.5 list-disc list-inside text-gray-300">
                  {sessionA.memory.retrievedDocs.map((doc, idx) => (
                    <li key={idx} className="leading-relaxed font-sans">{doc}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-[#111827] border border-gray-800 rounded-lg">
                <span className="text-[10px] font-mono text-gray-500 block mb-2">Session B Retrieved Docs:</span>
                <ul className="space-y-1.5 list-disc list-inside text-gray-300">
                  {sessionB.memory.retrievedDocs.map((doc, idx) => (
                    <li key={idx} className="leading-relaxed font-sans">{doc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-950 text-[11px] text-gray-500 font-mono border-t border-gray-800 text-right shrink-0">
          Compare tool completed. Diffs represent true latency and cost budgets.
        </div>

      </div>
    </div>
  );
}
