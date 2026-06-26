import React from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Coins, 
  Cpu, 
  TrendingUp, 
  ArrowUpRight, 
  Activity, 
  AlertOctagon,
  BrainCircuit,
  Settings2,
  ExternalLink
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { AgentSession, SystemHealthMetrics } from "../types";

interface DashboardViewProps {
  sessions: AgentSession[];
  health: SystemHealthMetrics;
  onSelectSession: (session: AgentSession) => void;
  onNavigateToTab: (tab: string) => void;
  latencyHistory: { timestamp: string; planning: number; retrieval: number; tools: number; model: number; validation: number }[];
}

export default function DashboardView({ 
  sessions, 
  health, 
  onSelectSession, 
  onNavigateToTab,
  latencyHistory 
}: DashboardViewProps) {
  
  // Compute metrics dynamically from current sessions list + initial metrics
  const completedCount = sessions.filter(s => s.status === "completed").length;
  const failedCount = sessions.filter(s => s.status === "failed").length;
  const totalCount = sessions.length;
  const successRate = totalCount > 0 ? parseFloat(((completedCount / totalCount) * 100).toFixed(1)) : health.successRate;

  const totalCost = sessions.reduce((acc, s) => acc + s.cost, 0);
  const avgCost = totalCount > 0 ? parseFloat((totalCost / totalCount).toFixed(6)) : health.avgCost;

  const totalLatency = sessions.reduce((acc, s) => acc + s.latency, 0);
  const avgLatency = totalCount > 0 ? parseFloat((totalLatency / totalCount).toFixed(2)) : health.avgLatency;

  const totalTokens = sessions.reduce((acc, s) => acc + s.tokens.total, 0);
  const avgTokens = totalCount > 0 ? Math.round(totalTokens / totalCount) : 868;

  // Recent 4 sessions
  const recentSessions = [...sessions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 4);

  // Format the chart data to look smooth and premium
  const chartData = latencyHistory.map(h => ({
    ...h,
    total: parseFloat(((h.planning + h.retrieval + h.tools + h.model + h.validation) / 1000).toFixed(2))
  }));

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0B0F14] text-gray-100 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-white">System Observability</h2>
          <p className="text-sm text-gray-400 mt-1">Real-time telemetries, agent runtime logs, and transaction-level auditing.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onNavigateToTab("live")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold text-white transition-all shadow-md shadow-blue-900/10 flex items-center gap-2 border border-blue-500/30"
          >
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            Launch Live Run
          </button>
        </div>
      </div>

      {/* Grid: Primary Telemetry Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Latency card */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono font-medium text-gray-400 tracking-wider uppercase">Avg Latency</span>
            <div className="p-2 bg-blue-950/40 rounded-lg border border-blue-900/30">
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-display text-white">{avgLatency}s</span>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-400 font-semibold">-0.3s</span> since last epoch
            </div>
          </div>
        </div>

        {/* Cost card */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono font-medium text-gray-400 tracking-wider uppercase">Avg Run Cost</span>
            <div className="p-2 bg-emerald-950/40 rounded-lg border border-emerald-900/30">
              <Coins className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-display text-white">${avgCost.toFixed(6)}</span>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400">
              <span className="text-emerald-400 font-semibold">99.8%</span> optimization index
            </div>
          </div>
        </div>

        {/* Tokens card */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono font-medium text-gray-400 tracking-wider uppercase">Avg Token usage</span>
            <div className="p-2 bg-indigo-950/40 rounded-lg border border-indigo-900/30">
              <BrainCircuit className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-display text-white">{avgTokens}</span>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400">
              <span className="text-indigo-400 font-semibold">{avgTokens - 85}</span> input / {Math.round(avgTokens * 0.65)} output
            </div>
          </div>
        </div>

        {/* Success Rate card */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono font-medium text-gray-400 tracking-wider uppercase">Success Index</span>
            <div className="p-2 bg-teal-950/40 rounded-lg border border-teal-900/30">
              <CheckCircle2 className="h-4 w-4 text-teal-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-display text-white">{successRate}%</span>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400">
              <span className="text-emerald-400 font-semibold">{completedCount}</span> completed / <span className="text-red-400 font-semibold">{failedCount}</span> failed
            </div>
          </div>
        </div>

      </div>

      {/* Main Charts & Side Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Latency History Chart (2/3 width) */}
        <div className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-white font-display">System Latency Over Time</h3>
              <p className="text-xs text-gray-400">Chronological telemetry of agent execution runs (seconds)</p>
            </div>
            <span className="text-[10px] font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800">
              7 EPOCHS LOADED
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#4B5563" fontSize={10} fontClassName="font-mono" tickLine={false} />
                <YAxis stroke="#4B5563" fontSize={10} fontClassName="font-mono" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0B0F14", border: "1px solid #374151", borderRadius: "8px", fontSize: "12px" }}
                  labelClassName="font-mono text-gray-400"
                  formatter={(val) => [`${val}s`, "Execution Latency"]}
                />
                <Area type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#latencyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health Checklists (1/3 width) */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white font-display mb-4">Node Health Status</h3>
            <div className="space-y-4">
              
              {/* Agent Orchestrator success */}
              <div className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg border border-gray-800">
                <div className="flex items-center gap-3">
                  <Cpu className="h-4 w-4 text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-gray-200">Orchestrator Node</p>
                    <p className="text-[10px] text-gray-500 font-mono">Model: gemini-3.5-flash</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-white font-mono">{health.successRate}%</p>
                  <p className="text-[9px] text-emerald-500 uppercase">ACTIVE</p>
                </div>
              </div>

              {/* Tool Execution success */}
              <div className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg border border-gray-800">
                <div className="flex items-center gap-3">
                  <Settings2 className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-xs font-semibold text-gray-200">Tool Executions</p>
                    <p className="text-[10px] text-gray-500 font-mono">Registry: 12 systems</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-white font-mono">{health.toolHealth}%</p>
                  <p className="text-[9px] text-emerald-500 uppercase">HEALTHY</p>
                </div>
              </div>

              {/* Memory Success */}
              <div className="flex items-center justify-between p-3 bg-gray-900/40 rounded-lg border border-gray-800">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="h-4 w-4 text-indigo-400" />
                  <div>
                    <p className="text-xs font-semibold text-gray-200">Memory Sync Node</p>
                    <p className="text-[10px] text-gray-500 font-mono">Context: 120 slots active</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-white font-mono">{health.memoryHealth}%</p>
                  <p className="text-[9px] text-emerald-500 uppercase">STABLE</p>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-gray-800/60 mt-4 flex justify-between items-center text-xs">
            <span className="text-gray-400">Cluster Status:</span>
            <div className="flex items-center gap-1.5 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] font-mono text-emerald-400">98.9% OVERALL HEALTH</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Sessions Activity */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-white font-display">Recent Audited Sessions</h3>
            <p className="text-xs text-gray-400 mt-0.5">Click on any transaction path to view step timelines and variables.</p>
          </div>
          <button 
            onClick={() => onNavigateToTab("sessions")}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5"
          >
            All Sessions
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase font-mono tracking-wider text-[10px]">
                <th className="py-3 px-4">Session ID</th>
                <th className="py-3 px-4">Query / Prompt</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Tokens</th>
                <th className="py-3 px-4 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {recentSessions.map((session) => (
                <tr 
                  key={session.id} 
                  onClick={() => onSelectSession(session)}
                  className="hover:bg-gray-800/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-medium text-blue-400 group-hover:text-blue-300">
                    {session.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-300 max-w-xs truncate">
                    {session.query}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold border ${
                      session.status === "completed" 
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/30" 
                        : "bg-red-950/40 text-red-400 border-red-900/30"
                    }`}>
                      {session.status === "completed" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {session.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300 font-mono">
                    {session.latency}s
                  </td>
                  <td className="py-3 px-4 text-gray-400 font-mono">
                    {session.tokens.total}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-300 font-mono font-medium">
                    ${session.cost.toFixed(6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
