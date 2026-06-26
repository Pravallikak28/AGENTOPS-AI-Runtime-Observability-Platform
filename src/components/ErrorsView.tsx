import React, { useState } from "react";
import { 
  AlertOctagon, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Search, 
  Clock, 
  Terminal,
  Activity,
  ArrowRight
} from "lucide-react";
import { ErrorStats } from "../types";

interface ErrorsViewProps {
  errorStats: ErrorStats;
  onResolveError: (errorId: string) => void;
}

export default function ErrorsView({ errorStats, onResolveError }: ErrorsViewProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "resolved" | "unresolved">("all");

  const filteredErrors = errorStats.recentErrors.filter(err => {
    const matchesSearch = err.message.toLowerCase().includes(search.toLowerCase()) || err.sessionId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || err.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0B0F14] text-gray-200 space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <span className="text-xs font-mono px-2 py-0.5 bg-red-950/40 text-red-400 border border-red-900/40 rounded">
            EXCEPTION COMPLIANCE
          </span>
          <h2 className="text-xl font-bold font-display text-white mt-1.5">Error & Retry Audit Dashboard</h2>
          <p className="text-xs text-gray-400 mt-1">
            Analyzing pipeline aborts, API timeout anomalies, and tool exceptions.
          </p>
        </div>

        {/* Counter indicators */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-red-950/20 border border-red-900/30 px-3 py-1.5 rounded text-red-400">
            <span>Failures: {errorStats.failures}</span>
          </div>
          <div className="bg-amber-950/20 border border-amber-900/30 px-3 py-1.5 rounded text-amber-400">
            <span>Retries: {errorStats.retries}</span>
          </div>
          <div className="bg-gray-900 border border-gray-850 px-3 py-1.5 rounded text-gray-400">
            <span>Total: {errorStats.total}</span>
          </div>
        </div>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
        
        {/* Fail rate */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all shadow-sm">
          <span className="text-xs font-mono font-medium text-gray-400 uppercase">Fail Ratio</span>
          <div className="mt-4">
            <span className="text-2xl font-bold font-display text-white">1.6%</span>
            <p className="text-[10px] text-emerald-400 font-mono mt-1">Inside safe operational bounds</p>
          </div>
        </div>

        {/* Tool Errors */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all shadow-sm">
          <span className="text-xs font-mono font-medium text-gray-400 uppercase">Tool exceptions</span>
          <div className="mt-4">
            <span className="text-2xl font-bold font-display text-white">{errorStats.toolErrors}</span>
            <p className="text-[10px] text-gray-500 font-mono mt-1">Database/API failures reported</p>
          </div>
        </div>

        {/* Timeout Errors */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all shadow-sm">
          <span className="text-xs font-mono font-medium text-gray-400 uppercase">Timeout Anomalies</span>
          <div className="mt-4">
            <span className="text-2xl font-bold font-display text-white">{errorStats.timeouts}</span>
            <p className="text-[10px] text-gray-500 font-mono mt-1">Requests exceeding 5s deadline limits</p>
          </div>
        </div>

        {/* Memory anomalies */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all shadow-sm">
          <span className="text-xs font-mono font-medium text-gray-400 uppercase">Memory Collisions</span>
          <div className="mt-4">
            <span className="text-2xl font-bold font-display text-white">{errorStats.memoryErrors}</span>
            <p className="text-[10px] text-emerald-400 font-mono mt-1">0 namespace collision alerts</p>
          </div>
        </div>

      </div>

      {/* Failures Table and Resolution Area */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-white font-display">Recent Operational Failures</h3>
            <p className="text-xs text-gray-400 mt-0.5">Click "Resolve" once IAM permissions or networks have synchronized.</p>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-500" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search error messages..."
                className="bg-gray-950 border border-gray-850 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 font-mono text-gray-200"
              />
            </div>
            
            <div className="flex bg-[#111827] rounded-lg border border-gray-800 p-0.5 text-xs font-mono">
              <button 
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-semibold ${filter === "all" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter("unresolved")}
                className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-semibold ${filter === "unresolved" ? "bg-red-950/40 text-red-400" : "text-gray-400 hover:text-gray-200"}`}
              >
                Open
              </button>
              <button 
                onClick={() => setFilter("resolved")}
                className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-semibold ${filter === "resolved" ? "bg-emerald-950/40 text-emerald-400" : "text-gray-400 hover:text-gray-200"}`}
              >
                Resolved
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase font-mono tracking-wider text-[9px]">
                <th className="py-3 px-4">Session Target</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Error Exception Code / Message</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40 text-left font-mono">
              {filteredErrors.length > 0 ? (
                filteredErrors.map((err) => (
                  <tr key={err.id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="py-4 px-4 text-blue-400 font-semibold truncate max-w-[120px]">{err.sessionId}</td>
                    <td className="py-4 px-4 text-gray-400 uppercase text-[10px]">{err.category}</td>
                    <td className="py-4 px-4 text-gray-300 font-sans max-w-sm whitespace-pre-wrap leading-relaxed">{err.message}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase ${
                        err.status === "resolved" 
                          ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/30" 
                          : err.status === "ignored"
                            ? "bg-gray-900 text-gray-500 border border-gray-800"
                            : "bg-red-950/30 text-red-400 border border-red-900/30 animate-pulse"
                      }`}>
                        {err.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {err.status === "unresolved" ? (
                        <button
                          onClick={() => onResolveError(err.id)}
                          className="px-2.5 py-1 bg-[#111827] hover:bg-emerald-950/40 border border-gray-800 hover:border-emerald-900/30 hover:text-emerald-400 rounded text-[10px] font-bold text-gray-300 transition-all font-sans"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-gray-500 italic text-[10px] font-sans">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-gray-400">
                      <div className="relative">
                        <div className="absolute -inset-1.5 bg-emerald-500/10 rounded-full blur"></div>
                        <div className="h-14 w-14 bg-gray-950 border border-emerald-900/40 rounded-2xl flex items-center justify-center text-emerald-400 shadow-2xl relative">
                          <CheckCircle className="h-6 w-6 text-emerald-400" />
                        </div>
                      </div>
                      <div className="space-y-1.5 max-w-sm mx-auto">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sans">System Fully Compliant</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                          All runtime components are operating within safe bounds. Zero unresolved exception events discovered.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSearch("");
                          setFilter("all");
                        }}
                        className="px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[10px] font-mono font-bold uppercase text-white rounded-lg transition-colors"
                      >
                        Reset Search Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
